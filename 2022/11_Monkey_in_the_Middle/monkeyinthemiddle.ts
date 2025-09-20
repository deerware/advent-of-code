import log from '../../log'
import * as g from '../../global';
import { z } from 'zod';

export default async function monkeyinthemiddle() {
    log('Day 11: Monkey in the Middle');

    await g.run('2022/11_Monkey_in_the_Middle', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 10605],
        ['Part 1', part1, 'input.txt', 111210],
        null,
        ['Part 2 test 1', part1, 'sampleData1.txt', 2713310158, false, 10000],
        ['Part 2', part1, 'input.txt', null, false, 10000],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const monkeys = [];

    for (let i = 0; i < _data.length; i++) {
        z.tuple([z.literal('Monkey'), z.string()]).parse(_data[i].split(' '));

        i++;
        const items = _data[i].split('Starting items: ')[1].split(', ').map(n => parseInt(n));

        i++;
        const opForm = z.tuple([
            z.literal('old').or(z.coerce.number()),
            z.enum(['*', '+']),
            z.literal('old').or(z.coerce.number()),
        ]).parse(_data[i].split('Operation: new = ')[1].split(' '))

        const operation = (old: number) => {
            if (opForm[1] === '*')
                return (opForm[0] === "old" ? old : opForm[0]) * (opForm[2] === "old" ? old : opForm[2]);

            return (opForm[0] === "old" ? old : opForm[0]) + (opForm[2] === "old" ? old : opForm[2]);
        }

        i++;
        const divisor = z.tuple([
            z.literal('  Test: divisible'),
            z.coerce.number()
        ]).parse(_data[i].split(' by '))[1];

        const test = (worry: number) => worry % divisor === 0;

        i++;
        const ifTrueThrowTo = z.tuple([
            z.literal('    If true: throw to'),
            z.coerce.number()
        ]).parse(_data[i].split(' monkey '))[1];

        i++;
        const ifFalseThrowTo = z.tuple([
            z.literal('    If false: throw to'),
            z.coerce.number()
        ]).parse(_data[i].split(' monkey '))[1];

        i++;

        const throwTo = (worry: number) => test(worry) ? ifTrueThrowTo : ifFalseThrowTo;

        monkeys.push({ items, operation, test, throwTo, ifTrueThrowTo, ifFalseThrowTo, noOfInspections: 0, divisor });
    }

    return monkeys;
}

async function part1(data: Data, calm = true, rounds = 20): Promise<number> {
    let div = 1;
    for (const m of data)
        div *= m.divisor;

    for (let i = 0; i < rounds; i++) {
        for (let m = 0; m < data.length; m++) {
            const monkey = data[m];
            for (const item of monkey.items) {
                const newItem = calm ? Math.floor(monkey.operation(item) / 3) : monkey.operation(item);
                const to = monkey.throwTo(newItem);
                data[to].items.push(newItem % div);
                monkey.noOfInspections++;
            }
            monkey.items = [];
        }
    }

    const max = data.map(m => m.noOfInspections).sort((a, b) => b - a);
    return max[0] * max[1];
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}