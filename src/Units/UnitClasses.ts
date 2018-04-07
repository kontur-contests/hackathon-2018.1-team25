import { UnitName } from '../Store/MyasoStore';
import { UnitClassConstructor } from './UnitClass';
import { Zombie } from './Zombie/view';

export const UnitClasses: {
    [key in UnitName]: UnitClassConstructor<key>;
} = {
    Zombie,
};