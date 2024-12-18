import historianhysteria from './2024/01_Historian_Hysteria/historianhysteria';
import rednosedreports from './2024/02_Red_Nosed_Reports/rednosedreports';
import mullitover from './2024/03_Mull_It_Over/mullitover';
import ceressearch from './2024/04_Ceres_Search/ceressearch';
import printqueue from './2024/05_Print_Queue/printqueue';
import guardgallivant from './2024/06_Guard_Gallivant/guardgallivant';
import bridgerepair from './2024/07_Bridge_Repair/bridgerepair';
import resonantcollinearity from './2024/08_Resonant_Collinearity/resonantcollinearity';
import diskfragmenter from './2024/09_Disk_Fragmenter/diskfragmenter';
import hoofit from './2024/10_Hoof_It/hoofit';
import plutonianpebbles from './2024/11_Plutonian_Pebbles/plutonianpebbles';
import gardengroups from './2024/12_Garden_Groups/gardengroups';
import clawcontraption from './2024/13_Claw_Contraption/clawcontraption';
import restroomredoubt from './2024/14_Restroom_Redoubt/restroomredoubt';
import warehousewoes from './2024/15_Warehouse_Woes/warehousewoes';
import reindeermaze from './2024/16_Reindeer_Maze/reindeermaze';
import chronospatialcomputer from './2024/17_Chronospatial_Computer/chronospatialcomputer';
import ramrun from './2024/18_RAM_Run/ramrun';
import log from './log';

(async () => {
    try {
        // await historianhysteria();
        // await rednosedreports();
        // await mullitover();
        // await ceressearch();
        // await printqueue();
        // await guardgallivant();
        // await bridgerepair();
        // await resonantcollinearity();
        // await diskfragmenter();
        // await hoofit();
        // await plutonianpebbles();
        // await gardengroups(); // 🍝
        // await clawcontraption();
        // await restroomredoubt();
        // await warehousewoes();
        // await reindeermaze();
        // await chronospatialcomputer(); // part 2 not finished
        await ramrun();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();