import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function warehousewoes() {
    log('Day 15: Warehouse Woes');

    await global.run('2024/15_Warehouse_Woes', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 2028],
        ['Part 1 test 2', part1, 'sampleData2.txt', 10092],
        ['Part 1', part1, 'input.txt', 1465523],
        null,
        ['Part 2 test 1', part2, 'sampleData3.txt', 618],
        ['Part 2 test 1', part2, 'sampleData2.txt', 9021],
        ['Part 2', part2, 'input.txt', 1471049],
    ], parseData);
}

enum DIR { UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3 }
enum TILE { WALL = '#', AIR = '.', BOX = 'O', BOXL = '[', BOXR = ']', SELF = '@' }
type Pos = [r: number, c: number];
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let map: TILE[][] = [];
    let instructions: DIR[] = [];
    let part2 = false;
    let currentPos: Pos;

    const dirMap = { '<': DIR.LEFT, '>': DIR.RIGHT, '^': DIR.UP, 'v': DIR.DOWN };
    for (const line of _data) {
        if (line.trim() === '') {
            part2 = true;
            continue;
        }

        if (!part2) {
            const row: TILE[] = [];
            for (let c = 0; c < line.length; c++) {
                if (line[c] === TILE.SELF) {
                    currentPos = [map.length, c];
                    row.push(TILE.AIR);
                } else {
                    row.push(line[c] as TILE);
                }
            }
            map.push(row);
        }
        else
            for (let c = 0; c < line.length; c++)
                instructions.push(dirMap[line[c] as keyof typeof dirMap]);
    }
    if (!currentPos!)
        throw new Error('Current position not found');

    return { currentPos, map, instructions };
}

async function part1(data: Data): Promise<number> {
    for (const instruction of data.instructions) {
        if (move1(data, data.currentPos, instruction))
            data.currentPos = getNewTile(data.currentPos, instruction);
    }
    return getGPS(data);
}

async function part2(data: Data): Promise<number> {
    expandWarehouse(data);

    for (const instruction of data.instructions)
        if (move2(data, data.currentPos, instruction))
            data.currentPos = getNewTile(data.currentPos, instruction);

    return getGPS(data);
}

function move1(data: Data, pos: Pos, dir: DIR, movingBox = false): boolean {
    const newTilePos = getNewTile(pos, dir);
    const newTile = data.map[newTilePos[0]][newTilePos[1]];
    if (newTile === TILE.WALL)
        return false;
    if (newTile === TILE.BOX)
        if (!move1(data, newTilePos, dir, true))
            return false;

    if (movingBox) {
        data.map[newTilePos[0]][newTilePos[1]] = TILE.BOX;
        data.map[pos[0]][pos[1]] = TILE.AIR;
    }

    return true;
}

function move2(data: Data, pos: Pos, dir: DIR): boolean {
    if (dir === DIR.UP || dir === DIR.DOWN) {
        if (move2UD(data, pos, dir, false))
            return move2UD(data, pos, dir, true);

        return false;
    }

    return move2LR(data, pos, dir);
}
function move2LR(data: Data, pos: Pos, dir: DIR, movingBox = false): boolean {
    const newTilePos = getNewTile(pos, dir);
    const newTile = data.map[newTilePos[0]][newTilePos[1]];
    if (newTile === TILE.WALL)
        return false;
    if (newTile === TILE.BOXL || newTile === TILE.BOXR)
        if (!move2LR(data, newTilePos, dir, true))
            return false;

    if (movingBox) {
        data.map[newTilePos[0]][newTilePos[1]] = data.map[pos[0]][pos[1]];
        data.map[pos[0]][pos[1]] = TILE.AIR;
    }

    return true;
}
function move2UD(data: Data, pos: Pos, dir: DIR, doMove = false, movingBox = false): boolean {
    const newTilePos = getNewTile(pos, dir);
    const newTile = data.map[newTilePos[0]][newTilePos[1]];
    let moveWith: Pos | null = null;

    if (newTile === TILE.WALL)
        return false;

    if (newTile === TILE.BOXL)
        moveWith = getNewTile(newTilePos, DIR.RIGHT);
    if (newTile === TILE.BOXR)
        moveWith = getNewTile(newTilePos, DIR.LEFT);

    if (moveWith)
        if (!move2UD(data, newTilePos, dir, doMove, true) || !move2UD(data, moveWith, dir, doMove, true))
            if (doMove)
                throw new Error('INVALID');
            else
                return false;

    if (movingBox && doMove) {
        data.map[newTilePos[0]][newTilePos[1]] = data.map[pos[0]][pos[1]];
        data.map[pos[0]][pos[1]] = TILE.AIR;
    }

    return true;
}

function getNewTile(pos: Pos, dir: DIR): Pos {
    switch (dir) {
        case DIR.UP: return [pos[0] - 1, pos[1]];
        case DIR.RIGHT: return [pos[0], pos[1] + 1];
        case DIR.DOWN: return [pos[0] + 1, pos[1]];
        case DIR.LEFT: return [pos[0], pos[1] - 1];
    }
    throw new Error('Invalid direction');
}

function getGPS(data: Data) {
    let sum = 0;
    for (let r = 0; r < data.map.length; r++) {
        for (let c = 0; c < data.map[r].length; c++) {
            if (data.map[r][c] === TILE.BOX || data.map[r][c] === TILE.BOXL)
                sum += 100 * r + c;
        }
    }
    return sum;
}

function expandWarehouse(data: Data) {
    let newMap: TILE[][] = [];
    for (let r = 0; r < data.map.length; r++) {
        let newRow: TILE[] = [];
        for (let c = 0; c < data.map[r].length; c++) {
            switch (data.map[r][c]) {
                case TILE.WALL:
                    newRow.push(TILE.WALL)
                    newRow.push(TILE.WALL)
                    break;
                case TILE.AIR:
                    newRow.push(TILE.AIR)
                    newRow.push(TILE.AIR)
                    break;
                case TILE.BOX:
                    newRow.push(TILE.BOXL)
                    newRow.push(TILE.BOXR)
                    break;
            }
        }
        newMap.push(newRow);
    }
    data.map = newMap;
    data.currentPos = [data.currentPos[0], data.currentPos[1] * 2];
}

function render(data: Data) {
    let str = '\n';
    for (let r = 0; r < data.map.length; r++) {
        for (let c = 0; c < data.map[r].length; c++) {
            if (data.currentPos[0] === r && data.currentPos[1] === c) {
                if (data.map[r][c] !== TILE.AIR) {
                    log(colors.fg.red, "INVALID POSITION!", data.map[r][c], colors.reset);
                    str += '!';
                }
                else
                    str += TILE.SELF;
            } else
                str += data.map[r][c];
        }
        str += '\n';
    }
    log(str);
}