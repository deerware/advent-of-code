import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { column } from 'mathjs';

export default async function trashcompactor() {
    log('Day 6: Trash Compactor');

    await g.run('2025/06_Trash_Compactor', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 4277556],
        ['Part 1', part1, 'input.txt', 6503327062445],
        false,
        ['Part 2 test 1', part2, 'sampleData2.txt', 0],
        ['Part 2', part2, 'input.txt', null],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let columns: number[][] = [];

    const operations = _data.pop()!.split(/ +/) as ('*' | '+')[];
    if (operations[0] as any == "")
        operations.shift();
    if (operations[operations.length - 1] as any == "")
        operations.pop();

    for (const line of _data) {
        const cols = line.split(/ +/);

        if (cols[0] == "")
            cols.shift();
        if (cols[cols.length - 1] == "")
            cols.pop();

        if (columns.length > 0)
            if (columns.length != cols.length)
                throw new Error('Input ERROR - ' + columns.length + ' vs ' + cols.length + ' - ' + JSON.stringify(cols));


        for (let i = 0; i < cols.length; i++) {
            if (!columns[i])
                columns[i] = [];
            columns[i].push(parseInt(cols[i]));
        }
    }

    return { columns, operations };
}

async function part1({ columns, operations }: Data): Promise<number> {
    let total = 0;
    for (let i = 0; i < columns.length; i++) {
        if (operations[i] == '+')
            total += columns[i].reduce((sum, column) => sum + column, 0);
        else
            total += columns[i].reduce((sum, column) => sum * column, 1);
    }
    return total;
}

async function part2(data: Data): Promise<number> {
    return -Infinity;
}