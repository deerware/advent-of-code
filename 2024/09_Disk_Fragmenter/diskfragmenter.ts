import log from '../../log'
import { colors } from '../../types'
import * as global from '../../global';

export default async function diskfragmenter() {
    log('Day 9: Disk Fragmenter');

    await global.run('2024/09_Disk_Fragmenter', [
        ['Part 1 test 1', part1, 'sampleData.txt', 1928],
        ['Part 1', part1, 'input.txt', 6382875730645],
        null,
        ['Part 2 test 1', part2, 'sampleData.txt', 2858],
        ['Part 2', part2, 'input.txt', 6420913943576],
    ], parseData);
}

type Data = ReturnType<typeof parseData>;
function parseData(_data: string[]) {
    const data = _data[0];
    const disk: Slot[] = [];
    const files: { [id: number]: number } = {};

    for (let i = 0; i < data.length; i++) {
        const size = parseInt(data[i]);
        if (size === 0)
            continue;

        if (i % 2 === 0) {
            const id = i / 2;
            disk.push(new File(id, size));
            files[id] = size;
        } else
            disk.push(new Slot(size));
    }

    compress(disk);

    return { disk, files };
}

async function part1({ disk }: Data): Promise<number> {
    for (let i = 0; i < disk.length; i++) {
        if (disk[i].isFile)
            continue;

        if (disk[disk.length - 1].isGap) {
            disk.pop();

            if (disk.length === i) // -1 + 1 (because of the pop)
                break;
        }

        const lastFile = disk[disk.length - 1] as File;
        const gapToFill = disk[i];

        if (lastFile.size === gapToFill.size) {
            disk[i] = disk.pop()!;
        } else if (lastFile.size < gapToFill.size) {
            disk[i] = disk.pop()!;
            disk.splice(i + 1, 0, new Slot(gapToFill.size - lastFile.size));
        } else {
            disk[i] = new File(lastFile.id, gapToFill.size);
            lastFile.size -= gapToFill.size;
        }
    }

    return checksum(disk);
}

async function part2({ disk, files }: Data): Promise<number> {
    for (let i = Object.keys(files).length - 1; i >= 0; i--) {
        const fileIndex = disk.findIndex(v => v.isFile && (v as File).id === i);
        const file = disk[fileIndex] as File;

        for (let j = 0; j < fileIndex; j++) {
            const gap = disk[j];

            if (gap.isFile)
                continue;

            if (gap.size < files[i])
                continue;

            disk.splice(fileIndex, 1, new Slot(file.size));

            if (gap.size === files[i]) {
                disk[j] = file;
            }
            if (gap.size > files[i]) {
                disk[j] = file;
                disk.splice(j + 1, 0, new Slot(gap.size - file.size));
            }
            compress(disk);
            break;
        }
    }

    return checksum(disk);
}

function compress(disk: Slot[]) {
    for (let i = 0; i < disk.length; i++) {
        if (disk[i].isFile)
            continue;

        if (i === disk.length - 1)
            break;

        if (disk[i + 1].isGap) {
            disk[i].size += disk[i + 1].size;
            disk.splice(i + 1, 1);
        }
    }
}

function checksum(disk: Slot[]) {
    let sum = 0;
    let ri = 0;
    for (let i = 0; i < disk.length; i++) {
        const slot = disk[i];

        if (slot.isGap) {
            ri += slot.size;
            continue;
        }

        const file = slot as File;

        for (let j = 0; j < file.size; j++) {
            sum += file.id * ri++;
        }
    }

    return sum;
}

function render(disk: Slot[]) {
    let str = ' ';
    for (const slot of disk) {
        if (slot.isFile) {
            str += colors.fg.green;
            for (let i = 0; i < slot.size; i++)
                str += (slot as File).id.toString(36);
        } else {
            str += colors.fg.gray;
            for (let i = 0; i < slot.size; i++)
                str += '.';
        }
    }
    log(str);
}

class Slot {
    constructor(
        public size: number,
    ) { }

    get isGap(): boolean { return !this.isFile; }
    get isFile(): boolean { return this instanceof File; }
}

class File extends Slot {
    constructor(
        public id: number,
        size: number,
    ) { super(size); }
}