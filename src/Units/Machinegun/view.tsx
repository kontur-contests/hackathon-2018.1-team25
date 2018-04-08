import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';
import * as c from './index.pcss';

export class Machinegun extends UnitClass<UnitName.Machinegun> {
    public render() {
        return <div className={ c.Machinegun }>
            <img src="./images/piston.png"/>
        </div>;
    }
}