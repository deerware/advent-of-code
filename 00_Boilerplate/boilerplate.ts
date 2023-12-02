import fs from 'fs';
import log from '../log'
import { colors } from '../types'
import { loadLines } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day XX");

    const p1test = await part1(loadLines('<<SAMPLE1>>'));
    const p1testr = 0;
    log((p1test === p1testr ? colors.fg.green : colors.fg.red) + `Part 1 test: ${p1test} ${p1test === p1testr ? '===' : '!=='} ${p1testr} ${p1test === p1testr ? "PASS" : "FAIL"}`);

    const p1 = part1(loadLines('<<INPUT>>'));
    log(colors.fg.yellow + `Part 1: ${p1}`);

    log();

    const p2test = await part2(loadLines('<<SAMPLE2>>'));
    const p2testr = 0;
    log((p2test === p2testr ? colors.fg.green : colors.fg.red) + `Part 2 test: ${p2test} ${p2test === p2testr ? '===' : '!=='} ${p2testr} ${p2test === p2testr ? "PASS" : "FAIL"}`);

    const p2 = part2(loadLines('<<INPUT>>'));
    log(colors.fg.yellow + `Part 2: ${p2}`);
    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    throw new Error('Not implemented');
}

async function part2(data: string[]): Promise<number> {
    throw new Error('Not implemented');
}