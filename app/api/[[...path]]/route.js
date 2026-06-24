import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { MAX_FILE_SIZE_BYTES, fileTooLargeMessage } from '@/lib/uploadLimits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { Pool } = pg;

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'mimaarlink-files';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD;
const SCHEMA_LOCK_KEY = [1296904524, 20260624];

let pool = null;
let schemaReady = null;

function ok(data, status = 200) {
  return NextResponse.json(data, { status });
}

function err(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function adminSessionValue() {
  return crypto.createHash('sha256').update(`mimaarlink-admin:${ADMIN_SESSION_SECRET}`).digest('hex');
}

function isAdminRequest(request) {
  return request.cookies.get('ml_admin_session')?.value === adminSessionValue();
}

function requireAdmin(request) {
  if (!isAdminRequest(request)) return err('Admin login required', 401);
  return null;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function getPool() {
  if (!POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not configured. Finish the Supabase/Vercel integration before using admin data and submissions.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: postgresConnectionString(),
      max: 3,
      ssl: { rejectUnauthorized: false },
    });
  }

  if (!schemaReady) {
    schemaReady = ensureSchema(pool).catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  await schemaReady;
  return pool;
}

function postgresConnectionString() {
  const url = new URL(POSTGRES_URL);
  // Supabase/Vercel connection strings include sslmode=require. node-postgres
  // treats that as its own SSL config and can ignore rejectUnauthorized:false.
  url.searchParams.delete('sslmode');
  return url.toString();
}

async function ensureSchema(db) {
  const client = await db.connect();
  let locked = false;
  try {
    await client.query('select pg_advisory_lock($1::integer, $2::integer)', SCHEMA_LOCK_KEY);
    locked = true;
    await ensureSchemaUnlocked(client);
  } finally {
    if (locked) {
      await client.query('select pg_advisory_unlock($1::integer, $2::integer)', SCHEMA_LOCK_KEY).catch((e) => {
        console.warn('Schema lock release skipped:', e.message);
      });
    }
    client.release();
  }
}

async function ensureSchemaUnlocked(db) {
  await db.query(`
    create table if not exists requesters (
      id text primary key,
      name text not null default '',
      company text not null default '',
      phone text not null default '',
      email text not null default '',
      role text not null default '',
      language_preference text not null default 'en',
      created_at timestamptz not null default now()
    );

    create table if not exists projects (
      id text primary key,
      requester_id text references requesters(id) on delete set null,
      category text not null default 'other',
      location text not null default '',
      description text not null default '',
      files jsonb not null default '[]'::jsonb,
      budget_range text not null default '',
      timeline text not null default '',
      status text not null default 'received',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists contractors (
      id text primary key,
      provider_type text not null default 'contractor',
      company_name text not null default '',
      cr_number text not null default '',
      contact_person text not null default '',
      whatsapp text not null default '',
      email text not null default '',
      categories jsonb not null default '[]'::jsonb,
      consultant_grade text not null default '',
      consultant_services jsonb not null default '[]'::jsonb,
      other_category_desc text not null default '',
      service_areas text not null default '',
      project_size_range text not null default '',
      documents jsonb not null default '[]'::jsonb,
      document_checks jsonb not null default '{}'::jsonb,
      verification_status text not null default 'applied',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists bid_invites (
      id text primary key,
      project_id text not null references projects(id) on delete cascade,
      contractor_id text not null references contractors(id) on delete cascade,
      invite_status text not null default 'sent',
      response_status text not null default 'pending',
      created_at timestamptz not null default now()
    );

    create table if not exists bids (
      id text primary key,
      project_id text not null references projects(id) on delete cascade,
      contractor_id text not null references contractors(id) on delete cascade,
      price numeric not null default 0,
      timeline text not null default '',
      exclusions text not null default '',
      warranty text not null default '',
      notes text not null default '',
      attachments jsonb not null default '[]'::jsonb,
      created_at timestamptz not null default now()
    );

    create table if not exists admin_notes (
      id text primary key,
      project_id text references projects(id) on delete cascade,
      contractor_id text references contractors(id) on delete cascade,
      note text not null default '',
      created_at timestamptz not null default now()
    );

    create index if not exists projects_created_at_idx on projects(created_at desc);
    create index if not exists contractors_created_at_idx on contractors(created_at desc);
    create index if not exists bids_project_id_idx on bids(project_id);
    create index if not exists bid_invites_project_id_idx on bid_invites(project_id);
    create index if not exists admin_notes_project_id_idx on admin_notes(project_id);

    alter table requesters enable row level security;
    alter table projects enable row level security;
    alter table contractors enable row level security;
    alter table bid_invites enable row level security;
    alter table bids enable row level security;
    alter table admin_notes enable row level security;
  `);

  await db.query(`
    alter table contractors
    add column if not exists document_checks jsonb not null default '{}'::jsonb;

    alter table contractors
    add column if not exists provider_type text not null default 'contractor';

    alter table contractors
    add column if not exists consultant_grade text not null default '';

    alter table contractors
    add column if not exists consultant_services jsonb not null default '[]'::jsonb;
  `);

  await ensureStorageBucket(db);
}

async function ensureStorageBucket(db) {
  try {
    await db.query(
      `
      insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      values (
        $1,
        $1,
        false,
        ${MAX_FILE_SIZE_BYTES},
        array['image/jpeg','image/png','image/webp','application/pdf']::text[]
      )
      on conflict (id) do update set
        public = false,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;
      `,
      [STORAGE_BUCKET],
    );

    await db.query(`
      do $$
      begin
        if not exists (
          select 1 from pg_policies
          where schemaname = 'storage'
            and tablename = 'objects'
            and policyname = 'mimaarlink_files_read'
        ) then
          create policy mimaarlink_files_read
          on storage.objects
          for select
          to anon
          using (bucket_id = '${STORAGE_BUCKET}');
        end if;

        if not exists (
          select 1 from pg_policies
          where schemaname = 'storage'
            and tablename = 'objects'
            and policyname = 'mimaarlink_files_insert'
        ) then
          create policy mimaarlink_files_insert
          on storage.objects
          for insert
          to anon
          with check (bucket_id = '${STORAGE_BUCKET}');
        end if;
      end $$;
    `);
  } catch (e) {
    console.warn('Storage bucket setup skipped:', e.message);
  }
}

function dbDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function storedArray(value) {
  if (Array.isArray(value)) return value;
  return [];
}

function storedObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  return {};
}

function defaultDocumentChecks(documents = []) {
  const labels = new Set(storedArray(documents).map((file) => file?.label).filter(Boolean));
  return {
    cr: labels.has('cr'),
    trade: labels.has('trade'),
    establishment: labels.has('establishment'),
  };
}

function normalizeDocumentChecks(checks, documents = []) {
  const fallback = defaultDocumentChecks(documents);
  const stored = storedObject(checks);
  const hasStored = Object.keys(stored).length > 0;
  const source = hasStored ? stored : fallback;
  return {
    cr: Boolean(source.cr),
    trade: Boolean(source.trade),
    establishment: Boolean(source.establishment),
  };
}

function fileForClient(file) {
  if (!file || typeof file !== 'object') return file;
  if (file.url && !file.data) return { ...file, data: file.url };
  return file;
}

function projectFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    requesterId: row.requester_id,
    category: row.category,
    location: row.location,
    description: row.description,
    files: storedArray(row.files).map(fileForClient),
    budgetRange: row.budget_range,
    timeline: row.timeline,
    status: row.status,
    createdAt: dbDate(row.created_at),
    updatedAt: dbDate(row.updated_at),
  };
}

function requesterFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    role: row.role,
    languagePreference: row.language_preference,
    createdAt: dbDate(row.created_at),
  };
}

function contractorFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    providerType: row.provider_type || 'contractor',
    companyName: row.company_name,
    crNumber: row.cr_number,
    contactPerson: row.contact_person,
    whatsapp: row.whatsapp,
    email: row.email,
    categories: storedArray(row.categories),
    consultantGrade: row.consultant_grade || '',
    consultantServices: storedArray(row.consultant_services),
    otherCategoryDesc: row.other_category_desc,
    serviceAreas: row.service_areas,
    projectSizeRange: row.project_size_range,
    documents: storedArray(row.documents).map(fileForClient),
    documentChecks: normalizeDocumentChecks(row.document_checks, row.documents),
    verificationStatus: row.verification_status,
    createdAt: dbDate(row.created_at),
    updatedAt: dbDate(row.updated_at),
  };
}

function contractorStatusFromRow(row) {
  const contractor = contractorFromRow(row);
  if (!contractor) return null;
  return {
    id: contractor.id,
    providerType: contractor.providerType,
    companyName: contractor.companyName,
    categories: contractor.categories,
    consultantGrade: contractor.consultantGrade,
    consultantServices: contractor.consultantServices,
    otherCategoryDesc: contractor.otherCategoryDesc,
    serviceAreas: contractor.serviceAreas,
    projectSizeRange: contractor.projectSizeRange,
    verificationStatus: contractor.verificationStatus,
    createdAt: contractor.createdAt,
    updatedAt: contractor.updatedAt,
    documentChecks: contractor.documentChecks,
    documents: contractor.documents.map((file) => ({
      name: file.name,
      label: file.label,
      type: file.type,
      size: file.size,
      url: file.url || file.data,
      data: file.data || file.url,
    })),
  };
}

function bidFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    contractorId: row.contractor_id,
    price: Number(row.price) || 0,
    timeline: row.timeline,
    exclusions: row.exclusions,
    warranty: row.warranty,
    notes: row.notes,
    attachments: storedArray(row.attachments).map(fileForClient),
    createdAt: dbDate(row.created_at),
  };
}

function inviteFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    contractorId: row.contractor_id,
    inviteStatus: row.invite_status,
    responseStatus: row.response_status,
    createdAt: dbDate(row.created_at),
  };
}

function noteFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    contractorId: row.contractor_id,
    note: row.note,
    createdAt: dbDate(row.created_at),
  };
}

function cleanFileName(name) {
  const fallback = 'file';
  const base = String(name || fallback).replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-');
  return base.replace(/^-|-$/g, '') || fallback;
}

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  };
}

function objectUrl(path) {
  return `/api/files/${path.split('/').map(encodeURIComponent).join('/')}`;
}

function storageBaseUrl() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.');
  }
  return SUPABASE_URL.replace(/\/$/, '');
}

async function uploadFiles(files, folder) {
  if (!Array.isArray(files) || files.length === 0) return [];
  const uploaded = [];

  for (const file of files) {
    if (!file?.data || !String(file.data).startsWith('data:')) {
      uploaded.push(fileForClient(file));
      continue;
    }

    const parsed = parseDataUrl(file.data);
    if (!parsed) {
      uploaded.push(file);
      continue;
    }

    if (parsed.buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(fileTooLargeMessage(file.name || 'File'));
    }

    const safeName = cleanFileName(file.name);
    const objectPath = `${folder}/${uuidv4()}-${safeName}`;
    const uploadUrl = `${storageBaseUrl()}/storage/v1/object/${STORAGE_BUCKET}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.type || parsed.mime || 'application/octet-stream',
        'x-upsert': 'false',
      },
      body: parsed.buffer,
    });

    if (!res.ok) {
      const details = await res.text().catch(() => '');
      throw new Error(`File upload failed for ${file.name || 'file'}${details ? `: ${details}` : ''}`);
    }

    const url = objectUrl(objectPath);
    uploaded.push({
      name: file.name || safeName,
      type: file.type || parsed.mime,
      size: parsed.buffer.length,
      label: file.label || null,
      path: objectPath,
      url,
      data: url,
      storage: 'supabase',
    });
  }

  return uploaded;
}

async function downloadFile(objectPath) {
  if (!objectPath) return err('File not found', 404);

  const res = await fetch(`${storageBaseUrl()}/storage/v1/object/${STORAGE_BUCKET}/${objectPath.split('/').map(encodeURIComponent).join('/')}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) return err('File not found', 404);

  const body = await res.arrayBuffer();
  const fileName = objectPath.split('/').pop() || 'file';

  return new NextResponse(body, {
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${fileName.replace(/"/g, '')}"`,
      'Cache-Control': 'private, max-age=300',
    },
  });
}

async function updateProjectStatusIfEarlier(db, projectId, targetStatus, now) {
  const order = ['received', 'reviewing', 'approved', 'contractors_invited', 'bids_received', 'shortlisted', 'meeting_arranged', 'closed'];
  const { rows } = await db.query('select status from projects where id = $1', [projectId]);
  const current = rows[0]?.status;
  if (current && order.indexOf(current) < order.indexOf(targetStatus)) {
    await db.query('update projects set status = $1, updated_at = $2 where id = $3', [targetStatus, now, projectId]);
  }
}

async function getContractorsByIds(db, ids) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];
  const { rows } = await db.query('select * from contractors where id = any($1::text[])', [uniqueIds]);
  return rows.map(contractorFromRow);
}

export async function GET(request, { params }) {
  try {
    const parts = params?.path || [];
    const path = parts.join('/');

    if (path.startsWith('files/')) {
      return downloadFile(parts.slice(1).join('/'));
    }

    const db = await getPool();
    const url = new URL(request.url);

    if (path === '' || path === 'health') return ok({ ok: true, name: 'MimaarLink API', database: 'supabase' });

    if (path === 'projects') {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const { rows } = await db.query('select * from projects order by created_at desc');
      return ok(rows.map(projectFromRow));
    }

    if (path.startsWith('projects/')) {
      const id = parts[1];
      const sub = parts[2];
      const { rows } = await db.query('select * from projects where id = $1', [id]);
      const project = projectFromRow(rows[0]);
      if (!project) return err('Not found', 404);

      if (sub === 'bids') {
        const { rows: bidRows } = await db.query('select * from bids where project_id = $1 order by created_at asc', [id]);
        const bids = bidRows.map(bidFromRow);
        const contractors = await getContractorsByIds(db, bids.map((b) => b.contractorId));
        const cmap = {};
        contractors.forEach((contractor) => {
          cmap[contractor.id] = contractor;
        });
        return ok({ project, bids, contractors: cmap });
      }

      if (sub === 'full') {
        const adminError = requireAdmin(request);
        if (adminError) return adminError;
        const [bidResult, inviteResult, noteResult, requesterResult] = await Promise.all([
          db.query('select * from bids where project_id = $1 order by created_at asc', [id]),
          db.query('select * from bid_invites where project_id = $1 order by created_at asc', [id]),
          db.query('select * from admin_notes where project_id = $1 order by created_at desc', [id]),
          project.requesterId ? db.query('select * from requesters where id = $1', [project.requesterId]) : Promise.resolve({ rows: [] }),
        ]);
        const bids = bidResult.rows.map(bidFromRow);
        const invites = inviteResult.rows.map(inviteFromRow);
        const contractors = await getContractorsByIds(db, [
          ...bids.map((b) => b.contractorId),
          ...invites.map((i) => i.contractorId),
        ]);

        return ok({
          project,
          requester: requesterFromRow(requesterResult.rows[0]),
          bids,
          invites,
          notes: noteResult.rows.map(noteFromRow),
          contractors,
        });
      }

      return ok(project);
    }

    if (path.startsWith('contractor-status/')) {
      const id = parts[1];
      const { rows } = await db.query('select * from contractors where id = $1', [id]);
      const contractor = contractorStatusFromRow(rows[0]);
      if (!contractor) return err('Not found', 404);
      return ok(contractor);
    }

    if (path === 'contractors') {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const status = url.searchParams.get('status');
      const result = status
        ? await db.query('select * from contractors where verification_status = $1 order by created_at desc', [status])
        : await db.query('select * from contractors order by created_at desc');
      return ok(result.rows.map(contractorFromRow));
    }

    if (path.startsWith('contractors/')) {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const id = parts[1];
      const { rows } = await db.query('select * from contractors where id = $1', [id]);
      const contractor = contractorFromRow(rows[0]);
      if (!contractor) return err('Not found', 404);
      return ok(contractor);
    }

    if (path === 'stats') {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const [projects, contractors, bids] = await Promise.all([
        db.query('select count(*)::int as count from projects'),
        db.query('select count(*)::int as count from contractors'),
        db.query('select count(*)::int as count from bids'),
      ]);
      return ok({
        projects: projects.rows[0].count,
        contractors: contractors.rows[0].count,
        bids: bids.rows[0].count,
      });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('GET error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function POST(request, { params }) {
  try {
    const parts = params?.path || [];
    const path = parts.join('/');
    const body = await readJson(request);
    const now = new Date().toISOString();

    if (path === 'admin/login') {
      if (body.password === ADMIN_PASSWORD) {
        const response = ok({ ok: true });
        response.cookies.set('ml_admin_session', adminSessionValue(), {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 12,
          path: '/',
        });
        return response;
      }
      return err('Invalid password', 401);
    }

    if (path === 'admin/logout') {
      const response = ok({ ok: true });
      response.cookies.set('ml_admin_session', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    const db = await getPool();

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
      const projectId = uuidv4();
      const files = await uploadFiles(body.files, `projects/${projectId}`);

      await db.query(
        `
        insert into requesters (id, name, company, phone, email, role, language_preference, created_at)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [requester.id, requester.name, requester.company, requester.phone, requester.email, requester.role, requester.languagePreference, now],
      );

      const project = {
        id: projectId,
        requesterId: requester.id,
        category: body.category || 'other',
        location: body.location || '',
        description: body.description || '',
        files,
        budgetRange: body.budgetRange || '',
        timeline: body.timeline || '',
        status: 'received',
        createdAt: now,
        updatedAt: now,
      };

      await db.query(
        `
        insert into projects (id, requester_id, category, location, description, files, budget_range, timeline, status, created_at, updated_at)
        values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11)
        `,
        [
          project.id,
          project.requesterId,
          project.category,
          project.location,
          project.description,
          JSON.stringify(project.files),
          project.budgetRange,
          project.timeline,
          project.status,
          now,
          now,
        ],
      );

      return ok({ project, requester });
    }

    if (path === 'contractors') {
      const contractorId = uuidv4();
      const documents = await uploadFiles(body.documents, `contractors/${contractorId}`);
      const documentChecks = defaultDocumentChecks(documents);
      const contractor = {
        id: contractorId,
        providerType: body.providerType === 'consultant' ? 'consultant' : 'contractor',
        companyName: body.companyName || '',
        crNumber: body.crNumber || '',
        contactPerson: body.contactPerson || '',
        whatsapp: body.whatsapp || '',
        email: body.email || '',
        categories: Array.isArray(body.categories) ? body.categories : [],
        consultantGrade: body.consultantGrade || '',
        consultantServices: Array.isArray(body.consultantServices) ? body.consultantServices : [],
        otherCategoryDesc: body.otherCategoryDesc || '',
        serviceAreas: body.serviceAreas || '',
        projectSizeRange: body.projectSizeRange || '',
        documents,
        documentChecks,
        verificationStatus: 'applied',
        createdAt: now,
        updatedAt: now,
      };

      await db.query(
        `
        insert into contractors (
          id, provider_type, company_name, cr_number, contact_person, whatsapp, email,
          categories, consultant_grade, consultant_services, other_category_desc,
          service_areas, project_size_range, documents, document_checks,
          verification_status, created_at, updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb, $11, $12, $13, $14::jsonb, $15::jsonb, $16, $17, $18)
        `,
        [
          contractor.id,
          contractor.providerType,
          contractor.companyName,
          contractor.crNumber,
          contractor.contactPerson,
          contractor.whatsapp,
          contractor.email,
          JSON.stringify(contractor.categories),
          contractor.consultantGrade,
          JSON.stringify(contractor.consultantServices),
          contractor.otherCategoryDesc,
          contractor.serviceAreas,
          contractor.projectSizeRange,
          JSON.stringify(contractor.documents),
          JSON.stringify(contractor.documentChecks),
          contractor.verificationStatus,
          now,
          now,
        ],
      );

      return ok(contractor);
    }

    if (path === 'bids') {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const bidId = uuidv4();
      const attachments = await uploadFiles(body.attachments, `bids/${bidId}`);
      const bid = {
        id: bidId,
        projectId: body.projectId,
        contractorId: body.contractorId,
        price: Number(body.price) || 0,
        timeline: body.timeline || '',
        exclusions: body.exclusions || '',
        warranty: body.warranty || '',
        notes: body.notes || '',
        attachments,
        createdAt: now,
      };

      await db.query(
        `
        insert into bids (id, project_id, contractor_id, price, timeline, exclusions, warranty, notes, attachments, created_at)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
        `,
        [
          bid.id,
          bid.projectId,
          bid.contractorId,
          bid.price,
          bid.timeline,
          bid.exclusions,
          bid.warranty,
          bid.notes,
          JSON.stringify(bid.attachments),
          now,
        ],
      );
      await updateProjectStatusIfEarlier(db, bid.projectId, 'bids_received', now);
      return ok(bid);
    }

    if (path === 'bidinvites') {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const invite = {
        id: uuidv4(),
        projectId: body.projectId,
        contractorId: body.contractorId,
        inviteStatus: 'sent',
        responseStatus: 'pending',
        createdAt: now,
      };
      await db.query(
        `
        insert into bid_invites (id, project_id, contractor_id, invite_status, response_status, created_at)
        values ($1, $2, $3, $4, $5, $6)
        `,
        [invite.id, invite.projectId, invite.contractorId, invite.inviteStatus, invite.responseStatus, now],
      );
      await updateProjectStatusIfEarlier(db, invite.projectId, 'contractors_invited', now);
      return ok(invite);
    }

    if (path === 'adminnotes') {
      const adminError = requireAdmin(request);
      if (adminError) return adminError;
      const note = {
        id: uuidv4(),
        projectId: body.projectId || null,
        contractorId: body.contractorId || null,
        note: body.note || '',
        createdAt: now,
      };
      await db.query(
        'insert into admin_notes (id, project_id, contractor_id, note, created_at) values ($1, $2, $3, $4, $5)',
        [note.id, note.projectId, note.contractorId, note.note, now],
      );
      return ok(note);
    }

    if (path === 'projects/shortlist') {
      const newStatus = body.action === 'meeting' ? 'meeting_arranged' : 'shortlisted';
      await db.query('update projects set status = $1, updated_at = $2 where id = $3', [newStatus, now, body.projectId]);
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
    const db = await getPool();
    const parts = params?.path || [];
    const path = parts.join('/');
    const body = await readJson(request);
    const now = new Date().toISOString();
    const adminError = requireAdmin(request);
    if (adminError) return adminError;

    if (path.startsWith('projects/')) {
      const id = parts[1];
      if (body.status) {
        await db.query('update projects set status = $1, updated_at = $2 where id = $3', [body.status, now, id]);
      }
      const { rows } = await db.query('select * from projects where id = $1', [id]);
      return ok(projectFromRow(rows[0]));
    }

    if (path.startsWith('contractors/')) {
      const id = parts[1];
      const fields = [];
      const values = [];
      const addField = (column, value, cast = '') => {
        values.push(value);
        fields.push(`${column} = $${values.length}${cast}`);
      };
      if (body.verificationStatus) {
        addField('verification_status', body.verificationStatus);
      }
      if (body.documentChecks) {
        addField('document_checks', JSON.stringify(normalizeDocumentChecks(body.documentChecks)), '::jsonb');
      }
      if (fields.length > 0) {
        values.push(now);
        fields.push(`updated_at = $${values.length}`);
        values.push(id);
        await db.query(`update contractors set ${fields.join(', ')} where id = $${values.length}`, values);
      }
      const { rows } = await db.query('select * from contractors where id = $1', [id]);
      return ok(contractorFromRow(rows[0]));
    }

    if (path.startsWith('bids/')) {
      const id = parts[1];
      const fields = [];
      const values = [];

      const addField = (column, value, cast = '') => {
        values.push(value);
        fields.push(`${column} = $${values.length}${cast}`);
      };

      if (body.attachments) {
        const attachments = await uploadFiles(body.attachments, `bids/${id}`);
        addField('attachments', JSON.stringify(attachments), '::jsonb');
      }
      if (body.price !== undefined) addField('price', Number(body.price) || 0);
      if (body.timeline !== undefined) addField('timeline', body.timeline || '');
      if (body.warranty !== undefined) addField('warranty', body.warranty || '');
      if (body.exclusions !== undefined) addField('exclusions', body.exclusions || '');
      if (body.notes !== undefined) addField('notes', body.notes || '');

      if (fields.length > 0) {
        values.push(id);
        await db.query(`update bids set ${fields.join(', ')} where id = $${values.length}`, values);
      }

      const { rows } = await db.query('select * from bids where id = $1', [id]);
      return ok(bidFromRow(rows[0]));
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('PATCH error', e);
    return err(e.message || 'Server error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getPool();
    const parts = params?.path || [];
    const path = parts.join('/');
    const adminError = requireAdmin(request);
    if (adminError) return adminError;

    if (path.startsWith('projects/')) {
      const id = parts[1];
      await db.query('delete from projects where id = $1', [id]);
      return ok({ ok: true });
    }

    if (path.startsWith('contractors/')) {
      const id = parts[1];
      await db.query('delete from contractors where id = $1', [id]);
      return ok({ ok: true });
    }

    if (path.startsWith('bids/')) {
      const id = parts[1];
      await db.query('delete from bids where id = $1', [id]);
      return ok({ ok: true });
    }

    if (path.startsWith('bidinvites/')) {
      const id = parts[1];
      await db.query('delete from bid_invites where id = $1', [id]);
      return ok({ ok: true });
    }

    return err('Not found', 404);
  } catch (e) {
    console.error('DELETE error', e);
    return err(e.message || 'Server error', 500);
  }
}
