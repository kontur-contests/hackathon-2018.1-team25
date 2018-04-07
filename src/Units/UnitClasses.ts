import { UnitName } from '../Store/MyasoStore';
import { Piston } from './Piston/view';
import { Tower } from './Tower/view';
import { UnitClassConstructor } from './UnitClass';
import { Zombie } from './Zombie/view';

export const UnitClasses: {
    [key in UnitName]: UnitClassConstructor<key>;
} = {
    Zombie,
    Tower,
    Piston,
};