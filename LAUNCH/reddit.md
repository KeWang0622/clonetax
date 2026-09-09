# Reddit

## r/rust  (the one that matters — this subreddit will scrutinise it, which is good)

**Title:** I compiled 10 borrow-checker failures and read what rustc suggests. It helps with syntax and goes silent on ownership.

**Body:**

I wanted to check a hunch about why AI coding assistants clone-spam Rust instead of fixing
ownership, so rather than guess I compiled ten small failing programs and read
`rustc --error-format=json` (rustc 1.98.1).

Where the fix is local, rustc is helpful:

- E0596 → `help: consider changing this to be mutable`
- E0716 → `help: consider using a `let` binding to create a longer lived value`

Where the fix needs ownership restructuring, it says nothing at all — no `help`, no `note`:

- E0499, E0502 (×3 shapes), E0506, E0515, E0597 → silence. Seven of the ten cases.

The one ownership case with advice is E0382, and the advice is
`help: consider cloning the value if the performance cost is acceptable`
(the borrow-instead suggestion is there, but only as a `note`).

Clone is the only move guaranteed to compile, so with nothing actionable on the hard cases
it wins by default. I don't think the model is being dumb — I think it's following the
compiler.

The case I actually care about is E0499/E0502. Escaping those with a clone compiles and
passes tests, but the two halves of the code now mutate different objects.
`clippy::redundant_clone` won't fire because the original is still used — that's precisely
why the borrow conflicted.

Corpus and extraction script so you can rerun it against your own toolchain:
github.com/KeWang0622/clonetax

Genuine question for people who know rustc internals better than I do: is the silence on
E0499/E0502 deliberate (suggestions there would often be wrong) or just not implemented?

**Rules note:** r/rust dislikes promo. Lead with the finding and the question, link last.
Be ready to be told ten cases is unrepresentative. Concede it immediately and invite corpus PRs — the extraction script makes adding one a two-file change.

---

## r/ClaudeAI / r/cursor

**Title:** Why your agent clones instead of fixing Rust borrow errors (with the compiler output)

Same finding, shorter, framed around the agent behaviour rather than rustc internals.
