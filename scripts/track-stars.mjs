#!/usr/bin/env node
/**
 * Append today's star count to LAUNCH/stars.csv.
 *
 * The launch target was "200 stars in 3 days". A target nobody measures is a
 * wish, so this records the actual number on a schedule and lets the outcome be
 * checked against LAUNCH/baseline.json instead of asserted afterwards.
 *
 * Usage: node scripts/track-stars.mjs [owner/repo ...]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const CSV = 'LAUNCH/stars.csv'
const HEADER = 'recorded_at_utc,repo,stars,days_since_baseline'
const MS_PER_DAY = 86_400_000

const repos = process.argv.slice(2)
if (repos.length === 0) repos.push('KeWang0622/clonetax', 'KeWang0622/cachebill')

const baseline = JSON.parse(readFileSync('LAUNCH/baseline.json', 'utf8'))
const t0 = new Date(baseline.recorded_at_utc)
const now = new Date()
const days = ((now - t0) / MS_PER_DAY).toFixed(2)

async function stars (repo) {
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'clonetax-star-tracker' }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers })
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${repo}`)
  return (await res.json()).stargazers_count
}

const rows = []
for (const repo of repos) {
  try {
    const n = await stars(repo)
    rows.push(`${now.toISOString()},${repo},${n},${days}`)
    console.log(`${repo}: ${n} stars (day ${days})`)
  } catch (err) {
    console.error(`skipping ${repo}: ${err.message}`)
  }
}

if (rows.length === 0) process.exit(1)
const existing = existsSync(CSV) ? readFileSync(CSV, 'utf8').trimEnd() : HEADER
writeFileSync(CSV, existing + '\n' + rows.join('\n') + '\n')
