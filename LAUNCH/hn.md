# Show HN

**Title:** Show HN: Rustc goes silent exactly where ownership gets hard, so agents clone

**Body:**

I kept seeing coding agents "fix" Rust borrow errors by cloning until it compiled, and I
wanted to know whether that was the model being lazy or something structural. So I wrote
ten small programs that each fail with a different borrow/move error, compiled them with
rustc --error-format=json, and read what the compiler actually offers.

The split was sharper than I expected.

Where the fix is local and mechanical, rustc is genuinely helpful: E0596 gets "consider
changing this to be mutable", E0716 gets "consider using a `let` binding to create a
longer lived value". Correct, actionable, one token each.

Where the fix requires restructuring ownership — E0499, E0502, E0506, E0515, E0597 — it
emits no help and no note at all. Seven of the ten cases. It reports the conflict and
stops.

The one ownership case where it does say something is E0382, and what it says is
"consider cloning the value if the performance cost is acceptable".

Clone is the one move guaranteed to compile. Given no other actionable guidance on
precisely the hard cases, it wins by default. That reads to me like a guidance vacuum
rather than laziness.

The part that worries me is E0499 and E0502. Cloning to escape those compiles cleanly and
passes tests, but you now have two objects where the code assumed one — writes through one
are invisible to the other. clippy::redundant_clone doesn't fire, because it only triggers
when the original is never used again, and in these cases the original is still used. That
is why the borrow conflicted.

The repo has the corpus, the extraction script, and an agent skill whose rules may only
cite error codes the compiler actually emitted (there is a test). CI recompiles the corpus
on every push and fails if the generated evidence drifts, so if a future rustc starts
suggesting ownership fixes, this breaks loudly instead of going quietly stale.

Prior art is real and linked in the README — actionbook/rust-skills and others already
ship Rust borrow guidance. The only thing I add is the receipts.

Genuine question for people who know rustc internals: is the silence on E0499/E0502
deliberate — suggestions there would often be wrong — or just not implemented?
