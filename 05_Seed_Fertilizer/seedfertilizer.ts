import log from '../log'
import { colors } from '../types'
import { loadLines, logResult } from '../global';

export default async function main() {
    const startTime = new Date();
    log("Day 5: If You Give A Seed A Fertilizer");

    if (logResult('Part 1 test', await part1(loadLines('05_Seed_Fertilizer/sampleData1.txt')), 35))
        logResult('Part 1', await part1(loadLines('05_Seed_Fertilizer/input.txt')))

    log();

    if (logResult('Part 2 test', await part2(loadLines('05_Seed_Fertilizer/sampleData1.txt')), 0))
        logResult('Part 2', await part2(loadLines('05_Seed_Fertilizer/input.txt')))

    log(colors.fg.gray + `Executed in ${(new Date().getTime() - startTime.getTime())}ms`);
}

async function part1(data: string[]): Promise<number> {
    const seeds = data.shift()!.split(': ')[1].split(' ').map(x => parseInt(x));
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
    return -Infinity;
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
    if (number < map.source || number > map.sourceMax)
        return null;

    return number - map.source + map.dest;
}