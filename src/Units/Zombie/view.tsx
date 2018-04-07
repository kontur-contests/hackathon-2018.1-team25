import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';

export class Zombie extends UnitClass<UnitName.Zombie> {
    public render() {
        return <div>
            <img src="./images/monsters/gumba.gif" style={{width: '100%', height: '100%'}}/>
        </div>
    }
}