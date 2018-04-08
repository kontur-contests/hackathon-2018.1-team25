import * as clone from 'clone';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { AppConnected } from './Components/App/connected';
import { setStore } from './Store/actions';
import { createMyasoStore } from './Store/createMyasoStore';
import { getTower } from './Store/getters/getTower';
import {
    CharacterParams,
    defaultConstructorState,
    MyasoStore,
    Unit,
    UnitMoney,
    UnitName,
    UnitSize,
    WeaponIntervals
} from './Store/MyasoStore';
import { UnitControllers } from './UnitControllers';
import { UnitController } from './Units/UnitController';
import { getAngleRelativeToOrigin } from './utils/getAngleRelativeToOrigin';
import { getPointRelativeToOriginByAngleAndDistance } from './utils/getPointRelativeToOriginByAngleAndDistance';
import {addXp, getNextLevelHp} from './utils/playerInteractions';
import { playSound, SoundName } from './utils/startStopAudio';
// import {runAudio} from './utils/runAudio';
// runAudio();

declare const gameOVER: () => void;

const { addBlood } = require('./utils/addBlood');

function createAnimaionConstoller(store: Store<MyasoStore>) {
    let lastTime = Date.now();

    let lastShotTime = lastTime;
    let lastMonterCreateTime = lastTime;

    const tick: () => void = () => {
        const now = Date.now();
        const diff = now - lastTime;

        lastTime = now;

        const state = store.getState();

        (window as any).getState = () => store.getState();

        const {
            units,
            speed,
        } = state;

        let lastState = state;
        for (let key = 0; key < units.length; key++) {
            const unit = units[key];

            const controller: UnitController<any> = UnitControllers[unit.name];

            lastState = controller(key, diff * speed, unit, lastState);
        }

        //check if death
        let someMonsterDeath = false;
        let updateHealth = false;
        lastState = {
            ...lastState,
            units: lastState.units.filter((unit: any) => {
                const deathByHp = typeof unit.hp === 'number'
                    && unit.hp <= 0
                    && unit.name !== UnitName.Tower;
                if (deathByHp) {
                    someMonsterDeath = true;
                    const {
                        level,
                        xp,
                    } = addXp(lastState.player, unit.xp);

                    if (lastState.player.level !== level) {
                        console.log('NEXT_LEVEL');
                        updateHealth = true;
                    }

                    lastState.player.level = level;
                    lastState.player.xp = xp;
                    lastState.player.money += unit.money;
                    addBlood({ x: unit.x, y: unit.y });
                    return false;
                }

                return unit.death !== true;
            }),
        };

        if (someMonsterDeath && Math.random() > 0.8) {
            playSound(SoundName.ZombieShot);
        }

        const nextState = clone(lastState);

        // create bullet
        const { shotPosition } = nextState;
        if (shotPosition) {
            const shotDiff = now - lastShotTime;
            const weaponInterval = WeaponIntervals[nextState.weapon];
            const bulletsCount = Math.floor(shotDiff / weaponInterval);

            if (bulletsCount > 0) {
                lastShotTime = lastShotTime + weaponInterval * bulletsCount;

                const angle = getAngleRelativeToOrigin(shotPosition);
                const point = getPointRelativeToOriginByAngleAndDistance(4, angle);

                const weaponBullet: Unit<UnitName> = {
                    ...point,
                    width: 1,
                    height: 1,
                    destination: nextState.weapon === UnitName.Bazooka
                        ? shotPosition
                        : getPointRelativeToOriginByAngleAndDistance(75, angle),
                    rotation: angle,
                    name: nextState.weapon,
                    intersection: true,
                    death: false,
                    money: 0,
                };

                if (nextState.weapon === UnitName.Threegun) {
                    const weaponBullets = [
                        {
                            ...weaponBullet,
                            rotation: angle - 10,
                            destination: getPointRelativeToOriginByAngleAndDistance(75, angle - 10),
                        },
                        {
                            ...weaponBullet,
                        },
                        {
                            ...weaponBullet,
                            rotation: angle + 10,
                            destination: getPointRelativeToOriginByAngleAndDistance(75, angle + 10),
                        },
                    ];

                    nextState.units.push(...weaponBullets);
                } else {
                    nextState.units.push(weaponBullet);
                }

                playSound(SoundName.Pistol);
            }
        }

        // generate monster
        function createMonster(): Unit<UnitName> {
            const monsterName: UnitName = level < 3
                ? UnitName.Zombie
                : level < 5
                    ? Math.random() < 0.2
                        ? UnitName.Poo
                        : UnitName.Zombie
                    : level < 7
                        ? Math.random() < 0.7
                            ? UnitName.Zombie
                            : Math.random() < 0.3
                                ? UnitName.Bubble
                                : UnitName.Poo
                        : level < 10
                            ? Math.random() < 0.7
                                ? UnitName.Zombie
                                : Math.random() < 0.3
                                    ? UnitName.Bubble
                                    : UnitName.Poo
                            : level < 15
                                ? Math.random() < 0.7
                                    ? UnitName.Zombie
                                    : Math.random() < 0.3
                                        ? UnitName.Bubble
                                        : UnitName.Poo
                                : level < 30
                                    ? Math.random() < 0.7
                                        ? UnitName.Zombie
                                        : Math.random() < 0.3
                                            ? UnitName.Bubble
                                            : UnitName.Poo
                                    : level < 50
                                        ? Math.random() < 0.7
                                            ? UnitName.Zombie
                                            : Math.random() < 0.3
                                                ? UnitName.Bubble
                                                : UnitName.Poo
                                        : Math.random() < 0.7
                                            ? UnitName.Zombie
                                            : Math.random() < 0.3
                                                ? UnitName.Bubble
                                                : UnitName.Poo;

            const angle = Math.random() * 360;
            const point = getPointRelativeToOriginByAngleAndDistance(75, angle);

            return {
                name: monsterName,
                ...point,
                ...UnitSize[monsterName],
                ...CharacterParams[monsterName],
                intersection: true,
                rotation: 0,
                lastShootTime: now,
                money: UnitMoney[monsterName],
            };
        }

        const level = nextState.player.level;
        const monsterGenerateTime: number = level < 2
            ? 1500
            : level < 5
                ? 1000
                : level < 6
                    ? 700
                    : level < 7
                        ? 500
                        : level < 8
                            ? 400
                            : level < 9
                                ? 300
                                : level < 10
                                    ? 150
                                    : 100;
        const monstersCreateDiff = now - lastMonterCreateTime;
        const monstersCount = Math.floor(monstersCreateDiff / monsterGenerateTime);
        if (monstersCount > 0) {
            lastMonterCreateTime = lastMonterCreateTime + monsterGenerateTime * monstersCount;

            const monster = createMonster();
            nextState.units.push(monster);
        }

        const tower = getTower(nextState);
        if (updateHealth) {
            const nextLevelHp = getNextLevelHp(level);
            tower.hp = nextLevelHp;
            tower.maxHp = nextLevelHp;
        }
        store.dispatch(setStore(nextState));

        if (tower.hp === 0) {
            gameOVER()
        } else {
            requestAnimationFrame(tick);
        }
    };

    (window as any).startGame = tick;
}

function createMyaso(container: HTMLElement): void {
    const store: Store<MyasoStore> = createMyasoStore(defaultConstructorState);

    ReactDOM.render(
        <Provider store={ store }>
            <AppConnected/>
        </Provider>,
        container,
    );

    createAnimaionConstoller(store);
    // store.dispatch(setStore({
    //     "units": [{
    //         "name": "Tower",
    //         "x": -5.5,
    //         "y": -5.5,
    //         "width": 11,
    //         "height": 11,
    //         "hp": 100,
    //         "maxHp": 100,
    //         "intersection": false,
    //         "rotation": 0,
    //         "lastShootTime": 0,
    //         "xp": 0,
    //         "weaponRotation": 15.871178611457006,
    //         "money": 0,
    //         "weaponName": "Machinegun"
    //     }, {
    //         "name": "Bubble",
    //         "x": 11.120979324649094,
    //         "y": 6.722636674752874,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 67.59999999999992,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152334794,
    //         "intersection": true,
    //         "rotation": 211.1529794704675,
    //         "money": 50
    //     }, {
    //         "name": "Bubble",
    //         "x": -16.540456701490893,
    //         "y": -2.609275207047527,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 38.799999999999855,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152336294,
    //         "intersection": true,
    //         "rotation": 368.96459672784295,
    //         "money": 50
    //     }, {
    //         "name": "Bubble",
    //         "x": -1.834307091724943,
    //         "y": 19.66212281884222,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 57.9999999999999,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152337495,
    //         "intersection": true,
    //         "rotation": 275.3297773848356,
    //         "money": 50
    //     }, {
    //         "name": "Bubble",
    //         "x": -3.8937749420023553,
    //         "y": 20.12681089246399,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 66.39999999999992,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152337796,
    //         "intersection": true,
    //         "rotation": 280.9492967578552,
    //         "money": 50
    //     }, {
    //         "name": "Zombie",
    //         "x": 5.534574349793508,
    //         "y": -2.0296580417908565,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 3.8,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152357978,
    //         "intersection": true,
    //         "rotation": 519.8608301911589,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": 5.541216946155823,
    //         "y": 0.9377178443619167,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 1.3999999999999997,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152356805,
    //         "intersection": true,
    //         "rotation": 189.60493715325347,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": 5.534659292318406,
    //         "y": 0.33848414727285253,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 1.3999999999999997,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152357396,
    //         "intersection": true,
    //         "rotation": 183.49968938855537,
    //         "money": 10
    //     }, {
    //         "name": "Bubble",
    //         "x": -27.083809589491928,
    //         "y": 7.240751557687844,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 83.19999999999996,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152340810,
    //         "intersection": true,
    //         "rotation": 345.0322434226051,
    //         "money": 50
    //     }, {
    //         "name": "Poo",
    //         "x": -1.0855748103468155,
    //         "y": -12.533073339414287,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 6.4,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152359596,
    //         "intersection": true,
    //         "rotation": 445.0495779137495,
    //         "money": 25
    //     }, {
    //         "name": "Zombie",
    //         "x": -11.913137140183139,
    //         "y": 9.892542063554446,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 1.3999999999999997,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152347693,
    //         "intersection": true,
    //         "rotation": 320.2941211193282,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": 17.701671535805602,
    //         "y": 5.306715070403336,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 2.5999999999999996,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152348292,
    //         "intersection": true,
    //         "rotation": 196.6879999241945,
    //         "money": 10
    //     }, {
    //         "name": "Poo",
    //         "x": 16.90505549415179,
    //         "y": 10.687333565470775,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 4,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152348596,
    //         "intersection": true,
    //         "rotation": 212.30097128360603,
    //         "money": 25
    //     }, {
    //         "name": "Poo",
    //         "x": -0.370181664319502,
    //         "y": -21.501813656884174,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 6.4,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152348897,
    //         "intersection": true,
    //         "rotation": 449.0136761396079,
    //         "money": 25
    //     }, {
    //         "name": "Zombie",
    //         "x": 27.33931893676572,
    //         "y": 3.1483392564682386,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152350100,
    //         "intersection": true,
    //         "rotation": 186.56912660750757,
    //         "money": 10
    //     }, {
    //         "name": "Poo",
    //         "x": 14.390290972482724,
    //         "y": 28.542612892432786,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 5.2,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152350989,
    //         "intersection": true,
    //         "rotation": 243.24419018828877,
    //         "money": 25
    //     }, {
    //         "name": "Zombie",
    //         "x": -5.769787240868616,
    //         "y": -32.97908360150565,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 3.8,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152351292,
    //         "intersection": true,
    //         "rotation": 440.07637139567873,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": 27.271338203316002,
    //         "y": -22.02560186692636,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 0.19999999999999973,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152351607,
    //         "intersection": true,
    //         "rotation": 501.07404353057984,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": -30.193145633623356,
    //         "y": 20.500219065824712,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152351895,
    //         "intersection": true,
    //         "rotation": 325.8246991649515,
    //         "money": 10
    //     }, {
    //         "name": "Bubble",
    //         "x": -1.3308290999232855,
    //         "y": -56.476822238479386,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 95.19999999999999,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152352193,
    //         "intersection": true,
    //         "rotation": 448.65012266830195,
    //         "money": 50
    //     }, {
    //         "name": "Bubble",
    //         "x": -40.248744281097814,
    //         "y": 40.69255225216055,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 96.39999999999999,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152352490,
    //         "intersection": true,
    //         "rotation": 314.68584554581764,
    //         "money": 50
    //     }, {
    //         "name": "Bubble",
    //         "x": -31.32287641020366,
    //         "y": -48.805813891800774,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 92.79999999999998,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152352793,
    //         "intersection": true,
    //         "rotation": 417.30823023715044,
    //         "money": 50
    //     }, {
    //         "name": "Zombie",
    //         "x": 40.2354508655909,
    //         "y": -13.888402307055483,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152353109,
    //         "intersection": true,
    //         "rotation": 520.95643974414,
    //         "money": 10
    //     }, {
    //         "name": "Bubble",
    //         "x": -28.325018296594518,
    //         "y": 52.33673125537731,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 95.19999999999999,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152353400,
    //         "intersection": true,
    //         "rotation": 298.42257316318893,
    //         "money": 50
    //     }, {
    //         "name": "Zombie",
    //         "x": -39.60713775173157,
    //         "y": 22.435352440185852,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 1.3999999999999997,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152353700,
    //         "intersection": true,
    //         "rotation": 330.47073659531634,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": -17.58151288638897,
    //         "y": -43.66320309626559,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 2.5999999999999996,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152354010,
    //         "intersection": true,
    //         "rotation": 428.06722716369023,
    //         "money": 10
    //     }, {
    //         "name": "Bubble",
    //         "x": -40.93845517356498,
    //         "y": 46.27223999605002,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 97.6,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152354309,
    //         "intersection": true,
    //         "rotation": 311.5001635017689,
    //         "money": 50
    //     }, {
    //         "name": "Zombie",
    //         "x": 40.22745433420526,
    //         "y": -29.81202471804666,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152354610,
    //         "intersection": true,
    //         "rotation": 503.4583537259248,
    //         "money": 10
    //     }, {
    //         "name": "Bubble",
    //         "x": 32.02872925686865,
    //         "y": -54.54392045352264,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 95.19999999999999,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152354897,
    //         "intersection": true,
    //         "rotation": 480.42187698740884,
    //         "money": 50
    //     }, {
    //         "name": "Zombie",
    //         "x": 6.765559633804008,
    //         "y": 52.63194303691862,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152355209,
    //         "intersection": true,
    //         "rotation": 262.67509740616816,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": -45.9469696646926,
    //         "y": 29.28295073300854,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152355493,
    //         "intersection": true,
    //         "rotation": 327.4897981745376,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": -18.846987674191038,
    //         "y": -52.86062292112042,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152355820,
    //         "intersection": true,
    //         "rotation": 430.37675675535496,
    //         "money": 10
    //     }, {
    //         "name": "Poo",
    //         "x": -28.633766782770273,
    //         "y": -49.94985510319248,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 10,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152356111,
    //         "intersection": true,
    //         "rotation": 420.17649826023705,
    //         "money": 25
    //     }, {
    //         "name": "Poo",
    //         "x": 20.1743426489108,
    //         "y": 55.43298655750324,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 10,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152356394,
    //         "intersection": true,
    //         "rotation": 250.0014735194144,
    //         "money": 25
    //     }, {
    //         "name": "Zombie",
    //         "x": -0.7988131149920404,
    //         "y": -60.484725324723975,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152356694,
    //         "intersection": true,
    //         "rotation": 449.24334682620145,
    //         "money": 10
    //     }, {
    //         "name": "Zombie",
    //         "x": -31.803105285434402,
    //         "y": -53.30917481263031,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152357011,
    //         "intersection": true,
    //         "rotation": 419.18060809596614,
    //         "money": 10
    //     }, {
    //         "name": "Poo",
    //         "x": -45.8582358368351,
    //         "y": -43.90179302640415,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 8.8,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152357293,
    //         "intersection": true,
    //         "rotation": 403.7513576945158,
    //         "money": 25
    //     }, {
    //         "name": "Zombie",
    //         "x": 42.665325371184004,
    //         "y": -51.00250029136812,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152357895,
    //         "intersection": true,
    //         "rotation": 489.9136277658541,
    //         "money": 10
    //     }, {
    //         "name": "Bubble",
    //         "x": -67.81658935237843,
    //         "y": -22.62935626262646,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 100,
    //         "maxHp": 100,
    //         "xp": 10,
    //         "lastShootTime": 1523152358193,
    //         "intersection": true,
    //         "rotation": 378.453064028614,
    //         "money": 50
    //     }, {
    //         "name": "Poo",
    //         "x": 64.95923271000837,
    //         "y": 24.72333130318358,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 10,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152358497,
    //         "intersection": true,
    //         "rotation": 200.8367071388274,
    //         "money": 25
    //     }, {
    //         "name": "Zombie",
    //         "x": -27.942403070799806,
    //         "y": -65.25949900687988,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152358794,
    //         "intersection": true,
    //         "rotation": 426.82066290665495,
    //         "money": 10
    //     }, {
    //         "x": 58.1771793777412,
    //         "y": 27.85077736168462,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 67.64788299737349, "y": 32.38462483916816 },
    //         "rotation": 25.581529257938893,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }, {
    //         "x": 49.70630582582824,
    //         "y": -21.101733605304407,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 69.03653586920589, "y": -29.307963340700567 },
    //         "rotation": 336.99740340664215,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }, {
    //         "name": "Poo",
    //         "x": -4.914456887731124,
    //         "y": 72.33324348802995,
    //         "width": 7,
    //         "height": 7,
    //         "hp": 10,
    //         "maxHp": 10,
    //         "xp": 3,
    //         "lastShootTime": 1523152359096,
    //         "intersection": true,
    //         "rotation": 273.8868099545295,
    //         "money": 25
    //     }, {
    //         "x": 36.66140685589715,
    //         "y": -24.329842731640863,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 62.491034413461044, "y": -41.4713228380242 },
    //         "rotation": 326.43030158162753,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }, {
    //         "x": 26.97553307746201,
    //         "y": -19.863801629767476,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 60.392984501780624, "y": -44.4711976785839 },
    //         "rotation": 323.63341982736375,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }, {
    //         "x": 17.360544531988662,
    //         "y": -16.859759593565933,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 53.803340491700396, "y": -52.25132105443987 },
    //         "rotation": 315.8384149744021,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }, {
    //         "name": "Zombie",
    //         "x": -41.98757010207413,
    //         "y": 60.92260710871959,
    //         "width": 4,
    //         "height": 4,
    //         "hp": 5,
    //         "maxHp": 5,
    //         "xp": 1,
    //         "lastShootTime": 1523152359394,
    //         "intersection": true,
    //         "rotation": 304.574426054985,
    //         "money": 10
    //     }, {
    //         "x": 11.003581630180598,
    //         "y": -9.132972753049913,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 57.71109246598215, "y": -47.90020674676528 },
    //         "rotation": 320.30732684933116,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }, {
    //         "x": 3.8475159882292704,
    //         "y": 1.0939016044965573,
    //         "width": 1,
    //         "height": 1,
    //         "destination": { "x": 72.14092477929881, "y": 20.51065508431045 },
    //         "rotation": 15.871178611457006,
    //         "name": "Machinegun",
    //         "intersection": true,
    //         "death": false,
    //         "money": 0
    //     }],
    //     "speed": 1,
    //     "hoverPosition": { "x": 48.35443037974684, "y": -10.569620253164556 },
    //     "player": { "level": 8, "xp": 367, "money": 9660 },
    //     "weapons": { "Piston": true, "Bazooka": true, "Machinegun": true },
    //     "weapon": "Machinegun",
    //     "showShopMenu": true
    // } as any));
}

(window as any).createMyaso = createMyaso;
