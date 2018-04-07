import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';

export class Zombie extends UnitClass<UnitName.Zombie> {
    public render() {
        return <div style={{
            background: 'url(images/monsters/gumba.png) no-repeat 0 0 / 100%',
            width: '100%',
            height: '100%'}}>
        </div>
    }
}