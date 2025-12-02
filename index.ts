import log from './log';
import secretentrance from './2025/01_Secret_Entrance/secretentrance';
import giftshop from './2025/02_Gift_Shop/giftshop';

(async () => {
    try {
        // await secretentrance();
        await giftshop();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();