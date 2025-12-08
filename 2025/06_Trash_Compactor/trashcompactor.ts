import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import { column } from 'mathjs';

export default async function trashcompactor() {
    log('Day 6: Trash Compactor');

    await g.run('2025/06_Trash_Compactor', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 4277556],
        ['Part 1', part1, 'input.txt', 6503327062445],
        null,
        ['Part 2 test 1', part2, 'sampleData1.txt', 3263827],
        ['Part 2 test 2', part2, 'sampleData2.txt', 3263827 + 176],
        ['Part 2', part2, 'input.txt', 9640641878593],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    let columns: number[][] = [];

    const part1Data = [..._data];

    const operations = part1Data.pop()!.split(/ +/) as ('*' | '+')[];
    if (operations[0] as any == "")
        operations.shift();
    if (operations[operations.length - 1] as any == "")
        operations.pop();

    for (const line of part1Data) {
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

    return { columns, operations, raw: _data };
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

async function part2({ raw: data }: Data): Promise<number> {
    const operations = data.pop()!;

    const max = data.reduce((max, line) => line.length > max ? line.length : max, 0);

    let total = 0;

    let buffer = [];
    for (let i = max - 1; i >= 0; i--) {
        let number = '';
        for (const row of data)
            number += row[i] != ' ' ? (row[i] ?? '') : '';

        if (number == "")
            continue;

        buffer.push(parseInt(number))

        if (operations[i] == " " || operations[i] == "" || !operations[i])
            continue;

        // console.log(JSON.stringify(buffer));
        if (operations[i] == "+")
            total += buffer.reduce((sum, column) => sum + column, 0);
        else
            total += buffer.reduce((sum, column) => sum * column, 1);

        buffer.length = 0;
    }

    return total;
}