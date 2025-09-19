import caloriecounting from './2022/01_Calorie_Counting/caloriecounting';
import rockpaperscissors from './2022/02_Rock_Paper_Scissors/rockpaperscissors';
import rucksackreorganization from './2022/03_Rucksack_Reorganization/rucksackreorganization';
import campcleanup from './2022/04_Camp_Cleanup/campcleanup';
import supplystacks from './2022/05_Supply_Stacks/supplystacks';
import tuningtrouble from './2022/06_Tuning_Trouble/tuningtrouble';
import nospaceleftondevice from './2022/07_No_Space_Left_On_Device/nospaceleftondevice';
import log from './log';

(async () => {
    try {
        // await caloriecounting();
        // await rockpaperscissors();
        // await rucksackreorganization();
        // await campcleanup();
        // await supplystacks();
        // await tuningtrouble();
        await nospaceleftondevice();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();