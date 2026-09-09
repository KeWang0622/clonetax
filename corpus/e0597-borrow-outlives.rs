// A borrow kept alive past the value it points into.
fn main() {
    let held;
    {
        let inner = String::from("scoped");
        held = &inner;
    }
    println!("{}", held);
}
