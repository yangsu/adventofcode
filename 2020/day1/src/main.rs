use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;

pub fn day1(filename: impl AsRef<Path>) {
    let lines = read_ints(filename);
    for (i, elem) in lines.iter().enumerate() {
        for (j, elem2) in lines[i + 1..].iter().enumerate() {
            if elem + elem2 == 2020 {
                println!("part1 {}", elem * elem2)
            }
            for elem3 in &lines[j + 1..] {
                if elem + elem2 + elem3 == 2020 {
                    println!("part2 {}", elem * elem2 * elem3)
                }
            }
        }
    }
}

fn read_ints(filename: impl AsRef<Path>) -> Vec<i32> {
    let f = File::open(filename).expect("Unable to open file");
    let buf_reader = BufReader::new(f);
    return buf_reader
        .lines()
        .map(|l| l.expect("Could not parse line").parse().unwrap())
        .collect();
}

fn main() {
    day1("input.txt");
}
