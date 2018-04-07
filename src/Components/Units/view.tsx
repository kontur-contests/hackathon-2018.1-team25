import * as React from 'react';
import { Unit, UnitName } from '../../Store/MyasoStore';
import { UnitClasses } from '../../Units/UnitClasses';
import * as c from './style.pcss';

export type UnitsProps = {
    units: Unit<UnitName>[];
}

function unitToStyle({
                         width,
                         height,
                         x,
                         y,
                         rotation,
                     }: Unit<UnitName>): React.CSSProperties {
    return {
        width: `${width}%`,
        height: `${height}%`,
        top: `${y + 50}%`,
        left: `${x + 50}%`,
        transform: `rotate(${rotation}deg)`,
    }
}

export class Units extends React.Component<UnitsProps, {}> {
    public render() {
        const {
            units,
        } = this.props;

        return <div>
            <React.Fragment>
                {
                    units.map((unit, i) => {
                        const UClass: Unit<any> = UnitClasses[unit.name];

                        return <div
                            key={ i }
                            className={ c.Units__unit }
                            style={ unitToStyle(unit) }
                        >
                            <UClass { ...unit }/>
                        </div>;

                    })
                }
                {
                    units.map((unit, i) => {
                        const {
                            hp,
                            maxHp,
                        } = unit as any;

                        return typeof hp === 'number'
                            ? <div
                                key={ i }
                                className={ c.Units__hp }
                                style={ unitToStyle({
                                    ...unit,
                                    width: 0,
                                    height: 0,
                                    x: unit.x + unit.height / 2,
                                    rotation: 0,
                                }) }
                            >
                                <div className={ c.Units__hp__text }>
                                    { `${hp}/${maxHp}` }
                                </div>
                            </div>
                            : null
                    })
                }
            </React.Fragment>
        </div>;
    }
}
