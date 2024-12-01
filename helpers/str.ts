export default function strBetween(str: string, startStr: string, endStr: string, nullable: true): string | null;
export default function strBetween(str: string, startStr: string, endStr: string, nullable?: false): string;
export default function strBetween(str: string, startStr: string, endStr: string, nullable = false) {
    const i1 = str.indexOf(startStr);
    if (i1 === -1)
        if (nullable)
            return null;
        else
            throw new Error(`Could not find start string: ${startStr}`);

    const pos = i1 + startStr.length;

    const i2 = str.indexOf(endStr, pos);
    if (i2 === -1)
        if (nullable)
            return null;
        else
            throw new Error(`Could not find end string: ${endStr}`);

    return str.substring(pos, i2);
}