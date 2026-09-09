// Returning a reference into a local that dies at end of scope.
fn label() -> &'static str {
    let owned = String::from("temporary");
    &owned
}

fn main() { println!("{}", label()); }
