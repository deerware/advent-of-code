import trebuchet from './01_Trebuchet/trebuchet';
import cube_conundrum from './02_Cube_Conundrum/cube_conundrum';
import gear_ratios from './03_Gear_Ratios/gear_ratios'
import scratchcards from './04_Scratchcards/scratchcards';
import seedfertilizer from './05_Seed_Fertilizer/seedfertilizer';
import waitforit from './06_Wait_For_It/waitforit';
import camelcards from './07_Camel_Cards/camelcards';
import hauntedWasteland from './08_Haunted_Wasteland/hauntedwasteland';
import miragemaintenance from './09_Mirage_Maintenance/miragemaintenance';
import pipemaze from './10_Pipe_Maze/pipemaze';
import cosmicexpansion from './11_Cosmic_Expansion/cosmicexpansion';
import hotsprings from './12_Hot_Springs/hotsprings';
import pointofincidence from './13_Point_of_Incidence/pointofincidence'
import parabolicreflectordish from './14_Parabolic_Reflector_Dish/parabolicreflectordish';
import lenslibrary from './15_Lens_Library/lenslibrary';
import thefloorwillbelava from './16_The_Floor_Will_Be_Lava/thefloorwillbelava';
import log from './log';

(async () => {
    try {
        // await trebuchet();
        // await cube_conundrum();
        // await gear_ratios();
        // await scratchcards();
        // await seedfertilizer();
        // await waitforit();
        // await camelcards();
        // await hauntedWasteland();
        // await miragemaintenance();
        // await pipemaze();
        // await cosmicexpansion();
        // await hotsprings();
        // await pointofincidence();
        // await parabolicreflectordish();
        // await lenslibrary();
        await thefloorwillbelava();
    } catch (e) {
        log('Error:', (e as any).message);
    }
    setTimeout(() => { log('Exit') }, 60 * 60 * 1000);
})();