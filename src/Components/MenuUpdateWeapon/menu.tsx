import * as React from 'react';
import {connect, MapStateToPropsFactory} from 'react-redux';
import {MyasoStore} from '../../Store/MyasoStore';
import * as c from './style.pcss';
import * as cx from 'classnames'


type StateToProps = {
    showShopMenu: boolean;
}

class Menu extends React.Component<StateToProps> {
    public render() {
        const menuShownClass = this.props.showShopMenu ? c.Menu__field__opened : c.Menu__field__closed;
        return (
            <div className={cx('pointer', c.Menu__field, menuShownClass)}>

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

export const MenuConnected = connect(mapStateToPropsFactory)(Menu);