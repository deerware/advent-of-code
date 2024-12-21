import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { z } from 'zod';
import * as day16 from '../16_Reindeer_Maze/reindeermaze';
import * as day18 from '../18_RAM_Run/ramrun';

// Today's inspirations:
// Day 18's Djikstra's

export default async function racecondition() {
    log('Day 20: Race Condition');

    await g.run('2024/20_Race_Condition', [
        g.e('Part 1 test 1', part1, 'sampleData1.txt', 44),
        false,
        g.e('Part 1', part1, 'input.txt', null, 100),
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData, true);
}

type Pos = [r: number, c: number];
enum TILE { WALL = '#', AIR = '.' };
type Map = TILE[][];
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let startingPos: Pos;
    let endingPos: Pos;
    const map: Map = [];
    for (let r = 0; r < _data.length; r++) {
        const row: TILE[] = [];
        for (let c = 0; c < _data[r].length; c++) {
            if (_data[r][c] === 'S') {
                startingPos = [r, c];
                row.push(TILE.AIR);
                continue;
            } else if (_data[r][c] === 'E') {
                endingPos = [r, c];
                row.push(TILE.AIR);
                continue;
            }
            row.push(_data[r][c] as TILE);
        }
        map.push(row);
    }
    return z.object({
        startingPos: z.tuple([z.number(), z.number()]),
        endingPos: z.tuple([z.number(), z.number()]),
        map: z.array(z.array(z.nativeEnum(TILE))),
    }).parse({ startingPos: startingPos!, endingPos: endingPos!, map })
}

async function part1(data: Data, minimumScore = 1): Promise<number> {
    const path = pathfind(data.map, data.startingPos, data.endingPos);
    // const set = day16.uniqueTilesPath(data.map, path.nodes, path.best);

    const bestScore = path.best.score;
    const cheatPaths = new Map<number, number>();
    for (let i = 0; i < bestScore; i++) {
        const newPath = pathfind(data.map, data.startingPos, data.endingPos, i);

        // if (posKey === `7,10`)
        //     renderPath(data, day16.uniqueTilesPath(data.map, newPath.nodes, newPath.best));

        if (newPath.best && newPath.best.score < bestScore)
            cheatPaths.set(i, newPath.best.score);
    }

    let scores = new Map<number, number>();
    let total = 0;
    for (const score of Array.from(cheatPaths.values())) {
        const better = bestScore - score;
        if (scores.has(better))
            scores.set(better, scores.get(better)! + 1);
        else
            scores.set(better, 1);

        if (better >= minimumScore)
            total++;
    }

    log(scores);

    return total;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}

// Refurbished Day 16
type Node = { pos: Pos, key: string, score: number, previous: string[] | null };
function pathfind(
    map: Map,
    startingPos: Pos,
    endingPos: Pos,
    allowCheatsOnScore?: number,
    allpaths = false
) {
    const nodes: { [key: string]: Node } = {}
    const unvisited = new Set<string>();
    const startPosKey = day18.posKey(startingPos)
    nodes[startPosKey] = { pos: startingPos, key: startPosKey, score: 0, previous: null };
    unvisited.add(startPosKey);

    while (unvisited.size > 0) {
        let _current: string | undefined;
        let score = Infinity;
        unvisited.forEach(key => {
            if (nodes[key].score < score) {
                _current = key;
                score = nodes[key].score;
            }
        });
        if (_current === undefined) throw new Error();
        const current = nodes[_current];
        unvisited.delete(current.key);

        const neighbors = getNeighbors(map, current.pos, allowCheatsOnScore === current.score || allowCheatsOnScore === current.score - 1);
        for (const neighbor of neighbors) {
            const neighborKey = day18.posKey(neighbor);
            const score = current.score + 1;
            if (nodes[neighborKey]) {
                if (score < nodes[neighborKey].score) {
                    nodes[neighborKey].score = score;
                    nodes[neighborKey].previous = [current.key];
                }
                else if (allpaths && score === nodes[neighborKey].score)
                    (nodes[neighborKey].previous as string[]).push(current.key);

                continue;
            }

            nodes[neighborKey] = { pos: neighbor, key: neighborKey, score, previous: [current.key] };
            unvisited.add(neighborKey);
        }
    }

    return { nodes, best: nodes[day18.posKey(endingPos)] };
}

const DIRs = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
}
function getNeighbors(map: Map, pos: Pos, allowCheats = false) {
    const neighbors: Pos[] = [];
    for (const dir of Object.values(DIRs)) {
        const neighbor = [pos[0] + dir[0], pos[1] + dir[1]] as Pos;
        if (neighbor[0] < 0 || neighbor[0] >= map.length || neighbor[1] < 0 || neighbor[1] >= map[0].length)
            continue;

        if (map[neighbor[0]][neighbor[1]] === TILE.WALL && !allowCheats)
            continue;

        neighbors.push(neighbor);
    }
    return neighbors;
}

function allPosKeys({ map }: Data) {
    const keys = new Set<string>();
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            keys.add(day18.posKey([r, c]));
        }
    }
    return keys;
}

function render({ map }: Data) {
    for (let r = 0; r < map.length; r++) {
        let row = '';
        for (let c = 0; c < map[r].length; c++) {
            row += map[r][c];
        }
        log(r.toString().padStart(3) + '  ' + row);
    }
}

function renderPath({ map }: Data, path: Set<string>) {
    for (let r = 0; r < map.length; r++) {
        let row = '';
        for (let c = 0; c < map[r].length; c++) {
            if (path.has(day18.posKey([r, c]))) {
                if (map[r][c] === TILE.WALL)
                    row += '!';
                else
                    row += 'O';
            } else
                row += map[r][c];
        }
        log(r.toString().padStart(3) + '  ' + row);
    }
}