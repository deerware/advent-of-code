import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { z } from 'zod';
import fs from 'fs';

export default async function cathoderaytube() {
    log('Day 10: Cathode-Ray Tube');

    await g.run('2022/10_Cathode_Ray_Tube', [
        g.e('Part 1 test 1', part1, 'sampleData1.txt', 13140),
        g.e('Part 1', part1, 'input.txt', 14320),
        null,
        g.e('Part 2 test 1', part2, 'sampleData1.txt', null),
        g.e('Part 2', part2, 'input.txt', null),
    ], parseData, true);
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

async function part0(data: Data) {
    let x = 1;
    const ops: number[] = [1];

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

    return ops;
}

async function part1(data: Data): Promise<number> {
    const ops = await part0(data);

    let signal = 0;
    for (const i of [20, 60, 100, 140, 180, 220]) {
        signal += i * ops[i];
    }

    return signal;
}

async function part2(data: Data): Promise<string> {
    const ops = await part0(data);

    let result = "";

    for (let i = 0; i < ops.length - 1; i++) {
        if (i % 40 == 0) {
            result += '\n';
        }

        const x = ops[i + 1];

        const sprite = [x - 1, x, x + 1].includes(i % 40);

        // console.log(`Pixel ${i} Cycle ${i + 1} X = ${x} ${sprite ? 'lit' : ''}`);

        if (sprite)
            result += `${colors.bg.black} `;
        else
            result += `${colors.bg.white} `;
    }

    return result;
}