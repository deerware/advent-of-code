import historianhysteria from './2024/01_Historian_Hysteria/historianhysteria';
import rednosedreports from './2024/02_Red_Nosed_Reports/rednosedreports';
import mullitover from './2024/03_Mull_It_Over/mullitover';
import ceressearch from './2024/04_Ceres_Search/ceressearch';
import printqueue from './2024/05_Print_Queue/printqueue';
import guardgallivant from './2024/06_Guard_Gallivant/guardgallivant';
import log from './log';

(async () => {
    try {
        // await historianhysteria();
        // await rednosedreports();
        // await mullitover();
        // await ceressearch();
        // await printqueue();
        await guardgallivant();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();