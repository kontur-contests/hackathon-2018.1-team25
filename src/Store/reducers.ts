import { createReducer } from 'redux-act';
import { setShotPositoin, setStore, toggleMenu } from './actions';
import { MyasoStore } from './MyasoStore';

export const createConstructorReducer = (appState: MyasoStore) => createReducer<MyasoStore>({}, appState)
    .on(setStore, (state, store): MyasoStore => {
        return store;
    })
    .on(setShotPositoin, (state, shotPosition): MyasoStore => {
        return {
            ...state,
            shotPosition,
        };
    })
    .on(toggleMenu, (state, show): MyasoStore => {
        return {
            ...state,
            showShopMenu: show,
        };
    });
