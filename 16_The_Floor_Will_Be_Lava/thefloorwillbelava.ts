import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 16: The Floor Will Be Lava');

    global.run('16_The_Floor_Will_Be_Lava', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 46],
        ['Part 1', part1, 'input.txt', 7927],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 51],
        ['Part 2', part2, 'input.txt', 8246],
    ]);
}

type Beam = { l: number, c: number, d: 'U' | 'D' | 'L' | 'R' };
type BeamHashes = { all: string[], unique: string[] };

async function part1(data: string[]): Promise<number> {
    return part0(data, { l: 0, c: -1, d: 'R' });
}

async function part2(data: string[]): Promise<number> {
    let max = -Infinity;
    for (let l = 0; l < data.length; l++) {
        let curr = part0(data, { l, c: -1, d: 'R' });
        if (curr > max)
            max = curr;

        curr = part0(data, { l, c: data[l].length, d: 'L' });
        if (curr > max)
            max = curr;
    }
    for (let c = 0; c < data[0].length; c++) {
        let curr = part0(data, { l: -1, c, d: 'D' });
        if (curr > max)
            max = curr;

        curr = part0(data, { l: data.length, c, d: 'U' });
        if (curr > max)
            max = curr;
    }

    return max;
}

function part0(data: string[], initialBeam: Beam): number {
    let beams: Beam[] = [initialBeam];
    const beamHashes: BeamHashes = { all: [], unique: [] };

    while (beams.length > 0) {
        beams = calculateBeams(beams, data, beamHashes);
    }

    return beamHashes.unique.length;
}

function calculateBeams(beams: Beam[], map: string[], beamHashes: BeamHashes): Beam[] {
    const newBeams: Beam[] = [];
    for (const beam of beams) {
        for (const newBeam of calculateSingleBeam(beam, map, beamHashes)) {
            if (isValidBeam(newBeam, map, beamHashes.all)) {
                newBeams.push(newBeam);
                beamHashes.all.push(beamHash(newBeam));
                if (!beamHashes.unique.includes(beamHash(newBeam, true)))
                    beamHashes.unique.push(beamHash(newBeam, true));
            }
        }
    }
    return newBeams;
}

function calculateSingleBeam(beam: Beam, map: string[], beamHashes: BeamHashes): Beam[] {
    const newBeam = { ...beam };
    switch (beam.d) {
        case 'U':
            newBeam.l--;
            break;
        case 'D':
            newBeam.l++;
            break;
        case 'L':
            newBeam.c--;
            break;
        case 'R':
            newBeam.c++;
            break;
    }
    if (newBeam.l < 0 || newBeam.l >= map.length || newBeam.c < 0 || newBeam.c >= map[0].length)
        return [];

    const nextPoint = map[newBeam.l][newBeam.c];
    if (nextPoint == ".")
        return [newBeam];

    beamHashes.all.push(beamHash(newBeam));
    if (!beamHashes.unique.includes(beamHash(newBeam, true)))
        beamHashes.unique.push(beamHash(newBeam, true));

    switch (nextPoint) {
        case '|':
            if (beam.d === 'U' || beam.d === 'D')
                return [...calculateSingleBeam(changeBeam(newBeam, { d: beam.d }), map, beamHashes)];

            return [...calculateSingleBeam(changeBeam(newBeam, { d: 'U' }), map, beamHashes), ...calculateSingleBeam(changeBeam(newBeam, { d: 'D' }), map, beamHashes)];
        case '-':
            if (beam.d === 'L' || beam.d === 'R')
                return [...calculateSingleBeam(changeBeam(newBeam, { d: beam.d }), map, beamHashes)];

            return [...calculateSingleBeam(changeBeam(newBeam, { d: 'L' }), map, beamHashes), ...calculateSingleBeam(changeBeam(newBeam, { d: 'R' }), map, beamHashes)];
        case '/':
            if (beam.d === 'U') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'R' }), map, beamHashes)];
            if (beam.d === 'D') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'L' }), map, beamHashes)];
            if (beam.d === 'L') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'D' }), map, beamHashes)];
            if (beam.d === 'R') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'U' }), map, beamHashes)];
            break;
        case '\\':
            if (beam.d === 'U') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'L' }), map, beamHashes)];
            if (beam.d === 'D') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'R' }), map, beamHashes)];
            if (beam.d === 'L') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'U' }), map, beamHashes)];
            if (beam.d === 'R') return [...calculateSingleBeam(changeBeam(newBeam, { d: 'D' }), map, beamHashes)];
            break;

    }
    throw new Error('Invalid character');
}

function changeBeam(beam: Beam, change: Partial<Beam>) {
    return { ...beam, ...change };
}

function isValidBeam(beam: Beam, map: string[], beamHistory: string[]) {
    return beam.l >= 0 && beam.l < map.length && beam.c >= 0 && beam.c < map[0].length && !beamHistory.includes(beamHash(beam));
}

function beamHash(beam: Beam, unique = false) {
    if (unique)
        return `l${beam.l}c${beam.c}`;
    return `l${beam.l}c${beam.c}d${beam.d}`;
}

function drawHistory(map: string[], beamHashes: string[]) {
    let result = '';

    for (let l = 0; l < map.length; l++) {
        result += '\n';
        for (let c = 0; c < map[0].length; c++) {
            const f = beamHashes.filter(b => b.startsWith(`l${l}c${c}`));
            if (f.length == 0)
                result += '.';
            else if (f.length == 1)
                result += f[0][f[0].length - 1];
            else
                result += f.length.toString()[0];

        }
    }

    log(result);
}