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
        ['Part 2', part2, 'input.txt', 4121],
    ]);
}

type Rule = [no: number, mustBeBefore: number];

function parseData(data: string[]) {
    const rules: Rule[] = [];
    const updates: number[][] = [];
    let reachedUpdates = false;

    for (const line of data) {
        if (line.trim() === '') {
            reachedUpdates = true;
            continue;
        }

        if (!reachedUpdates)
            rules.push(line.split('|').map(x => parseInt(x)) as [first: number, second: number]);
        else
            updates.push(line.split(',').map(x => parseInt(x)));
    }

    return { rules, updates };
}

async function part1(_data: string[]): Promise<number> {
    const data = parseData(_data);

    return data.updates
        .filter(update => isValid(update, data.rules))
        .reduce(reduceToMiddle, 0);
}

async function part2(_data: string[]): Promise<number> {
    const data = parseData(_data);
    const invalidUpdates = [];

    for (const update of data.updates) {
        if (!isValid(update, data.rules))
            invalidUpdates.push(update);
    }

    for (const update of invalidUpdates) {
        while (!isValid(update, data.rules)) {
            for (const n of update) {
                const rules = data.rules.filter(([no]) => n == no);
                for (const rule of rules) {
                    const currPos = update.indexOf(rule[0]);
                    const mustBeBeforePos = update.indexOf(rule[1]);
                    if (mustBeBeforePos > -1 && currPos > mustBeBeforePos)
                        move(update, currPos, mustBeBeforePos);
                }
            }
        }
    }

    return invalidUpdates
        .reduce(reduceToMiddle, 0);
}

function isValid(update: number[], allRules: Rule[]) {
    for (const n of update) {
        const rules = allRules.filter(([first, second]) => n == first);
        if (rules.length === 0)
            continue;

        for (const rule of rules) {
            if (!update.includes(rule[1]))
                continue;

            if (update.indexOf(rule[1]) < update.indexOf(rule[0]))
                return false;
        }
    }

    return true;
}

// https://dev.to/jalal246/moving-element-in-an-array-from-index-to-another-464b
function move<T>(input: T[], from: number, to: number) {
    const elm = input.splice(from, 1)[0];
    input.splice(to, 0, elm);
}

function reduceToMiddle(acc: number, val: number[]) {
    return acc + val[(val.length - 1) / 2];
}