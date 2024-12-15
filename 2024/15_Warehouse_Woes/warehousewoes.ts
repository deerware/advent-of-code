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
    let dataPart1 = true;
    let currentPos: Pos;

    const dirMap = { '<': DIR.LEFT, '>': DIR.RIGHT, '^': DIR.UP, 'v': DIR.DOWN };
    for (const line of _data) {
        if (line.trim() === '') {
            dataPart1 = false;
            continue;
        }

        if (dataPart1) {
            const row: TILE[] = [];
            for (let c = 0; c < line.length; c++)
                if (line[c] === TILE.SELF) {
                    currentPos = [map.length, c];
                    row.push(TILE.AIR);
                } else {
                    row.push(line[c] as TILE);
                }

            map.push(row);
            continue;
        }

        for (let c = 0; c < line.length; c++)
            instructions.push(dirMap[line[c] as keyof typeof dirMap]);
    }
    if (!currentPos!)
        throw new Error('Current position not found');

    return { currentPos, map, instructions };
}

async function part1(data: Data): Promise<number> {
    for (const instruction of data.instructions) {
        if (simpleMove(data, data.currentPos, instruction))
            data.currentPos = getNewTile(data.currentPos, instruction);
    }
    return getGPS(data);
}

async function part2(data: Data): Promise<number> {
    expandWarehouse(data);

    for (const instruction of data.instructions)
        if (part2move(data, data.currentPos, instruction))
            data.currentPos = getNewTile(data.currentPos, instruction);

    return getGPS(data);
}

function simpleMove(data: Data, pos: Pos, dir: DIR, movingBox = false): boolean {
    const newTilePos = getNewTile(pos, dir);
    const newTile = data.map[newTilePos[0]][newTilePos[1]];
    if (newTile === TILE.WALL)
        return false;
    if (newTile === TILE.BOX || newTile === TILE.BOXL || newTile === TILE.BOXR)
        if (!simpleMove(data, newTilePos, dir, true))
            return false;

    if (movingBox) {
        data.map[newTilePos[0]][newTilePos[1]] = data.map[pos[0]][pos[1]];
        data.map[pos[0]][pos[1]] = TILE.AIR;
    }

    return true;
}

function part2move(data: Data, pos: Pos, dir: DIR): boolean {
    if (dir === DIR.LEFT || dir === DIR.RIGHT)
        return simpleMove(data, pos, dir);

    if (moveUD(data, pos, dir, false)) // Check if moveable
        return moveUD(data, pos, dir, true); // Move

    return false;
}

function moveUD(data: Data, pos: Pos, dir: DIR, doMove = false, movingBox = false): boolean {
    const newTilePos = getNewTile(pos, dir);
    const newTile = data.map[newTilePos[0]][newTilePos[1]];

    if (newTile === TILE.WALL)
        return false;

    const moveWith = newTile === TILE.BOXL || newTile === TILE.BOXR ?
        getNewTile(newTilePos, newTile === TILE.BOXL ? DIR.RIGHT : DIR.LEFT) : null

    if (moveWith)
        if (!moveUD(data, newTilePos, dir, doMove, true) || !moveUD(data, moveWith, dir, doMove, true))
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
}

function getGPS(data: Data) {
    let sum = 0;

    for (let r = 0; r < data.map.length; r++)
        for (let c = 0; c < data.map[r].length; c++)
            if (data.map[r][c] === TILE.BOX || data.map[r][c] === TILE.BOXL)
                sum += 100 * r + c;

    return sum;
}

function expandWarehouse(data: Data) {
    let newMap: TILE[][] = [];
    for (let r = 0; r < data.map.length; r++) {
        let newRow: TILE[] = [];
        for (let c = 0; c < data.map[r].length; c++) {
            const tile = data.map[r][c];
            if (tile == TILE.BOX)
                newRow.push(TILE.BOXL, TILE.BOXR);
            else
                newRow.push(tile, tile);
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