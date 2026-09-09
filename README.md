# clonetax

**Your coding agent doesn't fix borrow errors. It clones until the compiler stops complaining. Here is the compiler output that proves why.**

Ten Rust programs that fail to compile. Compiled with a real `rustc`, output read from
`--error-format=json`:

| corpus case | rustc says | what it offers you |
|---|---|---|
| `e0502-cache-lookup.rs` | E0502 cannot borrow `*cache` as mutable | **nothing** |
| `e0499-two-mut-borrows.rs` | E0499 cannot borrow `v` as mutable more than once | **nothing** |
| `e0506-assign-to-borrowed.rs` | E0506 cannot assign to `cfg.retries` | **nothing** |
| `e0515-return-local-ref.rs` | E0515 cannot return reference to local | **nothing** |
| `e0597-borrow-outlives.rs` | E0597 `inner` does not live long enough | **nothing** |
| `e0502-iterator-invalidation.rs` | E0502 cannot borrow `items` as mutable | **nothing** |
| `e0500-closure-conflict.rs` | E0502 cannot borrow `total` as immutable | **nothing** |
| `e0382-use-after-move.rs` | E0382 borrow of moved value | `help`: *consider cloning the value* |
| `e0596-borrow-immutable-as-mutable.rs` | E0596 not declared as mutable | `help`: *consider changing this to be mutable* ✅ |
| `e0716-temporary-dropped.rs` | E0716 temporary value dropped while borrowed | `help`: *consider using a `let` binding* ✅ |

**7 of 10 give the agent nothing to act on.**

Look at which three it does help with. E0596 and E0716 get correct, actionable advice —
add `mut`, add a `let` binding. Those are *syntax* fixes: local, mechanical, one token.
E0382 gets advice too, and that advice is to clone.

Every case where the fix requires **restructuring ownership** — E0499, E0502, E0506,
E0515, E0597 — gets silence. Those are exactly the cases where a clone compiles.

So the compiler is helpful right up to the point where the problem becomes a design
problem, and then it stops. Clone is the one move that always compiles. With no other
guidance, it wins by default. That is the mechanism behind clone-spam — a guidance
vacuum on precisely the hard cases, not laziness.

## Install

```bash
mkdir -p ~/.agents/skills && cp -r skills/rust-ownership ~/.agents/skills/
```

`~/.agents/skills/` is read by Codex, Cursor and Gemini CLI. For Claude Code use
`~/.claude/skills/`. The skill follows the [Agent Skills](https://agentskills.io/specification)
spec, so the same folder works in 40+ clients.

## Reproduce it

```bash
bash scripts/dev.sh install    # checks node + rustc
bash scripts/dev.sh example    # recompiles the corpus, regenerates EVIDENCE.md
bash scripts/dev.sh test
```

Requires a Rust toolchain ([rustup.rs](https://rustup.rs)).

## Why this matters

Cloning to escape a borrow conflict does not resolve the conflict — it creates two
objects where the code assumed one. On E0499 and E0502 that **compiles cleanly, passes
tests, and is silently wrong**: writes through one copy are invisible to the other.

`clippy::redundant_clone` does not catch it. That lint only fires when the original is
never used again; in exactly these cases the original *is* still used, which is why the
borrow conflicted in the first place. Clippy stays silent.

## How it works

```
corpus/*.rs ──rustc --error-format=json──→ scripts/extract.mjs ──→ EVIDENCE.md
                                                                        │
                                    SKILL.md cites error codes ─────────┘
                                    (a test fails if it cites one rustc never emitted)
```

No claim in this repository is hand-asserted. Error codes, message text and the presence
or absence of suggestions are read out of the compiler. CI recompiles the corpus on every
push and **fails if `EVIDENCE.md` drifts** — if a future rustc starts suggesting ownership
fixes, this repo breaks loudly instead of quietly lying.

## Prior art

[actionbook/rust-skills](https://github.com/actionbook/rust-skills) (1.4k★) and
[majiayu000/claude-skill-registry](https://github.com/majiayu000/claude-skill-registry)
(598★) already ship Rust borrow-checker guidance, and
[leonardomso/rust-skills](https://github.com/leonardomso/rust-skills) (495★) has the
deepest `.clone()` anti-pattern catalogue. They are hand-authored from knowledge.

The only thing clonetax adds is the receipts: a corpus you can recompile, and a CI gate
that fails when the compiler stops agreeing. That is a narrow difference. It is the one
that survives a new rustc release.

## Roadmap

- More corpus cases (async, closures, iterator invalidation)
- Track suggestion changes across rustc versions
- A `cargo clonetax` mode that flags conflict-escaping clones in a real crate

## License

MIT
