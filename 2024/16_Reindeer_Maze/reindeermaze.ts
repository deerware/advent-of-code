import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';
import { z } from 'zod';
import fs from 'fs';

// Today's inspirations:
// https://www.geeksforgeeks.org/difference-between-dijkstras-algorithm-and-a-search-algorithm/ Difference Between Dijkstra's Algorithm and A* Search Algorithm
// https://www.youtube.com/watch?v=_lHSawdgXpI Dijkstra's algorithm in 3 minutes 
// https://www.youtube.com/watch?v=bZkzH5x0SKU Dijkstras Shortest Path Algorithm Explained

export default async function reindeermaze() {
    log('Day 16: Reindeer Maze');

    await global.run('2024/16_Reindeer_Maze', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 7036],
        ['Part 1 test 2', part1, 'sampleData2.txt', 11048],
        ['Part 1', part1, 'input.txt', 105496],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 45],
        ['Part 2 test 2', part2, 'sampleData2.txt', 64],
        ['Part 2 test FS', part2, 'fs.txt', 531],
        ['Part 2 test MGA', part2, 'mga.txt', 479],
        ['Part 2', part2, 'input.txt', 524],
    ], parseData);
}

const DIRs = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
}
type DIR = keyof typeof DIRs;
enum TILE { WALL = '#', AIR = '.' };
type Map = TILE[][];
type Pos = [r: number, c: number];
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const map: Map = [];
    let startingPos, endingPos: Pos;
    for (let r = 0; r < _data.length; r++) {
        const row: TILE[] = [];
        for (let c = 0; c < _data[r].length; c++) {
            if (_data[r][c] === 'S') {
                startingPos = [r, c];
                row.push(TILE.AIR);
                continue;
            }
            else if (_data[r][c] === 'E') {
                endingPos = [r, c];
                row.push(TILE.AIR);
                continue;
            }
            else if (_data[r][c] === 'O') {
                row.push(TILE.AIR);
                continue;
            }
            else if (_data[r][c] === 'X') {
                row.push(TILE.WALL);
                continue;
            }
            row.push(_data[r][c] as TILE);
        }
        map.push(row);
    }
    return z.object({
        map: z.array(z.array(z.nativeEnum(TILE))),
        startingPos: z.tuple([z.number(), z.number()]),
        endingPos: z.tuple([z.number(), z.number()]),
    }).parse({ map, startingPos, endingPos: endingPos! });
}

async function part1({ map, startingPos, endingPos }: Data): Promise<number> {
    const nodes = findpath(map, startingPos);
    const endNodes = Object.values(nodes).filter(n => n.pos[0] === endingPos[0] && n.pos[1] === endingPos[1]);
    if (endNodes.length === 0)
        throw new Error('No path found');

    const best = endNodes.reduce((a, b) => a.score < b.score ? a : b);

    return best.score;
}

async function part2({ map, startingPos, endingPos }: Data): Promise<number> {
    const nodes = findpath(map, startingPos, true);
    const endNodes = Object.values(nodes).filter(n => n.pos[0] === endingPos[0] && n.pos[1] === endingPos[1]);
    if (endNodes.length === 0)
        throw new Error('No path found');

    const best = endNodes.reduce((a, b) => a.score < b.score ? a : b);

    // createFlowchart(nodes, best);

    return uniqueTilesPath(map, nodes, best).size + 1; // + 1 for the ending node;
}

function posKey(pos: Pos, facing: DIR) {
    return `${pos[0]};${pos[1]};${facing}`;
}

type Node = { pos: Pos, facing: DIR, key: string, score: number, previous: string[] | null };
export function findpath(map: Map, startingPos: Pos, allPaths = false) {
    const nodes: { [key: string]: Node } = {}
    const unvisited = new Set<string>();

    for (const subPos of breakdown(startingPos, 'right')) {
        const subPosKey = subPos.key;
        nodes[subPosKey] = { pos: subPos.pos, facing: subPos.facing, key: subPosKey, score: subPos.turningCost, previous: null };
        unvisited.add(subPosKey);
    }

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

        const neighbor = getNeighbor(map, current.pos, current.facing);
        if (!neighbor)
            continue;

        for (const subPos of breakdown(neighbor, current.facing)) {
            const subPosKey = subPos.key;
            const newScore = current.score + subPos.turningCost + 1;
            if (nodes[subPosKey]) {
                if (newScore < nodes[subPosKey].score) {
                    nodes[subPosKey].score = newScore;
                    nodes[subPosKey].previous = [current.key];
                }
                if (allPaths && newScore == nodes[subPosKey].score)
                    (nodes[subPosKey].previous as string[]).push(current.key);

                continue;
            }

            nodes[subPosKey] = { pos: subPos.pos, facing: subPos.facing, key: subPosKey, score: newScore, previous: [current.key] };
            unvisited.add(subPosKey);
        }
    }

    return nodes;
}

function breakdown(pos: Pos, facing: DIR) {
    const subpos: { key: string, pos: Pos, facing: DIR, /*;: number,*/ turningCost: number }[] = [];
    const currentDir = DIRs[facing];

    for (const _dir in DIRs) {
        const dir = DIRs[_dir as DIR];
        let turningCost = 0;

        if (dir[1] === currentDir[1] && dir[0] === currentDir[0])
            turningCost = 0
        else if (dir[1] === currentDir[1] || dir[0] === currentDir[0])
            turningCost = 2000;
        else
            turningCost = 1000;

        subpos.push({
            key: posKey(pos, _dir as DIR),
            pos: pos,
            facing: _dir as DIR,
            // score: score + turningCost,
            turningCost,
        });
    }

    return subpos;
}

function getNeighbor(map: Map, pos: Pos, dir: DIR) {
    const dirPos = DIRs[dir];
    const newTilePos = [pos[0] + dirPos[0], pos[1] + dirPos[1]] as Pos;
    const newTile = map[newTilePos[0]][newTilePos[1]];
    if (newTile === TILE.WALL)
        return null;

    return newTilePos;
}

type SimpleNode = { pos: Pos, previous: null | string[] };
export function uniqueTilesPath(map: Map, nodes: Record<string, SimpleNode>, bestNode: SimpleNode) {
    const path = new Set<string>();

    function _uniqueTilesPath(nodes: Record<string, SimpleNode>, bestNode: SimpleNode) {
        if (bestNode.previous === null)
            return;

        for (const _node of bestNode.previous) {
            const node = nodes[_node];
            path.add(`${node.pos[0]},${node.pos[1]}`);
            _uniqueTilesPath(nodes, nodes[_node]);
        }
    }

    _uniqueTilesPath(nodes, bestNode);

    // render(map, path);

    return path;
}

function createFlowchart(nodes: Record<string, Node>, bestNode: Node) {
    function _createFlowchart(nodes: Record<string, Node>, bestNode: Node) {
        if (bestNode.previous === null)
            return `\n    START --> ${bestNode.pos[0]}-${bestNode.pos[1]}-${bestNode.facing}`;

        let result = "";

        for (const _node of bestNode.previous) {
            const node = nodes[_node];
            result += `\n    ${node.pos[0]}-${node.pos[1]}-${node.facing} --> ${bestNode.pos[0]}-${bestNode.pos[1]}-${bestNode.facing}`;
            result += _createFlowchart(nodes, node);
        }

        return result;
    }

    fs.writeFileSync('flowchart.txt ', `flowchart LR` + _createFlowchart(nodes, bestNode));
}

function render(map: Map, uniquePaths: Set<string>) {
    let result = "";
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const tile = map[r][c];
            if (tile === TILE.WALL)
                result += '#';
            else if (tile === TILE.AIR) {
                const pos = `${r};${c}`;
                result += uniquePaths.has(pos) ? 'O' : '.';
            }
        }
        result += "\n";
        fs.writeFileSync('render.txt', result);
    }
}