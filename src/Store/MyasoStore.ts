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
    xp: number;
    lastShootTime: number;
};

export type ShootCharacter = {
    lastShootTime: number;
};

export type WeaponBullet = {
    destination: PointCoordinates;
    death: boolean;
}

export type UnitData = {
    Zombie: Character;
    Tower: Character & {
        weaponRotation: number;
        weaponName: WeaponBulletName;
    };
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
    money: number;
};

export type MyasoStore = {
    units: Unit<UnitName>[];
    speed: number;
    shotPosition: PointCoordinates | undefined;
    hoverPosition: PointCoordinates,
    player: Player;
    weapon: WeaponBulletName;
    showShopMenu: boolean;
};

export const TOWER_SIZE = 11;

export type WeaponBulletName = UnitName.Piston;

export const WeaponIntervals: {
    [key in WeaponBulletName]: number;
} = {
    [UnitName.Piston]: 500,
};

export const UnitSize: {
    [key in UnitName]: Size;
} = {
    [UnitName.Zombie]: {
        width:4,
        height:4,
    },
    [UnitName.Piston]: {
        width: 1,
        height: 1,
    },
    [UnitName.Tower]: {
        width: TOWER_SIZE,
        height: TOWER_SIZE,
    },
};

export const CharacterParams: {
    [key in UnitName]: Character;
} = {
    [UnitName.Zombie]: {
        hp:5,
        maxHp:5,
        xp: 1,
        lastShootTime: 0,
    },
    [UnitName.Piston]: {
        hp: 0,
        maxHp: 0,
        xp: 0,
        lastShootTime: 0,
    },
    [UnitName.Tower]: {
        hp: 0,
        maxHp: 0,
        xp: 0,
        lastShootTime: 0,
    },
};

export const UnitMoney: {
    [key in UnitName]: number;
} = {
    [UnitName.Zombie]: 10,
    [UnitName.Piston]: 0,
    [UnitName.Tower]: 0,
};

export const defaultConstructorState: MyasoStore = {
    units: [
        {
            name: UnitName.Tower,
            x: -TOWER_SIZE / 2,
            y: -TOWER_SIZE / 2,
            ...UnitSize.Tower,
            hp: 100,
            maxHp: 100,
            intersection: false,
            rotation: 0,
            lastShootTime: 0,
            xp: 0,
            weaponRotation: 0,
            money: 0,
            weaponName: UnitName.Piston,
        },
    ],
    speed: 1,
    shotPosition: undefined,
    hoverPosition: {
        x: 0,
        y: 0,
    },
    player: {
        level: 1,
        xp: 0,
        money: 100,
    },
    weapon: UnitName.Piston,
    showShopMenu: false,
};
