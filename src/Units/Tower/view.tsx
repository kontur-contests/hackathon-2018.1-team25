import * as React from 'react';
import {UnitName} from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';
import * as c from './index.pcss';

export class Tower extends UnitClass<UnitName.Tower> {
    public render() {
        const {
            weaponRotation,
            weaponName,
        } = this.props;

        return <div className={ c.Tower }>
            <img
                src="./images/tower.png"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            <div
                className={ c.Tower__weapon }
                style={ {
                    transform: `rotate(${weaponRotation}deg)`,
                    backgroundImage: `url(./images/weapons/${weaponName}.png)`,
                } }
            />
        </div>;
    }
}