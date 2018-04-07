import { createReducer } from 'redux-act';
import { setStore, } from './actions';
import { MyasoStore } from './MyasoStore';

export const createConstructorReducer = (appState: MyasoStore) => createReducer<MyasoStore>({}, appState)
    .on(setStore, (state, store): MyasoStore => {
        return store;
    });
