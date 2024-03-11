import log from '../log'
import { colors } from '../types'
import * as global from '../global';

export default async function main() {
    log('Day 17: Clumsy Crucible');

    global.run('17_Clumsy_Crucible', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 102],
        // false,
        ['Part 1', part1, 'input.txt', (n) => n < 982],
        null,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ]);
}

type Pos = { l: number, c: number };
type PathTile = {
    pos: Pos,
    // Gcost: number,
    // Hcost: number,
    Tcost: number,
    // Fcost: number,
    parent?: PathTile,
    // sameDirDir: null | 'L' | 'C',
    currentDir: null | 'L' | 'R' | 'U' | 'D',
    sameDirMoves: number
};

async function part1(data: string[]): Promise<number> {
    const grid = parseData(data);
    const start = { l: 0, c: 0 };
    const end = { l: data.length - 1, c: data[0].length - 1 };

    const path = await findPath(grid, start, end);
    // log(path);
    renderPath(data, path);
    // renderPathText(data, path);
    return path.Tcost;
}

async function part2(data: string[]): Promise<number> {
    return -Infinity;
}

function parseData(data: string[]) {
    const result: number[][] = [];
    for (let i = 0; i < data.length; i++) {
        result[i] = [];
        const line = data[i];
        for (let c = 0; c < line.length; c++) {
            const char = line[c];
            result[i][c] = parseInt(char);
        }
    }
    return result;
}

async function findPath(grid: number[][], atart: Pos, end: Pos): Promise<PathTile> {
    const explored: number[] = [];

    const startingTile: PathTile = {
        pos: atart,
        // Gcost: 0,
        // Hcost: Math.abs(end.l - atart.l) + Math.abs(end.c - atart.c),
        Tcost: 0,
        // Fcost: 0, //Math.abs(end.l - atart.l) + Math.abs(end.c - atart.c),
        // sameDirDir: null,
        currentDir: null,
        sameDirMoves: 0,
    };
    const tiles: PathTile[] = [startingTile];
    const best = [];
    let i = 1;
    while (true) {
        // renderTiles(grid, tiles);
        // await new Promise(r => setTimeout(r, 0));
        i++;
        const bestTile = tiles.shift();

        if (bestTile === undefined) {
            if (best.length == 0)
                throw new Error('No path found');

            log(best);
            return best[0];
        }
        if (bestTile.pos.l === end.l && bestTile.pos.c === end.c) {
            log(i);
            // return bestTile;
            best.push(bestTile);
            continue;
        }

        const moves = getAvailableMoves(grid, bestTile, explored);
        for (const move of moves) {
            const findTile = tiles.findIndex(
                tile => tile.pos.l === move.pos.l &&
                    tile.pos.c === move.pos.c &&
                    tile.Tcost == move.Tcost &&
                    // tile.sameDirDir === move.sameDirDir &&
                    tile.currentDir === move.currentDir &&
                    tile.sameDirMoves === move.sameDirMoves
            );
            if (findTile === -1) {
                tiles.splice(sortedIndex(tiles, move), 0, move);
            }
        }
        explored.push(getHash(bestTile.pos));

        // if (i % 100000 == 1)
        // renderTiles(grid, tiles);
    }
}

function getAvailableMoves(grid: number[][], current: PathTile, explored: number[]): PathTile[] {
    const f1 = [
        { l: current.pos.l - 1, c: current.pos.c },
        { l: current.pos.l + 1, c: current.pos.c },
        { l: current.pos.l, c: current.pos.c - 1 },
        { l: current.pos.l, c: current.pos.c + 1 },
    ]
    const f2 = f1.filter(pos =>
        pos.l >= 0 && pos.l < grid.length &&
        pos.c >= 0 && pos.c < grid[0].length &&
        !(pos.l === current.parent?.pos.l && pos.c === current.parent?.pos.c)
    );
    const f3 = f2.filter(pos => !explored.includes(getHash(pos)));
    const f4 = f3.map(pos => getPathTile(grid, current.pos, current, pos));
    const f5 = f4.filter(pos => pos.sameDirMoves <= 3);

    return f5;

    return [
        { l: current.pos.l - 1, c: current.pos.c },
        { l: current.pos.l + 1, c: current.pos.c },
        { l: current.pos.l, c: current.pos.c - 1 },
        { l: current.pos.l, c: current.pos.c + 1 },
    ].filter(pos =>
        pos.l >= 0 && pos.l < grid.length &&
        pos.c >= 0 && pos.c < grid[0].length &&
        !(pos.l === current.parent?.pos.l && pos.c === current.parent?.pos.c)
    ).filter(pos => !explored.includes(getHash(pos)))
        .map(pos => getPathTile(grid, current.pos, current, pos))
        .filter(pos => pos.sameDirMoves <= 3);
}

function getHash(pos: Pos) {
    return pos.l * 1000 + pos.c;
}

function getSameDirCount(current: Pos, prev: PathTile) {
    let count = 0;
    let last = prev;
    let condition: () => boolean = current.l === prev.pos.l ? () => last.pos.l === current.l : () => last.pos.c === current.c;
    while (condition()) {
        count++;
        if (last.parent === undefined)
            return count;
        last = last.parent;
    }
    return count;
}

function getDir(currPos: Pos, prevPos: Pos) {
    if (prevPos.l === currPos.l) {
        if (prevPos.c < currPos.c)
            return 'R';
        else
            return 'L';
    } else {
        if (prevPos.l < currPos.l)
            return 'D';
        else
            return 'U';
    }
}

function getPathTile(grid: number[][], endPos: Pos, prevTile: PathTile, newPos: Pos): PathTile {
    // const Gcost = prevTile.Gcost + 1;
    // const Hcost = Math.abs(endPos.l - newPos.l) + Math.abs(endPos.c - newPos.c)
    const Tcost = prevTile.Tcost + grid[newPos.l][newPos.c];// * 10;
    // const Fcost = Tcost; //Gcost + Hcost + Tcost;
    // const sameDirDir = prevTile.pos.l === newPos.l ? 'L' : 'C';
    const currentDir = getDir(newPos, prevTile.pos)

    return {
        pos: newPos,
        // Gcost,
        // Hcost,
        Tcost,
        // Fcost,
        currentDir,
        // sameDirDir,
        // sameDirMoves: getSameDirCount(newPos, prevTile),
        // sameDirMoves: prevTile.sameDirDir === sameDirDir ? prevTile.sameDirMoves + 1 : 0,
        sameDirMoves: prevTile.currentDir === currentDir ? prevTile.sameDirMoves + 1 : 1,
        parent: prevTile,
    };
}

// Stolen from https://stackoverflow.com/a/21822316
function sortedIndex(array: PathTile[], value: PathTile) {
    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = low + high >>> 1;
        if (array[mid].Tcost < value.Tcost) low = mid + 1;
        else high = mid;
    }
    return low;
}

function renderTiles(grid: number[][], tiles: PathTile[]) {
    let result = Math.random().toFixed(2);
    for (let l = 0; l < grid.length; l++) {
        result += "\n";
        for (let c = 0; c < grid[l].length; c++) {
            const count = tiles.filter(tile => tile.pos.l === l && tile.pos.c === c).length
            if (count > 0 && count < 10)
                result += `${count}`;
            else if (count >= 10)
                result += '#';
            else
                result += '.';
        }
    }
    log(result);
}

function renderPath(data: string[], tile: PathTile) {
    const blocks: Pos[] = [];

    let lastTile: PathTile | undefined = tile;
    while (lastTile !== undefined) {
        blocks.push(lastTile.pos);
        lastTile = lastTile.parent;
    }

    let result = "";
    for (let l = 0; l < data.length; l++) {
        result += "\n";
        for (let c = 0; c < data[l].length; c++) {
            if (blocks.some(block => block.l === l && block.c === c))
                result += "#"; //result += data[l][c]; // result += '#'
            else
                result += '.';
        }
    }
    log(result);
}

function renderPathText(data: string[], tile: PathTile) {
    const blocks: PathTile[] = [];

    let lastTile: PathTile | undefined = tile;
    while (lastTile !== undefined) {
        blocks.push(lastTile);
        lastTile = lastTile.parent;
    }
    blocks.reverse();
    for (const block of blocks) {
        log(`${block.pos.l},${block.pos.c}: ${block.currentDir}${block.sameDirMoves}`)
    }
}