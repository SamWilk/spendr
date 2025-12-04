/* eslint-env node */
/* global process */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.' })
  }

  try {

    let { data: data, error } = await supabase.auth.signInWithPassword({
      email: req.body.email,
      password: req.body.password
    });

    if (error) {
      return res.status(401).json({ now: new Date().toISOString(), note: '`Sign in` failed; returning server time as fallback', details: error.message })
    }

    return res.status(200).json({ data: data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Query failed', details: String(err) })
  }
}
