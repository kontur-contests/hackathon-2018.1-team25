import * as clone from 'clone';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { AppConnected } from './Components/App/connected';
import { setStore } from './Store/actions';
import { createMyasoStore } from './Store/createMyasoStore';
import { getTower } from './Store/getters/getTower';
import { defaultConstructorState, MyasoStore, Unit, UnitName, WeaponIntervals } from './Store/MyasoStore';
import { UnitControllers } from './UnitControllers';
import { UnitController } from './Units/UnitController';
import { getAngleRelativeToOrigin } from './utils/getAngleRelativeToOrigin';
import { addXp } from './utils/playerInteractions';
import {runAudio} from "./utils/runAudio";

runAudio();

function createAnimaionConstoller(store: Store<MyasoStore>) {
    let lastTime = Date.now();

    let lastShotTime = lastTime;

    const tick: () => void = () => {
        const now = Date.now();
        const diff = now - lastTime;

        lastTime = now;

        const state = store.getState();

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
        lastState = {
            ...lastState,
            units: lastState.units.filter((unit: any) => {
                const deathByHp = typeof unit.hp === 'number'
                    && unit.hp <= 0
                    && unit.name !== UnitName.Tower;
                if (deathByHp) {
                    const {
                        level,
                        xp,
                    } = addXp(lastState.player, unit.xp);

                    if (lastState.player.level !== level) {
                        console.log('NEXT_LEVEL');
                    }

                    lastState.player.level = level;
                    lastState.player.xp = xp;

                    return false;
                }

                return unit.death !== true;
            }),
        };

        const nextState = clone(lastState);

        const { shotPosition } = nextState;
        if (shotPosition) {
            const shotDiff = now - lastShotTime;
            const weaponInterval = WeaponIntervals[nextState.weapon];
            const bulletsCount = Math.floor(shotDiff / weaponInterval);

            console.log(bulletsCount);

            if (bulletsCount > 0) {
                lastShotTime = lastShotTime + weaponInterval * bulletsCount;

                const weaponBullet: Unit<UnitName> = {
                    x: -0.5,
                    y: -0.5,
                    width: 1,
                    height: 1,
                    destination: shotPosition,
                    rotation: getAngleRelativeToOrigin(shotPosition),
                    name: nextState.weapon,
                    intersection: true,
                    death: false,
                };

                nextState.units.push(weaponBullet);
            }
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
