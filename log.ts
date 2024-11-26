import { colors } from "./types";


let lastDate: Date;

export default function log(...params: any[]) {
    checkDay();

    let paramsToPrint;
    let nextColor = undefined;
    if (params.length > 0) {
        paramsToPrint = [];
        for (const param of params) {
            if (typeof param == "string" && param.startsWith(`\x1b[`)) {
                nextColor = (nextColor ?? '') + param;
            } else {
                if (typeof param == "string" || typeof param == "number" || typeof param == "boolean" || param instanceof Date) {
                    paramsToPrint.push((nextColor ?? '') + param);
                } else {
                    if (nextColor != undefined)
                        paramsToPrint.push(nextColor);
                    paramsToPrint.push(param);
                }
                nextColor = undefined;
            }
        }
    } else {
        paramsToPrint = params;
    }

    console.log(colors.reset + "[" + (new Date().toLocaleTimeString('cs-CZ', { hour: "2-digit", minute: "2-digit", second: "2-digit" })) + "]", ...paramsToPrint);
}

function checkDay() {
    const now = new Date();
    if (sameDay(now, lastDate))
        return false;

    console.log(` - ${now.toISOString().substring(0, 10)}`);
    lastDate = now;
}

function sameDay(d1: Date, d2: Date) {
    return d1?.getFullYear() === d2?.getFullYear() &&
        d1?.getMonth() === d2?.getMonth() &&
        d1?.getDate() === d2?.getDate();
}