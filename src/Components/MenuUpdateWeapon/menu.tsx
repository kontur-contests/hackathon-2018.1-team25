import * as React from 'react';
import {connect, MapDispatchToPropsFunction, MapStateToPropsFactory} from 'react-redux';
import {HealData, MyasoStore} from '../../Store/MyasoStore';
import {MenuItemConnected} from './MenuItem/view';
import {heal} from '../../Store/actions';
import * as c from './style.pcss';
import * as cx from 'classnames';


type StateToProps = {
    showShopMenu: boolean;
}

type DispatchToProps = {
    heal: (healData: HealData) => void;
}

type MenuProps =
    StateToProps
    & DispatchToProps;

class Menu extends React.Component<MenuProps> {
    public render() {
        const menuShownClass = this.props.showShopMenu ? c.Menu__field__opened : c.Menu__field__closed;
        return (
            <div className={cx('pointer', c.Menu__field, menuShownClass)}>
                <MenuItemConnected imageUrl="red" enabled={player => player.money >= 150} action={() => {
                    console.log('buy medkit');
                    this.props.heal({
                        cost: 150,
                        hpToHeal: 30,
                    });
                }}/>
                <MenuItemConnected imageUrl="green" enabled={player => player.money > 1000} action={() => console.log('buy weapon')}/>
            </div>
        );
    }
}

const mapStateToPropsFactory: MapStateToPropsFactory<StateToProps, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({showShopMenu}, ownProps): StateToProps => {
        return {
            showShopMenu,
        };
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchToProps, {}> =
    (dispatch, ownProps): DispatchToProps => {
        return {
            heal: (healData: HealData): void => {dispatch(heal(healData))},
        };
    };

export const MenuConnected = connect(mapStateToPropsFactory, mapDispatchToProps)(Menu);