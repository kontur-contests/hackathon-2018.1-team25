import * as React from 'react';
import {MyasoStore, Player} from '../../../Store/MyasoStore'
import {connect, MapStateToPropsFactory} from "react-redux";
import * as styles from './style.pcss'
import * as cn from 'classnames';

type MenuItemProps = MenuConnectedProps & {
    player: Player;
}

class MenuItem extends React.Component<MenuItemProps> {
    render() {
        const enabled = this.props.enabled(this.props.player);
        return (
          <div className={cn(styles.MenuItem, this.props.isLast ? null : styles.MenuItem__padding)} onClick={this.handleClick}>
              <div className={cn(styles.MenuItem__element, this.props.chosen ? styles.MenuItem__element__chosen : null)} style={{backgroundImage: `url(${this.props.imageUrl})`}}>
                  {!this.props.bought && !enabled && <div className={styles.MenuItem__element__overlay} onClick={e => e.stopPropagation()}/>}
              </div>
          </div>
        );
    }

    handleClick = () => {
        this.props.action();
    }
}

type MenuConnectedProps = {
    imageUrl: string;
    chosen: boolean;
    bought: boolean;
    isLast?: boolean | undefined;
    enabled: (player: Player) => boolean;
    action: () => void;
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