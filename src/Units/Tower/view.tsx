import * as React from 'react';
import {MyasoStore, UnitName} from '../../Store/MyasoStore';
import { UnitClass } from '../UnitClass';
import {connect, MapDispatchToPropsFunction, MapStateToPropsFactory} from 'react-redux';
import {toggleMenu} from '../../Store/actions';
import * as c from './index.pcss';

export class Tower extends UnitClass<UnitName.Tower> {
    public render() {
        return (
            <div className={c.Tower}>
                <TowerConnected/>
            </div>
        );
    }
}

type StateToPropsProps = {
    showShopMenu: boolean;
}

type MapDispatchToPropsProps = {
    toggleShopMenu: (show: boolean) => void;
}

type TowerClickContainerProps =
    & StateToPropsProps
    & MapDispatchToPropsProps;

class TowerClickContainer extends React.Component<TowerClickContainerProps> {
    public render() {
        return (
            <div style={{
                width: '100%',
                height: '100%',
            }}
                 onClick={() => {
                     this.props.toggleShopMenu(!this.props.showShopMenu)
                 }}
            >
            </div>
        );
    }
}

const mapStateToPropsFactory: MapStateToPropsFactory<StateToPropsProps, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({showShopMenu}, ownProps): StateToPropsProps => {
        return {
            showShopMenu,
        };
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<MapDispatchToPropsProps, {}> =
    (dispatch, ownProps): MapDispatchToPropsProps => {
        return {
            toggleShopMenu: (show: boolean): void => {dispatch(toggleMenu(show))},
        };
    };

const TowerConnected = connect(mapStateToPropsFactory, mapDispatchToProps)(TowerClickContainer);