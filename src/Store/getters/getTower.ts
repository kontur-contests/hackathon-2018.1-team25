import { MyasoStore, Unit, UnitName } from '../MyasoStore';

export function getTower(state: MyasoStore): Unit<UnitName.Tower> {
    return state.units.find(({name}) => name === UnitName.Tower) as Unit<UnitName.Tower>;
}