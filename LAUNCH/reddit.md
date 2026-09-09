# Reddit

## r/rust  (the one that matters — this subreddit will scrutinise it, which is good)

**Title:** I compiled 6 borrow-checker failures and read what rustc actually suggests. 5 of 6 offer nothing.

**Body:**

I wanted to check a hunch about why AI coding assistants clone-spam Rust instead of fixing
ownership, so rather than guess I compiled six small failing programs and read
`rustc --error-format=json`.

Results (rustc 1.98.1):

- E0502, E0499, E0506, E0515, E0597 → no `help`, no `note`. The error is reported and that's it.
- E0382 → one `help`: "consider cloning the value if the performance cost is acceptable"
  (the borrow-instead suggestion is there, but as a `note`).

Clone is the only move guaranteed to compile, so with nothing else actionable it wins by
default. I don't think that's the model being dumb — I think it's following the compiler.

The case I actually care about is E0499/E0502. Escaping those with a clone compiles and
passes tests, but the two halves of the code now mutate different objects.
`clippy::redundant_clone` won't fire because the original is still used — that's precisely
why the borrow conflicted.

Repo has the corpus and the extraction script so you can rerun it against your own
toolchain: github.com/KeWang0622/clonetax

Genuine question for people who know rustc internals better than I do: is the absence of
suggestions on E0499/E0502 deliberate (too hard to suggest correctly) or just not
implemented yet?

**Rules note:** r/rust dislikes promo. Lead with the finding and the question, link last.
Be ready to be told your corpus is unrepresentative — six cases is small, say so first.

---

## r/ClaudeAI / r/cursor

**Title:** Why your agent clones instead of fixing Rust borrow errors (with the compiler output)

Same finding, shorter, framed around the agent behaviour rather than rustc internals.
