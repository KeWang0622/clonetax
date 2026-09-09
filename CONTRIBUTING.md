# Contributing

```bash
git clone https://github.com/KeWang0622/clonetax.git && cd clonetax
bash scripts/dev.sh install
bash scripts/dev.sh example   # recompiles the corpus, regenerates EVIDENCE.md
bash scripts/dev.sh test
```

**Adding a corpus case:** drop a failing `.rs` file in `corpus/`, add its entry to
`corpus/manifest.json`, run `node scripts/extract.mjs`, and commit the regenerated
`EVIDENCE.md` with it.

**Never hand-edit `EVIDENCE.md`.** It is the compiler's output, not ours. A rule in
`SKILL.md` may only cite an error code that appears there — a test enforces this.
