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
import { addXp } from './utils/playerInteractions';
import { playSound, SoundName } from './utils/startStopAudio';
// import {runAudio} from './utils/runAudio';
// runAudio();

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
                    rotation: getAngleRelativeToOrigin(shotPosition),
                    name: nextState.weapon,
                    intersection: true,
                    death: false,
                    money: 0,
                };

                nextState.units.push(weaponBullet);

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
                        ? Math.random() < 0.6
                            ? UnitName.Poo
                            : UnitName.Zombie
                        : level < 10
                            ? Math.random() < 0.8
                                ? UnitName.Poo
                                : UnitName.Zombie
                            : level < 15
                                ? UnitName.Poo
                                : level < 30
                                    ? UnitName.Poo
                                    : level < 50
                                        ? UnitName.Poo
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
            : level < 6
                ? 1200
                : level < 7
                    ? 1000
                    : level < 12
                        ? 800
                        : level < 20
                            ? 500
                            : level < 30
                                ? 300
                                : level < 50
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
        store.dispatch(setStore(nextState));

        if (tower.hp === 0) {
            alert('game over!!!');
        } else {
            requestAnimationFrame(tick);
        }
    };

    tick();
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
}

(window as any).createMyaso = createMyaso;
