import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import memoize from '../../helpers/memoize';

export default async function giftshop() {
    log('Day 2: Gift Shop');

    await g.run('2025/02_Gift_Shop', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 1227775554],
        ['Part 1', part1, 'input.txt', 19605500130],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 4174379265],
        ['Part 2', part2, 'input.txt', 36862281418],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const ranges = [];
    for (const line of _data.join('').split(',')) {
        ranges.push(line.split('-').map(n => parseInt(n)));
    }

    return ranges;
}

async function part1(data: Data): Promise<number> {
    let invalidSum = 0;

    for (const range of data)
        for (let i = range[0]; i <= range[1]; i++) {
            const str = i.toString();
            if (str.length % 2 == 0) {
                const half = str.length / 2;

                if (str.substring(0, half) == str.substring(half))
                    invalidSum += i;
            }
        }

    return invalidSum;
}

async function part2(data: Data): Promise<number> {
    let invalidSum = 0;

    for (const range of data)
        for (let i = range[0]; i <= range[1]; i++) {
            let invalid = false;
            const str = i.toString();
            const div = divisors(str.length);

            for (const d of div) {
                const groups = splitByN(str, d);
                if (!groups?.length)
                    continue;

                if (groups.find(g => g != groups[0]) == undefined) {
                    invalid = true;
                    break;
                }
            }

            if (invalid)
                invalidSum += i;
        }

    return invalidSum;
}

const divisors = memoize((n: number) => {
    let d = [];
    for (let i = Math.floor(n / 2); i > 0; i--)
        if (n % i == 0)
            d.push(i)

    return d;
});

function splitByN(str: string, n: number) {
    return str.match(RegExp(`.{1,${n}}`, 'g'));
}