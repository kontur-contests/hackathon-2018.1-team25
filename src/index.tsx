import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import * as clone from 'clone';
import { App } from './Components/App/view';
import { setStore } from './Store/actions';
import { createMyasoStore } from './Store/createMyasoStore';
import { defaultConstructorState, MyasoStore } from './Store/MyasoStore';
import { UnitControllers } from './UnitControllers';

function createAnimaionConstoller(store: Store<MyasoStore>) {
    let lastTime = Date.now();

    const tick: () => void = () => {
        const now = Date.now();
        const diff = now - lastTime;

        lastTime = now;

        const state = store.getState();

        const { units } = state;

        let lastState = state;
        for (let key = 0; key < units.length; key++) {
            const unit = units[key];

            lastState = UnitControllers[unit.name](key, diff, unit, lastState);
        }

        store.dispatch(setStore(clone(lastState)));

        requestAnimationFrame(tick);
    };

    tick();
}

function createMyaso(container: HTMLElement): void {
    const store: Store<MyasoStore> = createMyasoStore(defaultConstructorState);

    ReactDOM.render(
        <Provider store={ store }>
            <App/>
        </Provider>,
        container,
    );

    createAnimaionConstoller(store);
}

(window as any).createMyaso = createMyaso;
