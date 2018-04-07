import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';

export class Poo extends UnitClass<UnitName.Poo> {
    public render() {
        return <div>
            <img src="./images/monsters/shit.gif" style={{
                width: '100%',
                height: '100%'
            }}/>
        </div>
    }
}