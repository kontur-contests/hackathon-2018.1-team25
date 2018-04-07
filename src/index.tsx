import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { App } from './Components/App/view';
import { MyasoStore, defaultConstructorState } from './Store/MyasoStore';
import { createMyasoStore } from './Store/createMyasoStore';

function createMyaso(container: HTMLElement): void {
    const store: Store<MyasoStore> = createMyasoStore(defaultConstructorState);

    ReactDOM.render(
        <Provider store={ store }>
            <App/>
        </Provider>,
        container,
    );
}

(window as any).createMyaso = createMyaso;
