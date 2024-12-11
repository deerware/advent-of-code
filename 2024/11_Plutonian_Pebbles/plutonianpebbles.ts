import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function plutonianpebbles() {
    log('Day 11: Plutonian Pebbles');

    await global.run('2024/11_Plutonian_Pebbles', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 7, 1],
        ['Part 1 test 1', part1, 'sampleData2.txt', 55312],
        ['Part 1', part1, 'input.txt', null],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data[0].split(' ').map(Number);
}

async function part1(data: Data, blinktimes = 25): Promise<number> {
    for (let i = 0; i < blinktimes; i++) {
        blink(data);
    }
    return data.length;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

function blink(data: Data) {
    for (let i = 0; i < data.length; i++) {
        const stone = data[i];

        if (stone === 0) {
            data[i] = 1;
            continue;
        }

        const stoneStr = stone.toString();
        if (stoneStr.length % 2 === 0) {
            const left = stoneStr.slice(0, stoneStr.length / 2);
            const right = stoneStr.slice(stoneStr.length / 2);
            data[i] = parseInt(left);
            data.splice(++i, 0, parseInt(right)); // ++i -> skip the newly added stone
            continue;
        }

        data[i] *= 2024;
    }
}