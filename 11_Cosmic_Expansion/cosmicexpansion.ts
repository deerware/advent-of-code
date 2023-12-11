import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';
import * as global from '../global';

export default async function main() {
    log("Day 11: Cosmic Expansion");

    global.startExecution();
    if (logResult('Part 1 test', await part0(loadLines('11_Cosmic_Expansion/sampleData1.txt')), 374)) {
        global.logExectionTime();

        global.startExecution();
        logResult('Part 1', await part0(loadLines('11_Cosmic_Expansion/input.txt')), 9274989)
    }
    global.logExectionTime();

    log();

    global.startExecution();
    if (logResult('Part 2 test 1', await part0(loadLines('11_Cosmic_Expansion/sampleData1.txt'), 10), 1030)) {
        global.logExectionTime();

        global.startExecution();
        if (logResult('Part 2 test 2', await part0(loadLines('11_Cosmic_Expansion/sampleData1.txt'), 100), 8410)) {
            global.logExectionTime();

            global.startExecution();
            logResult('Part 2', await part0(loadLines('11_Cosmic_Expansion/input.txt'), 1000000), 357134560737)
        }
    }
    global.logExectionTime();
}

function part0(data: string[], increaseBy = 2) {
    increaseBy--;
    const map = createMap(data, increaseBy)
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

type Pos = [line: number, col: number];

function createMap(data: string[], increaseBy: number): Pos[] {
    const positions: Pos[] = [];
    for (let i in data) {
        const l = parseInt(i);
        const line = data[l];
        let c = -1;
        while ((c = line.indexOf('#', c + 1)) > -1)
            positions.push([l, c]);
    }

    if (increaseBy === 0)
        return positions;

    let inc = 0;
    for (let i in data) {
        const l = parseInt(i) + inc * increaseBy;

        if (!positions.some(pos => pos[0] === l)) {
            inc++;
            for (const pos of positions.filter(pos => pos[0] > l))
                pos[0] += increaseBy;
        }
    }

    inc = 0;
    for (let i = 0; i < data[0].length; i++) {
        const c = i + inc * increaseBy;

        if (!positions.some(pos => pos[1] === c)) {
            inc++;
            for (const pos of positions.filter(pos => pos[1] > c))
                pos[1] += increaseBy;
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