// Iterating a vector while pushing to it — the classic invalidation shape.
fn main() {
    let mut items = vec![1, 2, 3];
    for x in &items {
        if *x == 2 {
            items.push(99);
        }
    }
    println!("{:?}", items);
}
