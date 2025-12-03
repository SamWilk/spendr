/* eslint-env node */
/* global process */
import postgres from '@supabase/postgres-js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send('Method Not Allowed')
  }

  const dbUrl = process.env.SUPABASE_DB_URL

  if (!dbUrl || dbUrl.includes('USER') || dbUrl.includes('PASSWORD') || dbUrl.includes('HOST')) {
    // Return a helpful error when not configured — in production you would set a real SUPABASE_DB_URL in Vercel environment variables
    return res.status(500).json({ error: 'SUPABASE_DB_URL not configured. Set SUPABASE_DB_URL env var to your Supabase Postgres connection string.' })
  }

  const sql = postgres(dbUrl)

  try {
    const { rows, error } = await sql`SELECT now()`
    if (error) throw error
    return res.status(200).json({ now: rows?.[0] ?? null })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Query failed', details: String(err) })
  }
}
