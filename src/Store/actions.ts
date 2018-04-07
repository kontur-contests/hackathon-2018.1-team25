import { createAction } from 'redux-act';
import { MyasoStore, PointCoordinates } from './MyasoStore';

export const setStore = createAction<MyasoStore>('setStore');
export const setShotPositoin = createAction<PointCoordinates | undefined>('setShotPositoin');
export const setHoverPositoin = createAction<PointCoordinates>('setHoverPositoin');
