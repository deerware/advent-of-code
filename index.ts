import caloriecounting from './2022/01_Calorie_Counting/caloriecounting';
import rockpaperscissors from './2022/02_Rock_Paper_Scissors/rockpaperscissors';
import rucksackreorganization from './2022/03_Rucksack_Reorganization/rucksackreorganization';
import campcleanup from './2022/04_Camp_Cleanup/campcleanup';
import log from './log';

(async () => {
    try {
        // await caloriecounting();
        // await rockpaperscissors();
        // await rucksackreorganization();
        await campcleanup();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();