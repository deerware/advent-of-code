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
        await hoofit();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();