import { MyasoStore, Unit, UnitName } from '../Store/MyasoStore';

export type UnitController<T extends UnitName> = (unitIndex: number,
                                                  timeDiffMs: number,
                                                  unit: Unit<T>,
                                                  store: MyasoStore) => MyasoStore;
