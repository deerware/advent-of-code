import log from '../../log'
import { colors } from '../../types'
import { loadLines, logResult } from '../../global';
import * as global from '../../global';
import { parse } from 'path';

export default async function main() {
    const startTime = new Date();
    log("Day 8: Haunted Wasteland");

    global.startExecution();
    if (logResult('Part 1 test 1', await part1(loadLines('08_Haunted_Wasteland/sampleData1.txt')), 2))
        if (logResult('Part 1 test 2', await part1(loadLines('08_Haunted_Wasteland/sampleData2.txt')), 6))
            logResult('Part 1', await part1(loadLines('08_Haunted_Wasteland/input.txt')), 19631)
    global.logExectionTime();

    log();

    global.startExecution();
    if (logResult('Part 2 test', await part2(loadLines('08_Haunted_Wasteland/sampleData3.txt')), 6))
        logResult('Part 2', await part2(loadLines('08_Haunted_Wasteland/input.txt')), 21003205388413)

    global.logExectionTime();
}

async function part1(data: string[]): Promise<number> {
    const { instructions, map } = parseData(data);

    let current = 'AAA';
    let moves = 0;
    while (current !== 'ZZZ') {
        for (const instruction of instructions) {
            if (instruction !== 'L' && instruction !== 'R')
                throw new Error('Invalid instruction');

            current = map[current][instruction];
            moves++;
        }
    }

    return moves;
}

async function part2(data: string[]): Promise<number> {
    const { instructions, map } = parseData(data);
    const starts: string[] = Object.keys(map).filter(x => x.endsWith('A'));
    const pathMoves: number[] = [];

    for (let current of starts) {
        let moves = 0;
        while (!current.endsWith('Z')) {
            for (const instruction of instructions) {
                if (instruction !== 'L' && instruction !== 'R')
                    throw new Error('Invalid instruction');

                current = map[current][instruction];
                moves++;
            }
        }
        log(`${starts[pathMoves.length]}: ${moves}`);
        pathMoves.push(moves);
    }

    return lcm(pathMoves);
}

async function part2bruteforce(data: string[]): Promise<number> {
    const { instructions, map } = parseData(data);

    let current: string[] = Object.keys(map).filter(x => x.endsWith('A'));
    let moves = 0;
    let set = 0;
    const previous: string[] = [];
    log(`Moving in ${current.length} parallels.`);
    log(current.join(', '));
    while (!areWeThereYet(current)) {
        for (const instruction of instructions) {
            if (instruction !== 'L' && instruction !== 'R')
                throw new Error('Invalid instruction');

            for (const i in current) {
                const path = current[i];

                current[i] = map[path][instruction];
            }
            moves++;
        }
        set++;
        if (set % 100000 == 0)
            log(`Currently at set ${set}, moves ${moves} at ${global.getExecutionTime()}`)

        const key = current.join('');
        if (previous.includes(key))
            throw new Error('Recursion detected');
        previous.push(key);
    }

    return moves;
}

type Map = { [key: string]: { L: string, R: string } };

function parseData(data: string[]) {
    const instructions = data[0];
    const map: Map = {};

    for (const line of data.slice(2)) {
        map[line.split(' = ')[0]] = {
            L: line.substring(7, 10),
            R: line.substring(12, 15),
        }
    }

    return { instructions, map };
}

function areWeThereYet(current: string[]) {
    return current.filter(x => x.endsWith('Z')).length == current.length;
}

// Stolen from here https://www.30secondsofcode.org/js/s/lcm/ :(
const lcm = (arr: number[]) => {
    const gcd: ((x: number, y: number) => number) = (x: number, y: number) => (!y ? x : gcd(y, x % y));
    const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
    return arr.reduce((a, b) => _lcm(a, b));
};