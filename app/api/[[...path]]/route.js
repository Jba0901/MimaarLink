import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'mimarlink';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let cachedClient = null;
async function getDb() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not configured. Add a production database before using admin data and submissions.');
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

function ok(data, status = 200) { return NextResponse.json(data, { status }); }
function err(message, status = 400) { return NextResponse.json({ error: message }, { status }); }

async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

async function seedIfEmpty(db) {
  const projCount = await db.collection('projects').countDocuments();
  const conCount = await db.collection('contractors').countDocuments();
  if (projCount > 0 || conCount > 0) return;

  const now = new Date().toISOString();
  const requesters = [
    { id: uuidv4(), name: 'Ahmed Al-Mansoori', company: 'Lusail Tower Co.', phone: '+97433001122', email: 'ahmed@example.qa', role: 'Facility Manager', languagePreference: 'en', createdAt: now },
    { id: uuidv4(), name: 'سارة العبدالله', company: 'Pearl Retail', phone: '+97455667788', email: 'sara@example.qa', role: 'مالكة', languagePreference: 'ar', createdAt: now },
  ];
  await db.collection('requesters').insertMany(requesters);

  const contractors = [
    { id: uuidv4(), companyName: 'Doha Build Pro', crNumber: 'CR-1023445', contactPerson: 'Khalid Hassan', whatsapp: '+97470001111', email: 'khalid@dohabuildpro.qa', categories: ['fitout','civil','joinery'], serviceAreas: 'Doha, Lusail, West Bay', projectSizeRange: '50,000 - 500,000', documents: [], verificationStatus: 'verified', createdAt: now, updatedAt: now },
    { id: uuidv4(), companyName: 'Gulf MEP Solutions', crNumber: 'CR-2055118', contactPerson: 'Omar Al-Thani', whatsapp: '+97470002222', email: 'omar@gulfmep.qa', categories: ['mep','hvac','electrical'], serviceAreas: 'All Qatar', projectSizeRange: '100,000 - 2,000,000', documents: [], verificationStatus: 'verified', createdAt: now, updatedAt: now },
    { id: uuidv4(), companyName: 'Al Waab Interiors', crNumber: 'CR-3088121', contactPerson: 'Yousef Karim', whatsapp: '+97470003333', email: 'yousef@alwaabint.qa', categories: ['fitout','painting','flooring','joinery'], serviceAreas: 'Doha, Al Waab, Al Rayyan', projectSizeRange: '30,000 - 300,000', documents: [], verificationStatus: 'verified', createdAt: now, updatedAt: now },
    { id: uuidv4(), companyName: 'Aspire Aluminum & Glass', crNumber: 'CR-4011009', contactPerson: 'Mahmoud Saleh', whatsapp: '+97470004444', email: 'mahmoud@aspireag.qa', categories: ['aluminum','fitout'], serviceAreas: 'Doha, Lusail', projectSizeRange: '20,000 - 250,000', documents: [], verificationStatus: 'under_review', createdAt: now, updatedAt: now },
  ];
  await db.collection('contractors').insertMany(contractors);

  const project1Id = uuidv4();
  const project2Id = uuidv4();
  const projects = [
    { id: project1Id, requesterId: requesters[0].id, category: 'fitout', location: 'West Bay, Doha', description: 'Fit-out for a 250 sqm office on the 14th floor. Includes partitions, flooring, ceiling, lighting, and pantry.', files: [], budgetRange: '180,000 - 240,000 QAR', timeline: 'Start in 3 weeks, finish in 6 weeks', status: 'bids_received', createdAt: now, updatedAt: now },
    { id: project2Id, requesterId: requesters[1].id, category: 'hvac', location: 'The Pearl, Doha', description: 'Replace 4 split AC units in retail shop and add ducting for storage area.', files: [], budgetRange: '40,000 - 60,000 QAR', timeline: 'Within 1 month', status: 'reviewing', createdAt: now, updatedAt: now },
  ];
  await db.collection('projects').insertMany(projects);

  const invites = [
    { id: uuidv4(), projectId: project1Id, contractorId: contractors[0].id, inviteStatus: 'sent', responseStatus: 'submitted', createdAt: now },
    { id: uuidv4(), projectId: project1Id, contractorId: contractors[2].id, inviteStatus: 'sent', responseStatus: 'submitted', createdAt: now },
    { id: uuidv4(), projectId: project1Id, contractorId: contractors[1].id, inviteStatus: 'sent', responseStatus: 'submitted', createdAt: now },
  ];
  await db.collection('bidinvites').insertMany(invites);

  const bids = [
    { id: uuidv4(), projectId: project1Id, contractorId: contractors[0].id, price: 198000, timeline: '5 weeks', exclusions: 'IT cabling, furniture', warranty: '12 months on workmanship', notes: 'Includes premium vinyl flooring and LED lighting.', attachments: [], createdAt: now },
    { id: uuidv4(), projectId: project1Id, contractorId: contractors[2].id, price: 215000, timeline: '4 weeks', exclusions: 'AC and electrical main DB', warranty: '18 months on workmanship', notes: 'Premium finish with imported tiles.', attachments: [], createdAt: now },
    { id: uuidv4(), projectId: project1Id, contractorId: contractors[1].id, price: 232000, timeline: '6 weeks', exclusions: 'Painting and joinery', warranty: '24 months on MEP works', notes: 'Includes upgraded HVAC and smart lighting.', attachments: [], createdAt: now },
  ];
  await db.collection('bids').insertMany(bids);
}

function stripMongo(doc) { if (!doc) return doc; const { _id, ...rest } = doc; return rest; }

export async function GET(request, { params }) {
  try {
    const db = await getDb();
    await seedIfEmpty(db);
    const path = (params?.path || []).join('/');
    const url = new URL(request.url);

    if (path === '' || path === 'health') return ok({ ok: true, name: 'MimarLink API' });

    if (path === 'projects') {
      const docs = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
      return ok(docs.map(stripMongo));
    }
    if (path.startsWith('projects/')) {
      const id = path.split('/')[1];
      const sub = path.split('/')[2];
      const project = await db.collection('projects').findOne({ id });
      if (!project) return err('Not found', 404);
      if (sub === 'bids') {
        const bids = await db.collection('bids').find({ projectId: id }).sort({ createdAt: 1 }).toArray();
        const contractorIds = [...new Set(bids.map(b => b.contractorId))];
        const contractors = await db.collection('contractors').find({ id: { $in: contractorIds } }).toArray();
        const cmap = {};
        contractors.forEach(c => { cmap[c.id] = stripMongo(c); });
        return ok({ project: stripMongo(project), bids: bids.map(stripMongo), contractors: cmap });
      }
      if (sub === 'full') {
        const bids = await db.collection('bids').find({ projectId: id }).sort({ createdAt: 1 }).toArray();
        const invites = await db.collection('bidinvites').find({ projectId: id }).toArray();
        const notes = await db.collection('adminnotes').find({ projectId: id }).sort({ createdAt: -1 }).toArray();
        const requester = project.requesterId ? await db.collection('requesters').findOne({ id: project.requesterId }) : null;
        const cIds = [...new Set([...bids.map(b => b.contractorId), ...invites.map(i => i.contractorId)])];
        const contractors = await db.collection('contractors').find({ id: { $in: cIds } }).toArray();
        return ok({
          project: stripMongo(project),
          requester: stripMongo(requester),
          bids: bids.map(stripMongo),
          invites: invites.map(stripMongo),
          notes: notes.map(stripMongo),
          contractors: contractors.map(stripMongo),
        });
      }
      return ok(stripMongo(project));
    }

    if (path === 'contractors') {
      const status = url.searchParams.get('status');
      const filter = status ? { verificationStatus: status } : {};
      const docs = await db.collection('contractors').find(filter).sort({ createdAt: -1 }).toArray();
      return ok(docs.map(stripMongo));
    }
    if (path.startsWith('contractors/')) {
      const id = path.split('/')[1];
      const c = await db.collection('contractors').findOne({ id });
      if (!c) return err('Not found', 404);
      return ok(stripMongo(c));
    }

    if (path === 'stats') {
      const projects = await db.collection('projects').countDocuments();
      const contractors = await db.collection('contractors').countDocuments();
      const bids = await db.collection('bids').countDocuments();
      return ok({ projects, contractors, bids });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('GET error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function POST(request, { params }) {
  try {
    const path = (params?.path || []).join('/');
    const body = await readJson(request);
    const now = new Date().toISOString();

    if (path === 'admin/login') {
      if (body.password === ADMIN_PASSWORD) return ok({ ok: true, token: 'admin-' + Date.now() });
      return err('Invalid password', 401);
    }

    const db = await getDb();

    if (path === 'projects') {
      const requester = {
        id: uuidv4(),
        name: body.name || '',
        company: body.company || '',
        phone: body.phone || '',
        email: body.email || '',
        role: body.role || '',
        languagePreference: body.languagePreference || 'en',
        createdAt: now,
      };
      await db.collection('requesters').insertOne(requester);
      const project = {
        id: uuidv4(),
        requesterId: requester.id,
        category: body.category || 'other',
        location: body.location || '',
        description: body.description || '',
        files: Array.isArray(body.files) ? body.files : [],
        budgetRange: body.budgetRange || '',
        timeline: body.timeline || '',
        status: 'received',
        createdAt: now,
        updatedAt: now,
      };
      await db.collection('projects').insertOne(project);
      return ok({ project: stripMongo(project), requester: stripMongo(requester) });
    }

    if (path === 'contractors') {
      const c = {
        id: uuidv4(),
        companyName: body.companyName || '',
        crNumber: body.crNumber || '',
        contactPerson: body.contactPerson || '',
        whatsapp: body.whatsapp || '',
        email: body.email || '',
        categories: Array.isArray(body.categories) ? body.categories : [],
        otherCategoryDesc: body.otherCategoryDesc || '',
        serviceAreas: body.serviceAreas || '',
        projectSizeRange: body.projectSizeRange || '',
        documents: Array.isArray(body.documents) ? body.documents : [],
        verificationStatus: 'applied',
        createdAt: now,
        updatedAt: now,
      };
      await db.collection('contractors').insertOne(c);
      return ok(stripMongo(c));
    }

    if (path === 'bids') {
      const bid = {
        id: uuidv4(),
        projectId: body.projectId,
        contractorId: body.contractorId,
        price: Number(body.price) || 0,
        timeline: body.timeline || '',
        exclusions: body.exclusions || '',
        warranty: body.warranty || '',
        notes: body.notes || '',
        attachments: Array.isArray(body.attachments) ? body.attachments : [],
        createdAt: now,
      };
      await db.collection('bids').insertOne(bid);
      // upgrade project status if still earlier
      const project = await db.collection('projects').findOne({ id: bid.projectId });
      if (project) {
        const order = ['received','reviewing','approved','contractors_invited','bids_received','shortlisted','meeting_arranged','closed'];
        if (order.indexOf(project.status) < order.indexOf('bids_received')) {
          await db.collection('projects').updateOne({ id: bid.projectId }, { $set: { status: 'bids_received', updatedAt: now } });
        }
      }
      return ok(stripMongo(bid));
    }

    if (path === 'bidinvites') {
      const invite = {
        id: uuidv4(),
        projectId: body.projectId,
        contractorId: body.contractorId,
        inviteStatus: 'sent',
        responseStatus: 'pending',
        createdAt: now,
      };
      await db.collection('bidinvites').insertOne(invite);
      const project = await db.collection('projects').findOne({ id: body.projectId });
      if (project) {
        const order = ['received','reviewing','approved','contractors_invited','bids_received','shortlisted','meeting_arranged','closed'];
        if (order.indexOf(project.status) < order.indexOf('contractors_invited')) {
          await db.collection('projects').updateOne({ id: body.projectId }, { $set: { status: 'contractors_invited', updatedAt: now } });
        }
      }
      return ok(stripMongo(invite));
    }

    if (path === 'adminnotes') {
      const note = {
        id: uuidv4(),
        projectId: body.projectId || null,
        contractorId: body.contractorId || null,
        note: body.note || '',
        createdAt: now,
      };
      await db.collection('adminnotes').insertOne(note);
      return ok(stripMongo(note));
    }

    if (path === 'projects/shortlist') {
      // body: { projectId, contractorId, action: 'shortlist' | 'meeting' }
      const { projectId, action } = body;
      const newStatus = action === 'meeting' ? 'meeting_arranged' : 'shortlisted';
      await db.collection('projects').updateOne({ id: projectId }, { $set: { status: newStatus, updatedAt: now } });
      return ok({ ok: true, status: newStatus });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('POST error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const db = await getDb();
    const path = (params?.path || []).join('/');
    const body = await readJson(request);
    const now = new Date().toISOString();

    if (path.startsWith('projects/')) {
      const id = path.split('/')[1];
      const update = { updatedAt: now };
      if (body.status) update.status = body.status;
      await db.collection('projects').updateOne({ id }, { $set: update });
      const proj = await db.collection('projects').findOne({ id });
      return ok(stripMongo(proj));
    }
    if (path.startsWith('contractors/')) {
      const id = path.split('/')[1];
      const update = { updatedAt: now };
      if (body.verificationStatus) update.verificationStatus = body.verificationStatus;
      await db.collection('contractors').updateOne({ id }, { $set: update });
      const c = await db.collection('contractors').findOne({ id });
      return ok(stripMongo(c));
    }
    if (path.startsWith('bids/')) {
      const id = path.split('/')[1];
      const update = {};
      if (body.attachments) update.attachments = body.attachments;
      if (body.price !== undefined) update.price = Number(body.price);
      if (body.timeline !== undefined) update.timeline = body.timeline;
      if (body.warranty !== undefined) update.warranty = body.warranty;
      if (body.exclusions !== undefined) update.exclusions = body.exclusions;
      if (body.notes !== undefined) update.notes = body.notes;
      await db.collection('bids').updateOne({ id }, { $set: update });
      const bid = await db.collection('bids').findOne({ id });
      return ok(stripMongo(bid));
    }
    return err('Not found', 404);
  } catch (e) {
    console.error('PATCH error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const path = (params?.path || []).join('/');

    if (path.startsWith('projects/')) {
      const id = path.split('/')[1];
      await db.collection('projects').deleteOne({ id });
      await db.collection('bids').deleteMany({ projectId: id });
      await db.collection('bidinvites').deleteMany({ projectId: id });
      await db.collection('adminnotes').deleteMany({ projectId: id });
      return ok({ ok: true });
    }
    if (path.startsWith('contractors/')) {
      const id = path.split('/')[1];
      await db.collection('contractors').deleteOne({ id });
      await db.collection('bids').deleteMany({ contractorId: id });
      await db.collection('bidinvites').deleteMany({ contractorId: id });
      await db.collection('adminnotes').deleteMany({ contractorId: id });
      return ok({ ok: true });
    }
    if (path.startsWith('bids/')) {
      const id = path.split('/')[1];
      await db.collection('bids').deleteOne({ id });
      return ok({ ok: true });
    }
    if (path.startsWith('bidinvites/')) {
      const id = path.split('/')[1];
      await db.collection('bidinvites').deleteOne({ id });
      return ok({ ok: true });
    }
    return err('Not found', 404);
  } catch (e) {
    console.error('DELETE error', e);
    return err(e.message || 'Server error', 500);
  }
}

