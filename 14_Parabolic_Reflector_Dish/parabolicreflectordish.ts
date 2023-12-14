import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 14: Parabolic Reflector Dish');

    global.run('14_Parabolic_Reflector_Dish', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 136],
        ['Part 1', part1, 'input.txt', null],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 64],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

async function part1(data: string[]): Promise<number> {
    const map = parseData(data);
    translateNorth(map);
    // drawMap(map, data.length, data[0].length);

    return calcWeight(map, data.length);
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

type Pos = { l: number, c: number };
type Map = { stones: Pos[], balls: Pos[] };
function parseData(data: string[]) {
    const stones: Pos[] = [];
    const balls: Pos[] = [];
    for (let i in data) {
        const line = data[i];
        const l = parseInt(i);

        for (let c = 0; c < line.length; c++) {
            if (line[c] === "#")
                stones.push({ l, c })
            if (line[c] === "O")
                balls.push({ l, c })
        }
    }
    return { stones, balls };
}

// function translationCycle(map: Map) {
//     translateNorth(map);
//     translateWest(map);
//     translateSouth(map);
//     translateEast(map);
// }

function translateNorth(map: Map) {
    for (const ball of map.balls) {
        for (let l = ball.l - 1; l >= 0; l--) {
            if (map.stones.some(stone => stone.l === l && stone.c === ball.c))
                break;
            if (map.balls.some(otherBall => otherBall.l === l && otherBall.c === ball.c))
                break;

            ball.l = l;
        }
    }
}

function translateEast(map: Map) {
    for (const ball of map.balls) {
        for (let l = ball.l - 1; l >= 0; l--) {
            if (map.stones.some(stone => stone.l === l && stone.c === ball.c))
                break;
            if (map.balls.some(otherBall => otherBall.l === l && otherBall.c === ball.c))
                break;

            ball.l = l;
        }
    }
}

function calcWeight(map: Map, maxL: number) {
    let sum = 0;
    for (const ball of map.balls) {
        sum += maxL - ball.l
    }
    return sum;
}

function drawMap(map: Map, maxL: number, maxC: number) {
    let result = "";
    for (let l = 0; l < maxL; l++) {
        result += "\n";
        for (let c = 0; c < maxC; c++) {
            if (map.stones.some(stone => stone.l === l && stone.c === c))
                result += "#";
            else if (map.balls.some(ball => ball.l === l && ball.c === c))
                result += "O";
            else
                result += '.';
        }
    }

    log(result);
}