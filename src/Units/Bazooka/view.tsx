import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';
import * as c from './index.pcss';

export class Bazooka extends UnitClass<UnitName.Bazooka> {
    public render() {
        return <div className={ c.Piston }>
            <img  src="./images/rocket.png"/>
        </div>;
    }
}