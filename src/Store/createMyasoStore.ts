import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { MyasoStore } from './MyasoStore';
import { createConstructorReducer } from './reducers';

export function createMyasoStore(initialState: MyasoStore) {
    const sagaMiddleware = createSagaMiddleware();
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(sagaMiddleware)
    );

    const playerReducer = createConstructorReducer(initialState);

    return createStore(playerReducer, enhancer);
}
