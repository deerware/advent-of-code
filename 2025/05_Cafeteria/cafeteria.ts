import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function cafeteria() {
    log('Day 5: Cafeteria');

    await g.run('2025/05_Cafeteria', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 3],
        ['Part 1', part1, 'input.txt', 868],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 14],
        ['Part 2 test 2', part2, 'sampleData2.txt', 14],
        ['Part 2', part2, 'input.txt', 354143734113772],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let ranges = [];
    let foods = [];

    for (const line of _data)
        if (line.includes('-'))
            ranges.push(line.split('-').map(n => parseInt(n)) as [number, number])
        else
            foods.push(parseInt(line));

    return { ranges, foods }
}

async function part1({ ranges, foods }: Data): Promise<number> {
    return foods.filter((food => {
        return !!ranges.find(r => r[0] <= food && r[1] >= food)
    })).length;
}

async function part2({ ranges }: Data): Promise<number> {
    let fixedOverlap;
    do {
        fixedOverlap = false;

        // Could be optimized, we don't need to cycle through everything all the time..
        for (let i = 0; i < ranges.length; i++) {
            const range1 = ranges[i];

            for (let j = i + 1; j < ranges.length; j++) {
                const range2 = ranges[j];

                const isOverlap = overlap(range1, range2);
                if (!isOverlap)
                    continue;

                ranges = ranges.filter(r => r[0] != range1[0] || r[1] != range1[1]);
                ranges = ranges.filter(r => r[0] != range2[0] || r[1] != range2[1]);
                ranges.push(isOverlap);
                fixedOverlap = true;
                break;
            }
            if (fixedOverlap)
                break;
        }
    } while (fixedOverlap);

    return ranges.reduce((sum, range) => sum + range[1] - range[0] + 1, 0);
}

function overlap(_r1: [number, number], _r2: [number, number]): false | [number, number] {
    let r1;
    let r2;
    if (_r1[0] <= _r2[0]) {
        r1 = _r1;
        r2 = _r2;
    } else {
        r1 = _r2;
        r2 = _r1;
    }

    // r1 ends before r2 starts
    if (r1[1] < r2[0])
        return false;

    // Identical
    if (r1[0] == r2[0] && r1[1] == r2[1])
        return [...r1];

    // r1 fully inside r2
    if (r1[0] >= r2[0] && r1[1] <= r2[1])
        return [...r2];

    // r2 fully inside r1
    if (r2[0] >= r1[0] && r2[1] <= r1[1])
        return [...r1];

    // r2 ends after r1 ends
    return [r1[0], r2[1]];
}