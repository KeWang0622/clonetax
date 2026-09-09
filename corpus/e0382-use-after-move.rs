// Ownership moved into a helper, then used again.
fn consume(s: String) -> usize { s.len() }

fn main() {
    let s = String::from("hello");
    let n = consume(s);
    println!("{} {}", n, s);
}
