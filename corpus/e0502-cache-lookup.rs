// The agent is asked to add a cache-fill. It reaches for .clone() on the lookup.
use std::collections::HashMap;

fn fill(cache: &mut HashMap<String, String>, key: String) -> Option<String> {
    let hit = cache.get(&key);
    cache.insert(key.clone(), String::from("computed"));
    hit.cloned()
}

fn main() {
    let mut cache = HashMap::new();
    println!("{:?}", fill(&mut cache, String::from("k")));
}
