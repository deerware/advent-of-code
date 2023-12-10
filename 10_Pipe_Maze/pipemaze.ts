import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';
import * as global from '../global';

export default async function main() {
    log("Day 10: Pipe Maze");

    global.startExecution();
    if (logResult('Part 1 test 4', await part1(loadLines('10_Pipe_Maze/sampleData1.txt')), 0)) {
        global.logExectionTime();

        global.startExecution();
        if (logResult('Part 1 test 2', await part1(loadLines('10_Pipe_Maze/sampleData2.txt')))) {
            global.logExectionTime();

            global.startExecution();
            logResult('Part 1', await part1(loadLines('10_Pipe_Maze/input.txt')))
        }
    }
    global.logExectionTime();

    // log();

    // global.startExecution();
    // if (logResult('Part 2 test', await part2(loadLines('10_Pipe_Maze/sampleData3.txt')), 0)) {
    //     global.logExectionTime();

    //     global.startExecution();
    //     logResult('Part 2', await part2(loadLines('10_Pipe_Maze/input.txt')))
    // }
    // global.logExectionTime();
}

async function part1(data: string[]): Promise<number> {
    return -Infinity;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}