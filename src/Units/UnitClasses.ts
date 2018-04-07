import { UnitName } from '../Store/MyasoStore';
import { Bazooka } from './Bazooka/view';
import { Machinegun } from './Machinegun/view';
import { Piston } from './Piston/view';
import { Poo } from './Poo/view';
import { Tower } from './Tower/view';
import { UnitClassConstructor } from './UnitClass';
import { Zombie } from './Zombie/view';

export const UnitClasses: {
    [key in UnitName]: UnitClassConstructor<key>;
} = {
    Zombie,
    Tower,
    Piston,
    Bazooka,
    Poo,
    Machinegun,
};