import { z } from "zod";
import log from "./log";
import fs from "fs";
import inputCrypt from "./inputCrypt";


const args = z.tuple([
    z.string(),
    z.string(),
    z.string(),
    z.string(),
]).parse(process.argv);

log(args[2]);

const data = fs.readFileSync(args[2], 'utf-8');
fs.writeFileSync(args[3], inputCrypt.decrypt(data));