const days = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
let day: number;

export default function log(...params: any[]) {
    let date = new Date();
    checkDay(date);
    console.log("[" + (new Date().toLocaleTimeString('cs-CZ', { hour: "2-digit", minute: "2-digit", second: "2-digit" })) + "]", ...params);
}

function checkDay(date: Date) {
    if (date.getDate() === day)
        return false;
    console.log(` - ${days[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}.`);
    day = date.getDate();
}