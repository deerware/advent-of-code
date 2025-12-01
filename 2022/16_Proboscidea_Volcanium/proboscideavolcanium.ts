import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import dijkstras, { DijkstrasMethod } from '../../helpers/map/path/dijkstras';
import { re } from 'mathjs';

export default async function proboscideavolcanium() {
    log('Day 16: Proboscidea Volcanium');

    await g.run('2022/16_Proboscidea_Volcanium', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 1651],
        ['Part 1', part1, 'input.txt', 1724],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Valve = { name: string, flow: number, dirs: string[], distances: { [key: string]: number } };

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const valves: { [key: string]: Valve } = {};
    _data.forEach(line => {
        const parts = line.split(' has flow rate=');
        const name = parts[0].split(' ')[1];
        const parts2 = parts[1].split(/; tunnels? leads? to valves? /);
        const flow = parseInt(parts2[0]);
        const dirs = parts2[1].split(', ');
        valves[name] = { name, flow, dirs, distances: {} };
    });

    for (const v of Object.keys(valves)) {
        const valve = valves[v];

        const distances = dijkstras({
            startTile: valve,
            startKey: valve.name,
            getNext(current) {
                return valves[current.key].dirs.map(dir => {
                    const nextValve = valves[dir];
                    return [nextValve, nextValve.name];
                });
            }
        });

        for (const d of Object.keys(distances))
            valve.distances[d] = distances[d].score
    }

    return valves;
}

async function part1(valves: Data): Promise<number> {
    const startKey = 'AA';
    const limit = 30;

    function tileKey(name: string, open: string[]) {
        return `${name}#${open.sort().join(';')}`;
    }

    // console.log(valves);

    const results = dijkstras({
        startTile: { open: [] as string[], step: 0, valve: valves[startKey] },
        startKey,
        getNext(current) {
            return Object.keys(current.tile.valve.distances).map(valve => {
                const newTime = current.tile.step + current.tile.valve.distances[valve] + 1;
                if (newTime > limit)
                    return;

                if (current.tile.open.includes(valve))
                    return;

                const nextValve = valves[valve];

                if (nextValve.flow == 0)
                    return;

                if (valve == 'JJ')
                    console.log('');

                const newScore = ((limit - newTime) * nextValve.flow);
                const newOpen = [...current.tile.open, valve]
                return [{ open: newOpen, step: newTime, valve: nextValve }, tileKey(valve, newOpen), newScore];
            });
        },
        method: DijkstrasMethod.HIGHEST,
    });

    let highest = -Infinity;
    let best;

    for (const key of Object.keys(results)) {
        const result = results[key];
        if (result.score > highest) {
            highest = result.score;
            best = result;
        }
    }

    // console.log(results);
    // console.log(best);

    return highest;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}