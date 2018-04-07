import { createAction } from 'redux-act';
import {MyasoStore, PointCoordinates, HealData, WeaponRevealData} from './MyasoStore';

export const setStore = createAction<MyasoStore>('setStore');
export const setShotPositoin = createAction<PointCoordinates | undefined>('setShotPositoin');
export const setHoverPositoin = createAction<PointCoordinates>('setHoverPositoin');
export const toggleMenu = createAction<boolean>('toggleMenu');
export const heal = createAction<HealData>('heal');
export const revealWeapon = createAction<WeaponRevealData>('revealWeapon');
