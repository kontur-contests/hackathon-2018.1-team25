export enum UnitName {
    Zombie = 'Zombie',
}

export type PointCoordinates = {
    x: number;
    y: number;
}

export type Size = {
    width: number;
    height: number;
}

export type Character = {
    // 0 - 100
    hp: number;
};

export type UnitData = {
    Zombie: Character;
};

export type Unit<T extends UnitName> = UnitData[T] & PointCoordinates & Size & {
    name: T;
};

export type MyasoStore = {
    units: Unit<UnitName>[];
    speed: number;
};

export const defaultConstructorState: MyasoStore = {
    units: [
        {
            name: UnitName.Zombie,
            x: -50,
            y: -20,
            width: 2,
            height: 2,
            hp: 100,
        },
    ],
    speed: 1,
};
