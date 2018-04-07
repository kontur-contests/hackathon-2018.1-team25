import { Unit, UnitName } from '../MyasoStore';
import { shootUnit } from './shootUnit';

export function shootUnits(units: Unit<UnitName>[], damage: number): number {
    return units.reduce((previous, unit) => previous + shootUnit(unit, damage), 0);
}