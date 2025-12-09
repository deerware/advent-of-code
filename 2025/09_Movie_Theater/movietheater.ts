import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { Pos } from '../../helpers/map/map2D';

export default async function movietheater() {
    log('Day 9: Movie Theater');

    await g.run('2025/09_Movie_Theater', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 50],
        ['Part 1', part1, 'input.txt', 4756718172],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(row => row.split(',').map(n => parseInt(n)) as Pos)
}

async function part1(data: Data): Promise<number> {
    let sizes = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = +1; j < data.length; j++) {
            sizes.push({ p1: data[i], p2: data[j], rect: calcRect(data[i], data[j]) });
        }
    }

    sizes = sizes.sort((a, b) => b.rect - a.rect);
    return sizes[0].rect;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function calcRect([x1, y1]: Pos, [x2, y2]: Pos) {
    const topleftX = x1 < x2 ? x1 : x2;
    const topleftY = y1 < y2 ? y1 : y2;
    const bottomrightX = x1 < x2 ? x2 : x1;
    const bottomrightY = y1 < y2 ? y2 : y1;

    return (bottomrightX - topleftX + 1) * (bottomrightY - topleftY + 1)
}