import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';

export class Bubble extends UnitClass<UnitName.Bubble> {
    public render() {
        return <div>
            <img src="./images/monsters/monster.gif" style={{width: '100%', height: '100%'}}/>
        </div>
    }
}