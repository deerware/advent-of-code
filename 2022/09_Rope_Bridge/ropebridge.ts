import log from '../../log'
import { colors } from '../../types'
import * as g from '../../global';
import * as cartesian from '../../helpers/map/cartesian';
import { DIR, DIR8, Pos } from '../../helpers/map/cartesian';

export default async function ropebridge() {
    log('Day 9: Rope Bridge');

    await g.run('2022/09_Rope_Bridge', [
        ['Part 1 test 1', part0, 'sampleData1.txt', 13],
        ['Part 1', part0, 'input.txt', 6339],
        null,
        ['Part 2 test 1', part0, 'sampleData2.txt', 36, 9],
        ['Part 2', part0, 'input.txt', 2541, 9],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    return _data.map(line => ({
        dir: cartesian.dirFromURDL(line[0]),
        count: parseInt(line.substring(2)),
    }));
}

async function part0(data: Data, noOfKnots = 1): Promise<number> {
    let posH: Pos = [0, 0];

    const tailPos: Pos[] = []
    for (let i = 0; i < noOfKnots; i++)
        tailPos.push([0, 0]);

    const posStr = (pos: Pos) => `x${pos[0]}y${pos[1]}`;

    const uniquePos = new Set<string>();
    uniquePos.add(posStr(tailPos[noOfKnots - 1]));

    for (const line of data) {
        for (let i = 0; i < line.count; i++) {
            posH = cartesian.move(posH, line.dir);

            for (let i = 0; i < noOfKnots; i++)
                if (i == 0)
                    tailPos[i] = catchUp(posH, tailPos[i]);
                else
                    tailPos[i] = catchUp(tailPos[i - 1], tailPos[i]);

            uniquePos.add(posStr(tailPos[noOfKnots - 1]));
        }
    }

    return uniquePos.size;
}

function catchUp(posH: Pos, posT: Pos): Pos {
    if (cartesian.same(posH, posT))
        return posT;

    const distanceAbs = cartesian.manhattan(posT, posH);

    if (distanceAbs[0] <= 1 && distanceAbs[1] <= 1)
        return posT;

    return cartesian.move(posT, cartesian.dir(posT, posH)!);
}

function render(posH: Pos, posT: Pos) {
    for (let y = 4; y >= 0; y--) {
        let line = y + "  ";
        for (let x = 0; x <= 5; x++) {
            if (cartesian.same([x, y], posH))
                line += "H"
            else if (cartesian.same([x, y], posT))
                line += "T"
            else
                line += ".";
        }
        console.log(line);
    }

    console.log('');
    console.log('   ------');
    console.log('');
}