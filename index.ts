import historianhysteria from './2024/01_Historian_Hysteria/historianhysteria';
import rednosedreports from './2024/02_Red_Nosed_Reports/rednosedreports';
import log from './log';

(async () => {
    try {
        // await historianhysteria();
        await rednosedreports();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();