import { createReducer } from 'redux-act';
import {setHoverPositoin, setShotPositoin, setStore, toggleMenu, heal, revealWeapon, chooseWeapon} from './actions';
import {MyasoStore} from './MyasoStore';
import {getTower} from './getters/getTower';

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
    .on(setHoverPositoin, (state, hoverPosition): MyasoStore => {
        return {
            ...state,
            hoverPosition,
        };
    })
    .on(toggleMenu, (state, show): MyasoStore => {
        return {
            ...state,
            showShopMenu: show,
        };
    })
    .on(heal, (state, healData): MyasoStore => {
        const tower = getTower(state);
        tower.hp += healData.hpToHeal;
        tower.hp = tower.hp > tower.maxHp ? tower.maxHp : tower.hp;

        return {
            ...state,
            player: {
                ...state.player,
                money: state.player.money - healData.cost,
            },
        };
    })
    .on(revealWeapon, (state, weaponRevealData): MyasoStore => {
        return {
            ...state,
            weapons: {
                ...state.weapons,
                [weaponRevealData.weaponName]: true,
            },
            player: {
                ...state.player,
                money: state.player.money - weaponRevealData.cost,
            },
            weapon: weaponRevealData.weaponName,
        };
    })
    .on(chooseWeapon, (state, weaponName): MyasoStore => {
        return {
            ...state,
            weapon: weaponName,
        };
    });
