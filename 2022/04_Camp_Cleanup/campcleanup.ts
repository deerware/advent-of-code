import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';

export default async function campcleanup() {
    log('Day 4: Camp Cleanup');

    await g.run('2022/04_Camp_Cleanup', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 2],
        ['Part 1 test 1', part1, 'sampleData2.txt', 4],
        ['Part 1', part1, 'input.txt', null],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 4],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map((line) => {
        return line.split(',').map(range => {
            const parts = range.split('-').map(n => parseInt(n));
            return { start: parts[0], end: parts[1] };
        }) as [{ start: number, end: number }, { start: number, end: number }];
    });
}

async function part1(data: Data): Promise<number> {
    let colisions = 0;

    for (const pair of data) {
        let sooner;

        if (pair[0].start > pair[1].start)
            sooner = 1;
        else if (pair[0].start < pair[1].start)
            sooner = 0;
        else if (pair[0].end > pair[1].end)
            sooner = 0;
        else
            sooner = 1;

        const later = sooner == 0 ? 1 : 0;

        const smallerStart = pair[sooner];
        const biggerStart = pair[later];

        // console.log(smallerStart, biggerStart);

        if (smallerStart.end >= biggerStart.end) {
            colisions++;
            // console.log(colisions);
        }
    }

    return colisions;
}

async function part2(data: Data): Promise<number> {
    let colisions = 0;

    for (const pair of data)
        if (hasAnyCollision(pair))
            colisions++;


    return colisions;
}

function hasAnyCollision(_pair: [{ start: number, end: number }, { start: number, end: number }]) {
    const pair = _pair.map(p => {
        const arr = [];
        for (let i = p.start; i <= p.end; i++)
            arr.push(i);

        return arr;
    });

    for (const n of pair[0])
        if (pair[1].includes(n))
            return true;

    return false;
}