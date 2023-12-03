import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day XX");

    logResult('Part 1 test', await part1(loadLines('<<DAY>>/sampleData1.txt')), 4361)
    logResult('Part 1', await part1(loadLines('<<DAY>>/input.txt')))

    log();

    logResult('Part 2 test', await part2(loadLines('<<DAY>>/sampleData1.txt')), 467835)
    logResult('Part 2', await part2(loadLines('<<DAY>>/input.txt')))

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    return -Infinity;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}