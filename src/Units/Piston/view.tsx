import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';
import * as c from './index.pcss';

export class Piston extends UnitClass<UnitName.Piston> {
    public render() {
        return <div className={ c.Piston }>
            tower
        </div>;
    }
}