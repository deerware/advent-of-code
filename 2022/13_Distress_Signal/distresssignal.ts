import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { z } from 'zod';

export default async function distresssignal() {
    log('Day 13: Distress Signal');

    await g.run('2022/13_Distress_Signal', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 13],
        ['Part 1', part1, 'input.txt', 6086],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 140],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Packet = (number | Packet)[];
const packetZod: z.ZodType<(number | Packet)[]> = z.lazy(() =>
    z.array(
        z.union([
            z.number(),
            packetZod,
        ])
    )
);

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const _pairs = [];
    for (let i = 0; i < _data.length; i++) {
        let pair = [];
        pair.push(JSON.parse(_data[i]));

        i++;
        pair.push(JSON.parse(_data[i]));

        i++;
        _pairs.push(pair);
    }

    const pairs = [];
    for (const pair of _pairs) {
        pairs.push([
            packetZod.parse(pair[0]),
            packetZod.parse(pair[1]),
        ] as [Packet, Packet]);
    }

    return pairs;
}

async function part1(data: Data): Promise<number> {
    let right = 0;

    for (let i = 0; i < data.length; i++)
        if (evaluate(data[i]))
            right += i + 1;

    return right;
}

async function part2(data: Data): Promise<number> {

    let pairs: Packet[] = [[[2]], [[6]]];

    for (const line of data) {
        pairs.push(line[0])
        pairs.push(line[1])
    }

    pairs.sort((a, b) => evaluate([a, b]) ? 1 : 0);

    console.log(pairs);

    return -Infinity;
}

function evaluate(pair: [Packet, Packet], depth?: false): boolean
function evaluate(pair: [Packet, Packet], depth: true): boolean | null
function evaluate(pair: [Packet, Packet], depth = false): boolean | null {
    for (let i = 0; i < pair[0].length; i++) {
        let left = pair[0][i];
        let right = pair[1][i];

        if (right === undefined)
            return false;

        if (typeof left === "number" && typeof right === "number") {
            if (left === right)
                continue;

            return left < right;
        }

        if (typeof left === "object" && typeof right === "object") {
            const result = evaluate([left as Packet, right as Packet], true);
            if (result === null)
                continue;

            return result;
        }

        if (typeof left === "number")
            left = [left];

        if (typeof right === "number")
            right = [right];

        return evaluate([left, right], true);
    }

    if (pair[0].length < pair[1].length)
        return true;

    if (depth)
        return null;

    throw new Error('Invalid evaluation. No differences.');
}