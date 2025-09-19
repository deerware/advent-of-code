import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import memoize from '../../helpers/memoize';

export default async function plutonianpebbles() {
    log('Day 11: Plutonian Pebbles');

    await global.run('2024/11_Plutonian_Pebbles', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 7, 1],
        ['Part 1 test 2', part1, 'sampleData2.txt', 55312],
        ['Part 1', part1, 'input.txt', 224529],
        null,
        ['Part 2', part1, 'input.txt', 266820198587914, 75],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data[0].split(' ').map(Number);
}

async function part1(data: Data, blinktimes: number = 25): Promise<number> {
    return data.reduce(
        (acc, stone) =>
            acc + count(stone, blinktimes), 0);
}

// const count = cache(_count);
const count = memoize(_count, (stone, blink) => `${stone}-${blink}`); // faster by 30ms for some reason
function _count(stone: number, blink: number): number {
    const stoneStr = stone.toString();
    const nextB = blink - 1;

    if (stone === 0)
        return blink === 1 ? 1 : count(1, nextB);

    if (stoneStr.length % 2 === 0) {
        const left = parseInt(stoneStr.slice(0, stoneStr.length / 2));
        const right = parseInt(stoneStr.slice(stoneStr.length / 2));
        return blink === 1 ? 2 : count(left, nextB) + count(right, nextB);
    }

    return blink === 1 ? 1 : count(stone * 2024, nextB);
}