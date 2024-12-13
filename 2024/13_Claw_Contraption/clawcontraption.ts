import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import * as mathjs from 'mathjs';

// Inspiration for today:
// https://www.wolframalpha.com/calculators/system-equation-calculator
// https://www.geeksforgeeks.org/how-to-solve-equations-with-mathjs/
// https://mathjs.org/docs/reference/functions/lusolve.html

export default async function clawcontraption() {
    log('Day 13: Claw Contraption');

    await global.run('2024/13_Claw_Contraption', [
        ['Part 1 test 1', part1, 'sampleData.txt', 480],
        ['Part 1', part1, 'input.txt', 32067],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', null],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Pos = [x: number, y: number];
type Data = ReturnType<typeof parseData>;
type Arcade = {
    buttonA: Pos,
    buttonB: Pos,
    prize: Pos,
}
function parseData(_data: string[]) {
    const data: Arcade[] = [];
    for (let i = 0; i < _data.length; i += 4) {
        const buttonA = _data[i].split('Button A: X+')[1].split(', Y+').map(Number) as Pos;
        const buttonB = _data[i + 1].split('Button B: X+')[1].split(', Y+').map(Number) as Pos;
        const prize = _data[i + 2].split('Prize: X=')[1].split(', Y=').map(Number) as Pos;
        data.push({ buttonA, buttonB, prize });
    }
    return data;
}

async function part1(data: Data, part2 = false): Promise<number> {
    const tokenPriceA = 3;
    const tokenPriceB = 1;
    let totalPrice = 0;
    for (const arcade of data) {
        const prize = findPrize(arcade, part2);
        if (prize)
            totalPrice += tokenPriceA * prize[0] + tokenPriceB * prize[1];
    }
    return totalPrice;
}

async function part2(data: Data): Promise<number> {
    return part1(data, true);
}

const ff = Math.pow(10, 12); // floatingFix
const part2Offset = 10000000000000;
function findPrize(arcade: Arcade, part2 = false) {
    const solution = mathjs.lusolve(
        [
            [arcade.buttonA[0], arcade.buttonB[0]],
            [arcade.buttonA[1], arcade.buttonB[1]],
        ],
        [arcade.prize[0] + (part2 ? part2Offset : 0), arcade.prize[1] + (part2 ? part2Offset : 0)]
    ) as number[][];

    const aCount = Math.round(solution[0][0] * ff) / ff;
    const bCount = Math.round(solution[1][0] * ff) / ff;

    if (aCount < 0 || bCount < 0)
        return null;

    if (!Number.isInteger(aCount) || !Number.isInteger(bCount))
        return null;

    return [aCount, bCount];
}