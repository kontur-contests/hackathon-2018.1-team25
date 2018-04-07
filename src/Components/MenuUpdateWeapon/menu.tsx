import * as React from 'react';
import {connect, MapDispatchToPropsFunction, MapStateToPropsFactory} from 'react-redux';
import {HealData, MyasoStore, UnitName, WeaponBulletName, WeaponRevealData, WeaponsData} from '../../Store/MyasoStore';
import {MenuItemConnected} from './MenuItem/view';
import {chooseWeapon, heal, revealWeapon} from '../../Store/actions';
import * as c from './style.pcss';
import * as cx from 'classnames';


type StateToProps = {
    showShopMenu: boolean;
    currentWeapon: UnitName;
    weapons: WeaponsData;
}

type DispatchToProps = {
    heal: (healData: HealData) => void;
    revealWeapon: (weaponRevealData: WeaponRevealData) => void;
    chooseWeapon: (weaponName: WeaponBulletName) => void;
}

type MenuProps =
    StateToProps
    & DispatchToProps;

class Menu extends React.Component<MenuProps> {
    public render() {
        const menuShownClass = this.props.showShopMenu ? c.Menu__field__opened : c.Menu__field__closed;
        return (
            <div className={cx('pointer', c.Menu__field, menuShownClass)}>
                <MenuItemConnected
                    imageUrl="./images/first-aid-kit.png"
                    bought={false}
                    choosen={false}
                    enabled={player => player.money >= 150}
                    action={() => {
                    console.log('buy medkit');
                    this.props.heal({
                        cost: 150,
                        hpToHeal: 30,
                    });
                }}/>
                <MenuItemConnected
                    imageUrl="./images/weapons/Piston.png"
                    bought={this.props.weapons[UnitName.Piston]}
                    choosen={this.props.currentWeapon === UnitName.Piston}
                    enabled={player => true}
                    action={this.weaponClick(UnitName.Piston, 0)}
                />
                <MenuItemConnected
                    imageUrl="./images/weapons/Bazooka.png"
                    bought={this.props.weapons[UnitName.Bazooka]}
                    choosen={this.props.currentWeapon === UnitName.Bazooka}
                    enabled={player => player.money >= 200}
                    action={this.weaponClick(UnitName.Bazooka, 200)}
                />
            </div>
        );
    }

    weaponClick = (weaponName: WeaponBulletName, cost: number) => {
        return () => {
            if (this.props.currentWeapon === weaponName)
                return;
            if (!this.props.weapons[weaponName]) {
                console.log('buy weapon');
                this.props.revealWeapon({
                    cost,
                    weaponName,
                });
            } else {
                console.log('choose weapon');
                this.props.chooseWeapon(weaponName);
            }
        };
    }
}

const mapStateToPropsFactory: MapStateToPropsFactory<StateToProps, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({showShopMenu, weapon, weapons}, ownProps): StateToProps => {
        return {
            showShopMenu,
            currentWeapon: weapon,
            weapons,
        };
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchToProps, {}> =
    (dispatch, ownProps): DispatchToProps => {
        return {
            heal: healData => {dispatch(heal(healData))},
            revealWeapon: weaponRevealData => {dispatch(revealWeapon(weaponRevealData))},
            chooseWeapon: weaponName => {dispatch(chooseWeapon(weaponName))},
        };
    };

export const MenuConnected = connect(mapStateToPropsFactory, mapDispatchToProps)(Menu);