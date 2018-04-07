import * as React from 'react';
import {MyasoStore, Player} from '../../../Store/MyasoStore'
import {connect, MapStateToPropsFactory} from "react-redux";
import * as styles from './style.pcss'

type MenuItemProps = MenuConnectedProps & {
    player: Player;
}

class MenuItem extends React.Component<MenuItemProps> {
    render() {
        debugger;
        const enabled = this.props.enabled(this.props.player);
        return (
          <div className={styles.MenuItem}>
              <div className={styles.MenuItem__element} style={{backgroundColor: this.props.imageUrl}}>
                  {!enabled && <div className={styles.MenuItem__element__overlay} onClick={e => e.stopPropagation()}/>}
              </div>
          </div>
        );
    }
}

type MenuConnectedProps = {
    imageUrl: string;
    enabled: (player: Player) => boolean;
}

const mapStateToPropsFactory: MapStateToPropsFactory<MenuItemProps, MenuConnectedProps, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({player}, ownProps): MenuItemProps => {
        return {
            player,
            ...ownProps
        };
    };
};

export const MenuItemConnected = connect(mapStateToPropsFactory)(MenuItem);