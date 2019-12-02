mod day1;
mod day2;

fn main() {
    let (fuel, total_fuel) = day1::day1("src/day1.input.txt");
    println!("Day1: fuel={} total fuel={}", fuel, total_fuel);
    let program = day2::day2("src/day2.input.txt");
    println!("Day2: Executed Program: {:?}", program);
}
