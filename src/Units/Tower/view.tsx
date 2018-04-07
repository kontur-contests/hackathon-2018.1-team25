import * as React from 'react';
import { UnitName } from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';
import * as c from './index.pcss';

export class Tower extends UnitClass<UnitName.Tower> {
    public render() {
        return <div className={ c.Tower }>
            tower
        </div>;
    }
}