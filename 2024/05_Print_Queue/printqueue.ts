import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function printqueue() {
    log('Day 5: Print Queue');

    await global.run('2024/05_Print_Queue', [
        ['Part 1 test 1', part1, 'sampleData.txt', 143],
        ['Part 1', part1, 'input.txt', 6951],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 123],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

function parseData(data: string[]) {
    const rules: [number, number][] = [];
    const updates: number[][] = [];
    let reachedUpdates = false;

    for (const line of data) {
        if (line.trim() === '') {
            reachedUpdates = true;
            continue;
        }

        if (!reachedUpdates) {
            rules.push(line.split('|').map(x => parseInt(x)) as [first: number, second: number]);
        } else {
            updates.push(line.split(',').map(x => parseInt(x)));
        }
    }

    return { rules, updates };
}

async function part1(_data: string[]): Promise<number> {
    const data = parseData(_data);
    const validUpdates = [];

    for (const update of data.updates) {
        let invalid = false;
        for (const n of update) {
            const rules = data.rules.filter(([first, second]) => n == first);
            if (rules.length === 0)
                continue;

            for (const rule of rules) {
                if (!update.includes(rule[1]))
                    continue;

                if (update.indexOf(rule[1]) < update.indexOf(rule[0])) {
                    invalid = true;
                    break;
                }
            }
            if (invalid)
                break;
        }
        if (!invalid)
            validUpdates.push(update);
    }

    return validUpdates.reduce((acc, val) => acc += val[(val.length - 1) / 2], 0);
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}