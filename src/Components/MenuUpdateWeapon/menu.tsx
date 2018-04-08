import * as React from 'react';
import {connect, MapDispatchToPropsFunction, MapStateToPropsFactory} from 'react-redux';
import {HealData, MyasoStore, UnitName, WeaponBulletName, WeaponRevealData, WeaponsData} from '../../Store/MyasoStore';
import {MenuItemConnected} from './MenuItem/view';
import { chooseWeapon, heal, revealWeapon, toggleMenu } from '../../Store/actions';
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
    toggleMenu: (setVisible: boolean) => void;
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
                    chosen={false}
                    cost={150}
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
                    chosen={this.props.currentWeapon === UnitName.Piston}
                    cost={0}
                    enabled={player => true}
                    action={this.weaponClick(UnitName.Piston, 0)}
                />
                <MenuItemConnected
                    imageUrl="./images/weapons/Bazooka.png"
                    bought={this.props.weapons[UnitName.Bazooka]}
                    chosen={this.props.currentWeapon === UnitName.Bazooka}
                    cost={200}
                    enabled={player => player.money >= 200}
                    action={this.weaponClick(UnitName.Bazooka, 200)}
                />
                <MenuItemConnected
                    imageUrl="./images/weapons/Machinegun.png"
                    bought={this.props.weapons[UnitName.Machinegun]}
                    chosen={this.props.currentWeapon === UnitName.Machinegun}
                    cost={1000}
                    enabled={player => player.money >= 1000}
                    action={this.weaponClick(UnitName.Machinegun, 1000)}
                />
                <MenuItemConnected
                    imageUrl="./images/weapons/Threegun.png"
                    bought={this.props.weapons[UnitName.Threegun]}
                    chosen={this.props.currentWeapon === UnitName.Threegun}
                    enabled={player => player.money >= 10000}
                    action={this.weaponClick(UnitName.Threegun, 10000)}
                    isLast={true}
                />
            </div>
        );
    }

    weaponClick = (weaponName: WeaponBulletName, cost: number) => {
        return () => {
            this.props.toggleMenu(false);

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
            toggleMenu: (visibility) => {dispatch(toggleMenu(visibility))},
        };
    };

export const MenuConnected = connect(mapStateToPropsFactory, mapDispatchToProps)(Menu);