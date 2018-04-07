import * as React from 'react';
import {MyasoStore, Player} from '../../Store/MyasoStore';
import { connect, MapStateToPropsFactory } from 'react-redux';
import * as styles from './style.pcss';

export type HudProps = {
    player: Player,
}

class Hud extends React.Component<HudProps, {}> {
    public render() {
        const {player} = this.props;

        return (
            <div className={styles.Hud}>
                <div className={styles.Hud__xp}>
                    <div className={styles.Hud__xp__level}>Level: {player.level}</div>
                    <div className={styles.Hud__xp__progress}>Xp: {player.xp}</div>
                </div>
                <div className={styles.Hud__money}>
                    <div>Money: {player.money}</div>
                </div>
            </div>
        );
    }
}

const mapStateToPropsFactory: MapStateToPropsFactory<HudProps, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({player}, ownProps): HudProps => {
        return {
            player,
        };
    };
};

export default connect(mapStateToPropsFactory)(Hud);