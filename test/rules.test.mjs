import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const skill = readFileSync('skills/rust-ownership/SKILL.md', 'utf8')
const evidence = readFileSync('EVIDENCE.md', 'utf8')
const manifest = JSON.parse(readFileSync('corpus/manifest.json', 'utf8'))

const codesIn = (s) => new Set(s.match(/E0\d{3}/g) ?? [])

// The point of the repo: a rule may only cite an error code the compiler really produced.
test('every error code named in SKILL.md was actually emitted by rustc', () => {
  const claimed = codesIn(skill)
  const observed = codesIn(evidence)
  assert.ok(claimed.size >= 6, 'skill should cover at least the six corpus codes')
  for (const code of claimed) {
    assert.ok(observed.has(code), `SKILL.md cites ${code} but EVIDENCE.md has no such compiler output`)
  }
})

test('every corpus program is represented in the evidence', () => {
  for (const c of manifest.cases) {
    assert.ok(evidence.includes(c.file), `${c.file} missing from EVIDENCE.md`)
  }
})

test('evidence records the compiler it came from', () => {
  assert.match(evidence, /Compiler: `rustc \d+\.\d+/)
})

test('the headline is computed, not asserted', () => {
  assert.match(evidence, /On \*\*\d+ of \d+\*\* corpus cases rustc offers/)
})

test('skill frontmatter is Agent Skills spec compliant', () => {
  assert.ok(skill.startsWith('---\n'), 'frontmatter must start on line 1')
  const fm = skill.slice(4, skill.indexOf('\n---\n', 3))
  const name = fm.match(/^name:\s*(.+)$/m)?.[1].trim()
  const description = fm.match(/^description:\s*(.+)$/m)?.[1].trim()
  assert.equal(name, 'rust-ownership', 'name must match the directory')
  assert.match(name, /^[a-z0-9]+(-[a-z0-9]+)*$/)
  assert.ok(description && description.length <= 1024)
})

test('the skill does not ban cloning outright', () => {
  assert.ok(skill.includes('When cloning IS right'), 'a rule that forbids all clones would be wrong and ignored')
})

// cachebill shipped a page whose prose contradicted its own generated figures.
// This makes that class of bug a test failure here.
test('README headline count matches the generated evidence', () => {
  const readme = readFileSync('README.md', 'utf8')
  const ev = evidence.match(/On \*\*(\d+) of (\d+)\*\* corpus cases rustc offers/)
  assert.ok(ev, 'EVIDENCE.md must state the computed headline')
  const [, silent, total] = ev
  assert.ok(
    readme.includes(`**${silent} of ${total} give the agent nothing to act on.**`),
    `README must state "${silent} of ${total}" to match EVIDENCE.md`
  )
})

test('every corpus program appears in the README table', () => {
  const readme = readFileSync('README.md', 'utf8')
  for (const c of manifest.cases) {
    assert.ok(readme.includes(c.file), `${c.file} missing from the README table`)
  }
})
