import { Unit, UnitName } from '../MyasoStore';

export function shootUnit(unit: Unit<UnitName>, damage: number): number {
    const { maxHp, hp } = unit as any;
    if (typeof hp === 'number') {
        const nextHp = Math.max(0, hp - damage);
        (unit as any).hp = nextHp;
        return nextHp === 0
            ? maxHp
            : 0;
    } else {
        return 0;
    }
}