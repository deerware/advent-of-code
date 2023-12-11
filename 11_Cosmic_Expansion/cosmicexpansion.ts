import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 11: Cosmic Expansion");

    if (logResult('Part 1 test', await part1(loadLines('11_Cosmic_Expansion/sampleData1.txt')), 374))
        logResult('Part 1', await part1(loadLines('11_Cosmic_Expansion/input.txt')), 9274989)

    log();

    if (logResult('Part 2 test', await part2(loadLines('11_Cosmic_Expansion/sampleData2.txt')), 8410))
        logResult('Part 2', await part2(loadLines('11_Cosmic_Expansion/input.txt')))

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    const map = createMap(data);

    let sum = 0;
    for (let i in map) {
        const pos1 = map[i];
        for (let j = parseInt(i) + 1; j < map.length; j++) {
            const pos2 = map[j];
            sum += Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
        }
    }

    return sum;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

type Pos = [line: number, col: number];

function createMap(data: string[]) {
    const positions: Pos[] = [];
    for (let i in data) {
        const l = parseInt(i);
        const line = data[l];
        let c = -1;
        while ((c = line.indexOf('#', c + 1)) > -1)
            positions.push([l, c]);
    }

    let inc = 0;
    for (let i in data) {
        const l = parseInt(i) + inc;
        if (!positions.some(pos => pos[0] === l)) {
            inc++;
            for (const pos of positions.filter(pos => pos[0] > l))
                pos[0]++;
        }
    }

    inc = 0;
    for (let i = 0; i < data[0].length; i++) {
        const c = i + inc;
        if (!positions.some(pos => pos[1] === c)) {
            inc++;
            for (const pos of positions.filter(pos => pos[1] > c))
                pos[1]++;
        }
    }

    return positions;
}

function drawMap(map: Pos[]) {
    let result = '\n';
    for (let l = 0; l <= Math.max(...map.map(pos => pos[0])); l++) {
        for (let c = 0; c <= Math.max(...map.map(pos => pos[1])); c++)
            result = map.some(pos => pos[0] === l && pos[1] === c) ? result + '#' : result + '.';
        result += '\n';
    }
    return result;
}