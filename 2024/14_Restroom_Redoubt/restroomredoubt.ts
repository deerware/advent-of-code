import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function restroomredoubt() {
    log('Day 14: Restroom Redoubt');

    await global.run('2024/14_Restroom_Redoubt', [
        ['Part 1 test 1', part1, 'sampleData1.txt', 0, [11, 7], 5],
        ['Part 1 test 2', part1, 'sampleData2.txt', 12, [11, 7], 100],
        ['Part 1', part1, 'input.txt', 231221760, [101, 103], 100],
        false,
        // ['Part 2 test 1', part2, 'sampleData2.txt', 0, [11, 7]],
        // ['Part 2', part2, 'input.txt', null, [101, 103]],
    ], parseData);
}

type Robot = { pos: Pos, velocity: Pos };
type Pos = [x: number, y: number];
type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const robots: Robot[] = [];
    for (const line of _data) {
        const pos = line.split('p=')[1].split(' ')[0].split(',').map(Number) as Pos;
        const velocity = line.split('v=')[1].split(',').map(Number) as Pos;
        robots.push({ pos, velocity });
    }
    return robots;
}

async function part1(data: Data, mapDimensions: Pos, seconds: number): Promise<number> {
    for (let i = 0; i < seconds; i++)
        moveAll(data, mapDimensions);

    return evaluate(data, mapDimensions);
}

async function part2(data: Data, mapDimensions: Pos, seconds: number): Promise<number> {
    return -Infinity;
}

function moveAll(data: Data, mapDimensions: Pos) {
    data.forEach(robot => move(robot, mapDimensions));
}

function move(robot: Robot, mapDimensions: Pos) {
    const newPos = [robot.pos[0] + robot.velocity[0], robot.pos[1] + robot.velocity[1]];

    if (newPos[0] < 0)
        newPos[0] += mapDimensions[0]

    if (newPos[0] >= mapDimensions[0])
        newPos[0] -= mapDimensions[0];

    if (newPos[1] < 0)
        newPos[1] += mapDimensions[1]

    if (newPos[1] >= mapDimensions[1])
        newPos[1] -= mapDimensions[1];

    robot.pos = newPos as Pos;
}

function evaluate(data: Data, mapDimensions: Pos) {
    const h = (mapDimensions[0] - 1) / 2
    const v = (mapDimensions[1] - 1) / 2

    let sums = [0, 0, 0, 0];
    for (const robot of data) {
        if (robot.pos[0] < h && robot.pos[1] < v)
            sums[0]++;

        if (robot.pos[0] < h && robot.pos[1] > v)
            sums[1]++;

        if (robot.pos[0] > h && robot.pos[1] < v)
            sums[2]++;

        if (robot.pos[0] > h && robot.pos[1] > v)
            sums[3]++;
    }

    return sums.reduce((acc, sum) => acc * sum, 1);
}

function render(data: Data, mapDimensions: Pos) {
    console.log("---")
    for (let i = 0; i < mapDimensions[1]; i++) {
        let row = '';
        for (let j = 0; j < mapDimensions[0]; j++) {
            const robots = data.filter(robot => robot.pos[0] === j && robot.pos[1] === i);
            row += robots.length > 0 ? robots.length : '.';
        }
        console.log(i.toString(16) + ' ' + row);
    }
}