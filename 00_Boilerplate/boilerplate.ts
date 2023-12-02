import fs from 'fs';
import log from '../log'
import colors from '../types'

export default async function main() {
    const p1test = await part1(fs.readFileSync('<<FILE>>').toString());
    const p1testr = 8;
    log((p1test === p1testr ? colors.fg.green : colors.fg.red) + `Part 1 test: ${p1test} ${p1test === p1testr ? '===' : '!=='} ${p1testr}`);

    const p1 = part1(fs.readFileSync('<<FILE>>').toString());
    log(colors.fg.yellow + `Part 1: ${p1}`);

    log();

    const p2test = await part2(fs.readFileSync('<<FILE>>').toString());
    const p2testr = 2286;
    log((p2test === p2testr ? colors.fg.green : colors.fg.red) + `Part 2 test: ${p2test} ${p2test === p2testr ? '===' : '!=='} ${p2testr}`);

    const p2 = part2(fs.readFileSync('<<FILE>>').toString());
    log(colors.fg.yellow + `Part 2: ${p2}`);
}

async function part1(data: string): Promise<number> {
    throw new Error('Not implemented');
}

async function part2(data: string): Promise<number> {
    throw new Error('Not implemented');
}