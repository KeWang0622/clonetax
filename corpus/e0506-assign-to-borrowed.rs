// Assigning to a value while a reference to it is still live.
struct Config { retries: u32 }

fn main() {
    let mut cfg = Config { retries: 3 };
    let r = &cfg.retries;
    cfg.retries = 5;
    println!("{}", r);
}
