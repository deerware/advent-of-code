import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import fs from 'fs';
import * as day16 from '../16_Reindeer_Maze/reindeermaze';

// Today's inspirations:
// Day 16: Reindeer Maze

export default async function ramrun() {
    log('Day 18: RAM Run');

    await global.run('2024/18_RAM_Run', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 22, 7, 12],
        ['Part 1', part1, 'input.txt', n => n > 318, 71, 1024],
        false,
        // ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        // ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
type Map = TILE[][];
enum TILE {
    WALL = '#',
    AIR = '.',
}
type Pos = [r: number, c: number];
function parseData(_data: string[]) {
    const bytes: Pos[] = [];
    for (const line of _data) {
        const parts = line.split(',').map(Number);
        bytes.push([parts[1], parts[0]]);
    }
    return { bytes };
}

async function part1(data: Data, size: number, take: number): Promise<number> {
    const map = createMap(data.bytes.slice(0, take), size);

    render(map);

    const path = pathfind(map, [0, 0]);


    return path.best.score;
}

async function part2(data: Data, size: number): Promise<number> {
    return -Infinity;
}

function createMap(bytes: Pos[], size: number) {
    const map: Map = [];
    for (let r = 0; r < size; r++) {
        const row: TILE[] = [];

        for (let c = 0; c < size; c++)
            row.push(bytes.some(b => b[0] === r && b[1] === c) ?
                TILE.WALL : TILE.AIR);

        map.push(row);
    }
    return map;
}

function posKey(pos: Pos) {
    return `${pos[0]};${pos[1]}`;
}

type Node = { pos: Pos, key: string, visited: boolean, score: number, previous: string[] | null };
function pathfind(map: Map, startingPos: Pos, endingPos: Pos = [map.length - 1, map[0].length - 1], allpaths = false) {
    const nodes: { [key: string]: Node } = {}
    const unvisited = new Set<string>();

    function markVisited(node: Node) {
        node.visited = true;
        unvisited.delete(node.key);
    }

    nodes[posKey(startingPos)] = { pos: startingPos, key: posKey(startingPos), visited: false, score: 0, previous: null };
    unvisited.add(posKey(startingPos));

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

        markVisited(current);

        const neighbors = getNeighbors(map, current.pos);
        for (const neighbor of neighbors) {
            const neighborKey = posKey(neighbor);
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

            nodes[neighborKey] = { pos: neighbor, key: neighborKey, visited: false, score, previous: [current.key] };
            unvisited.add(neighborKey);
        }
    }

    return { nodes, best: nodes[posKey(endingPos)] };
}

const DIRs = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
}
function getNeighbors(map: Map, pos: Pos) {
    const neighbors: Pos[] = [];
    for (const dir of Object.values(DIRs)) {
        const neighbor = [pos[0] + dir[0], pos[1] + dir[1]] as Pos;
        if (neighbor[0] < 0 || neighbor[0] >= map.length || neighbor[1] < 0 || neighbor[1] >= map[0].length)
            continue;

        if (map[neighbor[0]][neighbor[1]] === TILE.WALL)
            continue;

        neighbors.push(neighbor);
    }
    return neighbors;
}

function render(map: Map) {
    let result = "";
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = map[r][c];
            if (tile === TILE.WALL)
                result += '#';
            else if (tile === TILE.AIR) {
                // const pos = `${r};${c}`;
                // result += uniquePaths.has(pos) ? 'O' : '.';
                result += '.';
            }
        }
        result += "\n";
        fs.writeFileSync('render.txt', result);
    }
}