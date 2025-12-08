import log from './log';
import secretentrance from './2025/01_Secret_Entrance/secretentrance';
import giftshop from './2025/02_Gift_Shop/giftshop';
import lobby from './2025/03_Lobby/lobby';
import printingdepartment from './2025/04_Printing_Department/printingdepartment';
import cafeteria from './2025/05_Cafeteria/cafeteria';
import playground from './2025/08_Playground/playground';

(async () => {
    try {
        // await secretentrance();
        // await giftshop();
        // await lobby();
        // await printingdepartment();
        // await cafeteria();
        await playground();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();