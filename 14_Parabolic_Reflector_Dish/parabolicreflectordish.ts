import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 14: Parabolic Reflector Dish');

    global.run('14_Parabolic_Reflector_Dish', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 136],
        ['Part 1', part1, 'input.txt', 108813],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 64],
        ['Part 2', part2, 'input.txt', 104533],
    ]);
}

async function part1(data: string[]): Promise<number> {
    const map = parseData(data);
    translateNorth(map);

    return calcWeight(map, data.length);
}

async function part2(data: string[]): Promise<number> {
    const map = parseData(data);

    const maxL = data.length;
    const maxC = data[0].length;
    const cycles = 1000000000;

    let match: number | undefined;
    const cycleHistory: string[] = [];
    for (let i = 0; i < cycles; i++) {
        translationCycle(map, maxL, maxC);
        const hash = getHash(map);
        if (cycleHistory.includes(hash)) {
            match = cycleHistory.indexOf(hash);
            break;
        }
        cycleHistory.push(hash);
    }

    if (match !== undefined) {
        const pattern = cycleHistory.length - match;
        const fullCycles = Math.floor((cycles - match) / pattern) * pattern + match + 1;

        for (let i = fullCycles; i < cycles; i++)
            translationCycle(map, maxL, maxC);
    }

    return calcWeight(map, data.length);
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

function translationCycle(map: Map, maxL: number, maxC: number) {
    translateNorth(map);
    translateWest(map);
    translateSouth(map, maxL);
    translateEast(map, maxC);
}

function translateNorth(map: Map) {
    sortBalls(map);
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

function translateWest(map: Map) {
    sortBalls(map);
    for (const ball of map.balls) {
        for (let c = ball.c - 1; c >= 0; c--) {
            if (map.stones.some(stone => stone.c === c && stone.l === ball.l))
                break;
            if (map.balls.some(otherBall => otherBall.c === c && otherBall.l === ball.l))
                break;

            ball.c = c;
        }
    }
}

function translateSouth(map: Map, maxL: number) {
    sortBalls(map, -1);
    for (const ball of map.balls) {
        for (let l = ball.l + 1; l < maxL; l++) {
            if (map.stones.some(stone => stone.l === l && stone.c === ball.c))
                break;
            if (map.balls.some(otherBall => otherBall.l === l && otherBall.c === ball.c))
                break;

            ball.l = l;
        }
    }
}

function translateEast(map: Map, maxC: number) {
    sortBalls(map, -1);
    for (const ball of map.balls) {
        for (let c = ball.c + 1; c < maxC; c++) {
            if (map.stones.some(stone => stone.c === c && stone.l === ball.l))
                break;
            if (map.balls.some(otherBall => otherBall.c === c && otherBall.l === ball.l))
                break;

            ball.c = c;
        }
    }
}

function sortBalls(map: Map, invert = 1) {
    map.balls.sort((a, b) => {
        if (a.l != b.l)
            return invert * (a.l - b.l);

        return invert * (a.c - b.c);
    });
}

function getHash(map: Map) {
    let hash = "";
    for (const ball of map.balls) {
        hash += `l${ball.l}c${ball.c}`;
    }
    return hash;
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