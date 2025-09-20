import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { z } from 'zod';

export default async function cathoderaytube() {
    log('Day 10: Cathode-Ray Tube');

    await g.run('2022/10_Cathode_Ray_Tube', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 13140],
        ['Part 1', part1, 'input.txt', 14320],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => {
        return z.tuple([
            z.literal('noop'),
        ]).or(z.tuple([
            z.literal('addx'),
            z.coerce.number().int(),
        ])).parse(line.split(' '))
    });
}

async function part1(data: Data): Promise<number> {
    let x = 1;
    const ops: number[] = [];

    for (const line of data) {
        if (line[0] === 'noop') {
            ops.push(x);
            continue;
        }

        if (line[0] === 'addx') {
            ops.push(x);
            ops.push(x);
            x += line[1];
            continue;
        }
    }

    let signal = 0;
    for (const i of [20, 60, 100, 140, 180, 220]) {
        signal += i * ops[i - 1];
    }

    return signal;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}