import pg from 'pg';

const { Client } = pg;

const TABLES = [
  'requesters',
  'projects',
  'contractors',
  'bid_invites',
  'bids',
  'admin_notes',
];
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'mimaarlink-files';

function requiredEnv(...names) {
  const name = names.find((candidate) => process.env[candidate]);
  if (!name) throw new Error(`Missing required environment variable: ${names.join(' or ')}`);
  return process.env[name];
}

function optionalEnv(...names) {
  const name = names.find((candidate) => process.env[candidate]);
  return name ? process.env[name] : '';
}

function connection(prefix) {
  const names = [
    `${prefix}_POSTGRES_URL_NON_POOLING`,
    `${prefix}_POSTGRES_URL`,
    `${prefix}_DATABASE_URL`,
  ];
  if (prefix === 'NEW') names.push('POSTGRES_URL_NON_POOLING', 'POSTGRES_URL', 'DATABASE_URL');
  return requiredEnv(...names);
}

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function createClient(connectionString) {
  const parsed = new URL(connectionString);
  parsed.searchParams.delete('sslmode');
  parsed.searchParams.delete('uselibpqcompat');
  const client = new Client({
    connectionString: parsed.toString(),
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  return client;
}

async function tableExists(client, table) {
  const result = await client.query(
    `select exists (
       select 1 from information_schema.tables
       where table_schema = 'public' and table_name = $1
     ) as exists`,
    [table],
  );
  return result.rows[0].exists;
}

async function columns(client, table) {
  const result = await client.query(
    `select column_name
       from information_schema.columns
      where table_schema = 'public' and table_name = $1
      order by ordinal_position`,
    [table],
  );
  return result.rows.map((row) => row.column_name);
}

async function columnTypes(client, table) {
  const result = await client.query(
    `select column_name, data_type
       from information_schema.columns
      where table_schema = 'public' and table_name = $1`,
    [table],
  );
  return new Map(result.rows.map((row) => [row.column_name, row.data_type]));
}

async function countRows(client, table) {
  if (!(await tableExists(client, table))) return null;
  const result = await client.query(`select count(*)::int as count from ${quoteIdentifier(table)}`);
  return result.rows[0].count;
}

async function countConsultants(client) {
  if (!(await tableExists(client, 'contractors'))) return null;
  const contractorColumns = await columns(client, 'contractors');
  if (!contractorColumns.includes('provider_type')) return 0;
  const result = await client.query(
    `select count(*)::int as count from contractors where provider_type = 'consultant'`,
  );
  return result.rows[0].count;
}

async function inspectDatabase(client) {
  const tables = {};
  for (const table of TABLES) tables[table] = await countRows(client, table);
  const storageResult = await client.query(
    `select count(*)::int as count from storage.objects where bucket_id = $1`,
    [STORAGE_BUCKET],
  );
  return {
    tables,
    consultants: await countConsultants(client),
    storageObjects: storageResult.rows[0].count,
  };
}

async function migrateTable(source, destination, table) {
  if (!(await tableExists(source, table))) return { source: null, inserted: 0 };
  if (!(await tableExists(destination, table))) {
    throw new Error(`Destination table does not exist: ${table}`);
  }

  const sourceColumns = await columns(source, table);
  const destinationColumns = new Set(await columns(destination, table));
  const destinationTypes = await columnTypes(destination, table);
  const sharedColumns = sourceColumns.filter((column) => destinationColumns.has(column));
  if (!sharedColumns.includes('id')) throw new Error(`Table ${table} has no shared id column`);

  const selected = sharedColumns.map(quoteIdentifier).join(', ');
  const rows = (await source.query(`select ${selected} from ${quoteIdentifier(table)}`)).rows;
  let inserted = 0;

  for (const row of rows) {
    const values = sharedColumns.map((column) => {
      const value = row[column];
      if (value !== null && ['json', 'jsonb'].includes(destinationTypes.get(column))) {
        return JSON.stringify(value);
      }
      return value;
    });
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const result = await destination.query(
      `insert into ${quoteIdentifier(table)} (${selected}) values (${placeholders})
       on conflict (id) do nothing`,
      values,
    );
    inserted += result.rowCount;
  }

  return { source: rows.length, inserted };
}

function objectUrl(baseUrl, bucket, objectName) {
  const encodedPath = objectName.split('/').map(encodeURIComponent).join('/');
  return `${baseUrl.replace(/\/$/, '')}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`;
}

async function migrateStorage(source, destination) {
  const sourceUrl = optionalEnv('OLD_SUPABASE_URL', 'OLD_NEXT_PUBLIC_SUPABASE_URL');
  const sourceKey = optionalEnv('OLD_SUPABASE_SERVICE_ROLE_KEY');
  const destinationUrl = optionalEnv(
    'NEW_SUPABASE_URL',
    'NEW_NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
  );
  const destinationKey = optionalEnv('NEW_SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY');

  const objects = (
    await source.query(
      `select name, metadata from storage.objects where bucket_id = $1 order by name`,
      [STORAGE_BUCKET],
    )
  ).rows;

  if (objects.length && (!sourceUrl || !sourceKey || !destinationUrl || !destinationKey)) {
    throw new Error('Storage objects exist but prefixed Supabase service credentials are unavailable');
  }

  let copied = 0;
  let skipped = 0;
  const bucketResult = await destination.query(
    `select file_size_limit from storage.buckets where id = $1`,
    [STORAGE_BUCKET],
  );
  const originalLimit = bucketResult.rows[0]?.file_size_limit ?? null;
  try {
    for (const object of objects) {
      const destinationObjectUrl = objectUrl(destinationUrl, STORAGE_BUCKET, object.name);
      const existing = await fetch(destinationObjectUrl, {
        method: 'HEAD',
        headers: { apikey: destinationKey, Authorization: `Bearer ${destinationKey}` },
      });
      if (existing.ok) {
        skipped += 1;
        continue;
      }

      const sourceResponse = await fetch(objectUrl(sourceUrl, STORAGE_BUCKET, object.name), {
        headers: { apikey: sourceKey, Authorization: `Bearer ${sourceKey}` },
      });
      if (!sourceResponse.ok) {
        throw new Error(`Could not read storage object (${sourceResponse.status})`);
      }
      const body = await sourceResponse.arrayBuffer();
      await destination.query(
        `update storage.buckets
            set file_size_limit = greatest(coalesce(file_size_limit, 0), $2)
          where id = $1`,
        [STORAGE_BUCKET, body.byteLength],
      );

      const uploadResponse = await fetch(destinationObjectUrl, {
        method: 'POST',
        headers: {
          apikey: destinationKey,
          Authorization: `Bearer ${destinationKey}`,
          'Content-Type': object.metadata?.mimetype || 'application/octet-stream',
          'x-upsert': 'false',
        },
        body,
      });
      if (!uploadResponse.ok) {
        const detail = (await uploadResponse.text()).replaceAll(object.name, '[object]');
        throw new Error(`Could not copy storage object (${uploadResponse.status}): ${detail.slice(0, 300)}`);
      }
      copied += 1;
    }
  } finally {
    await destination.query(
      `update storage.buckets set file_size_limit = $2 where id = $1`,
      [STORAGE_BUCKET, originalLimit],
    );
  }

  const destinationCount = (
    await destination.query(
      `select count(*)::int as count from storage.objects where bucket_id = $1`,
      [STORAGE_BUCKET],
    )
  ).rows[0].count;
  return { source: objects.length, copied, skipped, destination: destinationCount };
}

async function verifyCopies(source, destination) {
  const tables = {};
  let missingRows = 0;
  for (const table of TABLES) {
    if (!(await tableExists(source, table))) {
      tables[table] = null;
      continue;
    }
    const sourceIds = (await source.query(`select id from ${quoteIdentifier(table)}`)).rows.map((row) => row.id);
    const destinationIds = sourceIds.length
      ? (await destination.query(
        `select id from ${quoteIdentifier(table)} where id = any($1::text[])`,
        [sourceIds],
      )).rows.map((row) => row.id)
      : [];
    const found = new Set(destinationIds);
    const missing = sourceIds.filter((id) => !found.has(id)).length;
    tables[table] = { source: sourceIds.length, present: destinationIds.length, missing };
    missingRows += missing;
  }

  const sourceObjects = (
    await source.query(
      `select name, metadata from storage.objects where bucket_id = $1`,
      [STORAGE_BUCKET],
    )
  ).rows;
  const sourceNames = sourceObjects.map((object) => object.name);
  const destinationObjects = sourceNames.length
    ? (await destination.query(
      `select name, metadata from storage.objects where bucket_id = $1 and name = any($2::text[])`,
      [STORAGE_BUCKET, sourceNames],
    )).rows
    : [];
  const destinationByName = new Map(destinationObjects.map((object) => [object.name, object]));
  let missingObjects = 0;
  let sizeMismatches = 0;
  for (const object of sourceObjects) {
    const recovered = destinationByName.get(object.name);
    if (!recovered) {
      missingObjects += 1;
      continue;
    }
    const sourceSize = Number(object.metadata?.size ?? -1);
    const destinationSize = Number(recovered.metadata?.size ?? -1);
    if (sourceSize >= 0 && destinationSize >= 0 && sourceSize !== destinationSize) sizeMismatches += 1;
  }

  const contractorIds = (await source.query('select id from contractors')).rows.map((row) => row.id);
  let liveContractorStatuses = 0;
  for (const id of contractorIds) {
    const response = await fetch(`https://mimaarlink.com/api/contractor-status/${encodeURIComponent(id)}`);
    if (response.ok) liveContractorStatuses += 1;
  }

  let liveFileDownloads = 0;
  for (const object of sourceObjects) {
    const encodedPath = object.name.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`https://mimaarlink.com/api/files/${encodedPath}`);
    if (response.ok) liveFileDownloads += 1;
  }

  return {
    ok: missingRows === 0
      && missingObjects === 0
      && sizeMismatches === 0
      && liveContractorStatuses === contractorIds.length
      && liveFileDownloads === sourceObjects.length,
    tables,
    storage: {
      source: sourceObjects.length,
      present: destinationObjects.length,
      missing: missingObjects,
      sizeMismatches,
      liveDownloads: liveFileDownloads,
    },
    liveContractorStatuses: {
      expected: contractorIds.length,
      available: liveContractorStatuses,
    },
  };
}

async function main() {
  const mode = process.argv[2] || 'inspect';
  if (!['inspect', 'migrate', 'verify'].includes(mode)) throw new Error('Use inspect, migrate, or verify');

  const source = await createClient(connection('OLD'));
  const destination = await createClient(connection('NEW'));
  try {
    const before = {
      source: await inspectDatabase(source),
      destination: await inspectDatabase(destination),
    };
    if (mode === 'inspect') {
      console.log(JSON.stringify({ mode, before }));
      return;
    }
    if (mode === 'verify') {
      const verification = await verifyCopies(source, destination);
      console.log(JSON.stringify({ mode, verification }));
      if (!verification.ok) process.exitCode = 1;
      return;
    }

    const storage = await migrateStorage(source, destination);
    const tables = {};
    await destination.query('begin');
    try {
      for (const table of TABLES) tables[table] = await migrateTable(source, destination, table);
      await destination.query('commit');
    } catch (error) {
      await destination.query('rollback');
      throw error;
    }

    const after = {
      source: await inspectDatabase(source),
      destination: await inspectDatabase(destination),
    };
    console.log(JSON.stringify({ mode, before, tables, storage, after }));
  } finally {
    await Promise.allSettled([source.end(), destination.end()]);
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ error: error.message }));
  process.exitCode = 1;
});
