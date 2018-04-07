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

        // check if monters are death

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
                    x: -0.25,
                    y: -0.25,
                    width: 0.5,
                    height: 0.5,
                    destination: shotPosition,
                    rotation: getAngleRelativeToOrigin(shotPosition) + 180,
                    name: nextState.weapon,
                    intersection: false,
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
