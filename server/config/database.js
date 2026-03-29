import pg from 'pg'

const host = (process.env.PGHOST ?? '').trim()

// Only skip TLS for a real loopback TCP host. Do NOT treat an empty PGHOST as
// "local" — that disabled SSL and caused Render to reject with "SSL/TLS required".
const isLocalPostgres =
    host === 'localhost' ||
    host === '127.0.0.1'

const portRaw = process.env.PGPORT
const port =
    portRaw !== undefined && portRaw !== '' && portRaw !== null
        ? Number(portRaw)
        : undefined

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: host || undefined,
    port,
    database: process.env.PGDATABASE,
}

// Render (and most cloud Postgres) require TLS. Local Postgres on localhost
// usually does not — opt out with PGSSLMODE=disable if your DB rejects SSL.
const sslDisabled = process.env.PGSSLMODE === 'disable'
const shouldUseSsl = !sslDisabled && !isLocalPostgres

if (shouldUseSsl) {
    config.ssl = { rejectUnauthorized: false }
}

export const pool = new pg.Pool(config)
