export type Player = {
    xp: number,
    level: number,
    money: number,
}

export enum UnitName {
    Zombie = 'Zombie',
    Tower = 'Tower',
    Piston = 'Piston',
}

export type Rotaion = {
    rotation: number;
};

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
    maxHp: number;
    lastShootTime: number;
};

export type ShootCharacter = {
    lastShootTime: number;
};

export type WeaponBullet = {
    destination: PointCoordinates;
}

export type UnitData = {
    Zombie: Character;
    Tower: Character;
    Piston: WeaponBullet;
};

export type Unit<T extends UnitName> =
    & UnitData[T]
    & Rotaion
    & PointCoordinates
    & Size
    & {
    name: T;
    intersection: boolean;
};

export type MyasoStore = {
    units: Unit<UnitName>[];
    speed: number;
    shotPosition: PointCoordinates | undefined;
    player: Player;
    weapon: WeaponBulletName;
};

export const TOWER_SIZE = 9;

export type WeaponBulletName = UnitName.Piston;

export const WeaponIntervals: {
    [key in WeaponBulletName]: number;
} = {
    [UnitName.Piston]: 2000,
};

export const defaultConstructorState: MyasoStore = {
    units: [
        {
            name: UnitName.Tower,
            x: -TOWER_SIZE / 2,
            y: -TOWER_SIZE / 2,
            width: TOWER_SIZE,
            height: TOWER_SIZE,
            hp: 100,
            maxHp: 100,
            intersection: false,
            rotation: 0,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: -50,
            y: 0,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: 50,
            y: 80,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: -40,
            y: 100,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: 100,
            y: -50,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: -70,
            y: 50,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: -10,
            y: -70,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
        {
            name: UnitName.Zombie,
            x: -5,
            y: -70,
            width: 2,
            height: 2,
            hp: 100,
            maxHp: 100,
            intersection: true,
            rotation: 45,
            lastShootTime: 0,
        },
    ],
    speed: 1,
    shotPosition: undefined,
    player: {
        level: 1,
        xp: 0,
        money: 100,
    },
    weapon: UnitName.Piston,
};
