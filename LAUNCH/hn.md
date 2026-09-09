# Show HN

**Title:** Show HN: Rustc gives coding agents nothing to act on, so they clone

**Body:**

I kept seeing coding agents "fix" Rust borrow errors by cloning until the code compiled,
and I wanted to know whether that was the model being lazy or something structural.

So I wrote six small programs that each fail with a different borrow/move error, compiled
them with rustc --error-format=json, and read what the compiler actually offers.

On five of the six, rustc emits no `help` and no `note` at all — it reports the conflict
and stops. On the sixth (E0382, use after move) the only `help` it gives is "consider
cloning the value if the performance cost is acceptable".

Clone is the one move that always compiles. Given no other actionable guidance, it becomes
the default. That reads to me like a guidance vacuum rather than laziness.

The part that worries me is E0499 and E0502. Cloning to escape those compiles cleanly and
passes tests, but you now have two objects where the code assumed one — writes through one
are invisible to the other. clippy::redundant_clone doesn't help, because it only fires
when the original is never used again, and in exactly these cases the original is still
used. That's why the borrow conflicted.

The repo has the corpus, the extraction script, and an agent skill whose rules may only
cite error codes the compiler actually emitted (there's a test). CI recompiles the corpus
on every push and fails if the generated evidence drifts, so if a future rustc starts
offering ownership fixes, this breaks loudly instead of quietly going stale.

Prior art is real and I link it in the README — actionbook/rust-skills and others already
ship Rust borrow guidance. The only thing I'm adding is the receipts.

Curious whether the rustc folks consider the missing suggestions a deliberate choice.
