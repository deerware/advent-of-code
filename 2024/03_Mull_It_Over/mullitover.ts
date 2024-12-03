import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import regex from '../../helpers/regex';

export default async function mullitover() {
    log('Day 3: Mull It Over');

    await global.run('2024/03_Mull_It_Over', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 161],
        ['Part 1', part1, 'input.txt', 188741603],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 48],
        ['Part 2', part2, 'input.txt', 67269798],
    ]);
}

async function part1(_data: string[]): Promise<number> {
    const data = _data.join('\n');

    let sum = 0;

    for (const match of regex.allMatchesG(data, /mul\((\d{1,3}),(\d{1,3})\)/gm))
        sum += parseInt(match.groups[0]) * parseInt(match.groups[1]);

    return sum;
}

async function part2(_data: string[]): Promise<number> {
    const data = _data.join('\n');

    let sum = 0;
    let enabled = true;

    for (const match of regex.allMatchesG(data, /(do)\(\)|(don't)\(\)|(mul)\((\d{1,3}),(\d{1,3})\)/gm)) {
        if (match.groups[0] === 'do')
            enabled = true;
        if (match.groups[1] === "don't")
            enabled = false;
        if (match.groups[2] === 'mul' && enabled)
            sum += parseInt(match.groups[3]) * parseInt(match.groups[4]);
    }

    return sum;
}