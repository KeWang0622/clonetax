// A reference into a temporary that is dropped at the end of the statement.
// Lifetime extension does not apply once the borrow passes through a function.
fn first(v: &Vec<i32>) -> &i32 { &v[0] }

fn main() {
    let r = first(&vec![1, 2, 3]);
    println!("{}", r);
}
