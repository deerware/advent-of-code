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
        logResult('Part 2', await part2(loadLines('05_Seed_Fertilizer/input.txt')), 11554135);
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

async function part2(data: string[]): Promise<number> {
    const seedsRanges = data.shift()!.split(': ')[1].split(' ').map(x => parseInt(x));
    const newSeedRanges: { source: number, sourceMax: number, length: number }[] = [];

    for (let i = 0; i < seedsRanges.length; i += 2) {
        newSeedRanges.push({
            source: seedsRanges[i],
            sourceMax: seedsRanges[i] + seedsRanges[i + 1],
            length: seedsRanges[i + 1]
        });
    }

    const { maps, route } = prepareMap(data);
    log(maps);
    log(route);

    let min = Infinity;
    let i = 0;
    for (let range of newSeedRanges) {
        for (let seed = range.source; seed < range.sourceMax; seed++) {
            const path = [];
            let last = seed;
            path.push(seed);
            route.forEach(route => {
                last = findValRoute(last, maps[route]);
                path.push(last);
            });

            if (last < min)
                min = last;
        }

        log(`Range ${++i}: ${min} ${colors.fg.gray} (${global.getExecutionTime()})`);
    }
    return min;
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