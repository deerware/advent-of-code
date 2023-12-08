import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';
import * as global from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 8: Haunted Wasteland");

    global.startExecution();
    if (logResult('Part 1 test', await part1(loadLines('08_Haunted_Wasteland/sampleData1.txt')), 2))
        if (logResult('Part 1 test', await part1(loadLines('08_Haunted_Wasteland/sampleData2.txt')), 6))
            logResult('Part 1', await part1(loadLines('08_Haunted_Wasteland/input.txt')))
    global.logExectionTime();

    // log();

    // global.startExecution();
    // if (logResult('Part 2 test', await part2(loadLines('08_Haunted_Wasteland/sampleData2.txt')), 0))
    //     logResult('Part 2', await part2(loadLines('08_Haunted_Wasteland/input.txt')))

    // global.logExectionTime();
}

async function part1(data: string[]): Promise<number> {
    return -Infinity;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}