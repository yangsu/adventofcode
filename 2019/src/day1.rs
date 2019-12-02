use std::fs::File;
use std::io::{BufRead, BufReader};
use std::path::Path;

pub fn day1(filename: impl AsRef<Path>) -> (i32, i32) {
    let lines = read_ints(filename);
    let mut fuel = 0;
    let mut total_fuel = 0;
    for line in lines {
        fuel += calc_fuel(line);
        total_fuel += calc_total_fuel(line);
    }
    return (fuel, total_fuel);
}

fn read_ints(filename: impl AsRef<Path>) -> Vec<i32> {
    let f = File::open(filename).expect("Unable to open file");
    let buf_reader = BufReader::new(f);
    return buf_reader
        .lines()
        .map(|l| l.expect("Could not parse line").parse().unwrap())
        .collect();
}

#[test]
fn test_calc_fuel() {
    assert_eq!(calc_fuel(12), 2);
    assert_eq!(calc_fuel(14), 2);
    assert_eq!(calc_fuel(1969), 654);
    assert_eq!(calc_fuel(100756), 33583);
}

fn calc_fuel(weight: i32) -> i32 {
    return (weight / 3 - 2).max(0);
}

#[test]
fn test_calc_total_fuel() {
    assert_eq!(calc_total_fuel(14), 2);
    assert_eq!(calc_total_fuel(1969), 966);
    assert_eq!(calc_total_fuel(100756), 50346);
}

fn calc_total_fuel(weight: i32) -> i32 {
    let mut total_fuel = 0;
    let mut current_fuel = weight;
    while current_fuel > 0 {
        current_fuel = calc_fuel(current_fuel);
        total_fuel += current_fuel;
    }
    return total_fuel;
}
