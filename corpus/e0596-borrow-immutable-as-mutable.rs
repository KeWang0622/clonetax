// Mutating through an immutable binding.
fn main() {
    let data = vec![1, 2, 3];
    let r = &mut data;
    r.push(4);
}
