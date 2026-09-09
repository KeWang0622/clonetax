// A closure holds a mutable borrow while the same value is borrowed again.
fn main() {
    let mut total = 0;
    let mut add = |x: i32| total += x;
    println!("{}", total);
    add(5);
}
