use std::char;
use std::fs::File;
use std::io::Read;
use std::path::Path;

pub fn day2(filename: impl AsRef<Path>) -> Vec<usize> {
    let mut program = read_ints(filename);
    program[1] = 12;
    program[2] = 2;
    execute(&mut program);
    return program;
}

#[test]
fn test_execute() {
    fn execute_program(input: &mut Vec<usize>, expected: &Vec<usize>) {
        execute(input);
        assert_eq!(input, expected);
    }
    execute_program(&mut vec![1, 0, 0, 0, 99], &vec![2, 0, 0, 0, 99]);
    execute_program(&mut vec![2, 3, 0, 3, 99], &vec![2, 3, 0, 6, 99]);
    execute_program(&mut vec![2, 4, 4, 5, 99, 0], &vec![2, 4, 4, 5, 99, 9801]);
    execute_program(
        &mut vec![1, 1, 1, 4, 99, 5, 6, 0, 99],
        &vec![30, 1, 1, 4, 2, 5, 6, 0, 99],
    );
}

fn execute(program: &mut Vec<usize>) {
    let mut i = 0;
    while i < program.len() {
        let op = program[i];
        if op == 99 {
            break;
        }
        if op == 1 || op == 2 {
            let operand1 = program[program[i + 1]];
            let operand2 = program[program[i + 2]];
            let out = program[i + 3];
            program[out] = if op == 1 {
                operand1 + operand2
            } else {
                operand1 * operand2
            };
        }
        i += 4;
    }
}

fn read_ints(filename: impl AsRef<Path>) -> Vec<usize> {
    let mut f = File::open(filename).expect("Unable to open file");
    let mut content = String::new();
    f.read_to_string(&mut content).expect("Unable to read file");
    return content
        .trim_matches(char::is_whitespace)
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect();
}
