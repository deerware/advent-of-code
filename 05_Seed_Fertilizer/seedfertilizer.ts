import log from '../log'
import { colors } from '../types'
import * as global from '../global';
import { loadLines, logResult } from '../global';

export default async function main() {
    log("Day 5: If You Give A Seed A Fertilizer");

    global.startExecution();
    if (logResult('Part 1 test', await part1(loadLines('05_Seed_Fertilizer/sampleData1.txt')), 35)) {
        global.logExectionTime();

        global.startExecution();
        logResult('Part 1', await part1(loadLines('05_Seed_Fertilizer/input.txt')), 282277027);
    }
    global.logExectionTime();


    log();

    global.startExecution();
    if (logResult('Part 2 test', await part2(loadLines('05_Seed_Fertilizer/sampleData1.txt')), 46)) {
        global.logExectionTime();

        global.startExecution();
        if (logResult('Part 2 OE', await part2(loadLines('05_Seed_Fertilizer/input-oe.txt')), 79004094)) {
            global.logExectionTime();

            global.startExecution();
            logResult('Part 2', await part2(loadLines('05_Seed_Fertilizer/input.txt')), (n) => n < 11554136);
        }
    }

    global.logExectionTime();
}

async function part1(data: string[]): Promise<number> {
    const seeds = data.shift()!.split(': ')[1].split(' ').map(x => parseInt(x));

    const { maps, route } = prepareMap(data);
    const seedRoutes: { [key: number]: { [key: string]: number } } = {};

    seeds.forEach(seed => {
        let last = seed;
        seedRoutes[seed] = {};

        route.forEach(route => {
            last = findValRoute(last, maps[route]);
            seedRoutes[seed][route] = last;
        });
    });

    return Math.min(...seeds.map(seed => seedRoutes[seed][route[route.length - 1]]));
}

function part2(data: string[]) {
    const temp = data.shift()!.split(': ')[1].split(' ').map(x => parseInt(x));
    const { maps, route } = prepareMap2(data);

    let seedRanges: Range[] = [];
    for (let i = 0; i < temp.length; i += 2) {
        seedRanges.push(new Range(temp[i], temp[i + 1]));
    }

    for (let place of route) {
        const newSeedRanges: Range[] = [];

        for (let map of maps[place]) {
            const nextSeedRanges: Range[] = [];
            for (const seedRange of seedRanges) {
                if (map.appliesTo(seedRange)) {
                    const { new: newRange, remaining } = map.translate(seedRange);
                    newSeedRanges.push(newRange);
                    nextSeedRanges.push(...remaining);
                } else {
                    nextSeedRanges.push(seedRange);
                }
            }
            seedRanges = nextSeedRanges;
        }

        seedRanges = [...newSeedRanges, ...seedRanges]
    }

    log(seedRanges);

    return Math.min(...seedRanges.map(x => x.start));
}

function prepareMap(data: string[]) {
    const maps: { [key: string]: Map[] } = {};
    const route: string[] = [];

    let key: string | undefined;
    data.forEach(line => {
        if (line === "")
            return;

        if (line.endsWith(' map:')) {
            key = line.split(' map:')[0];
            maps[key] = [];
            route.push(key);
            return;
        }

        if (!key)
            throw new Error('No key');

        const lineParts = line.split(' ').map(x => parseInt(x));
        maps[key].push({
            dest: lineParts[0],
            source: lineParts[1],
            sourceMax: lineParts[1] + lineParts[2],
            length: lineParts[2]
        });
    });

    return { maps, route };
}

function prepareMap2(data: string[]) {
    const maps: { [key: string]: MapRange[] } = {};
    const route: string[] = [];

    let key: string | undefined;
    data.forEach(line => {
        if (line === "")
            return;

        if (line.endsWith(' map:')) {
            key = line.split(' map:')[0];
            maps[key] = [];
            route.push(key);
            return;
        }

        if (!key)
            throw new Error('No key');

        const lineParts = line.split(' ').map(x => parseInt(x));
        maps[key].push(
            new MapRange(lineParts[1], lineParts[2], lineParts[0])
        );
    });

    return { maps, route };
}

type Map = { source: number, sourceMax: number, dest: number, length: number };

function findValRoute(number: number, maps: Map[]) {
    for (let map of maps) {
        const result = findVal(number, map);
        if (result !== null)
            return result;
    }

    return number;
}

function findVal(number: number, map: Map): number | null {
    if (number >= map.source && number < map.sourceMax)
        return number - map.source + map.dest;

    return null;
}

class Range {
    start: number;
    length: number;

    get max() {
        return this.start + this.length;
    }

    constructor(start: number, length: number) {
        this.start = start;
        this.length = length;
    }
}

class MapRange extends Range {
    translatesTo: number;

    constructor(start: number, length: number, translatesTo: number) {
        super(start, length);
        this.translatesTo = translatesTo;
    }

    appliesTo(range: Range) {
        return this.start < range.max && this.max > range.start;
    }

    translate(range: Range): { new: Range, remaining: Range[] } {
        // MAP --|:::::|--
        // RAN ---|:::|---
        if (this.start <= range.start && this.max >= range.max)
            return {
                new: new Range(this.translateVal(range.start), range.length),
                remaining: []
            }

        // MAP ----|:|----
        // RAN ---|:::|---
        if (range.start <= this.start && range.max >= this.max)
            return {
                new: this,
                remaining: [
                    new Range(range.start, range.start - this.start),
                    new Range(this.max, range.max - this.max)
                ]
            }

        // MAP -----|:::|-
        // RAN ---|:::|---
        if (range.start <= this.start)
            return {
                new: new Range(this.start, range.max - this.start),
                remaining: [new Range(range.start, this.start - range.start)]
            }


        // MAP -|:::|-----
        // RAN ---|:::|---
        return {
            new: new Range(range.start, this.max - range.start),
            remaining: [new Range(this.max, range.max - this.max)]
        }
    }

    translateVal(val: number) {
        return val - this.start + this.translatesTo;
    }
}