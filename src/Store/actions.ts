import { createAction } from 'redux-act';
import { MyasoStore } from './MyasoStore';

export const setStore = createAction<MyasoStore>('setStore');
