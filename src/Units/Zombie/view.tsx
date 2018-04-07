import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';

export class Zombie extends UnitClass<UnitName.Zombie> {
    public render() {
        return <div>
            zombie
        </div>
    }
}