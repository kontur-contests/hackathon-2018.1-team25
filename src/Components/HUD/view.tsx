import * as React from 'react';
import {MyasoStore, Player} from '../../Store/MyasoStore';
import {connect, MapStateToPropsFactory} from 'react-redux';
import ProgressBar from "../Common/ProgressBar/view";
import {getNextLevelXp} from '../../utils/playerInteractions';
import * as styles from './style.pcss';

export type HudProps = {
    player: Player,
}

class Hud extends React.Component<HudProps, {}> {
    public render() {
        const {player} = this.props;
        const nextLevelXp = getNextLevelXp(player.level + 1);

        return (
            <div className={styles.Hud}>
                <div className={styles.Hud__xp}>
                    <div className={styles.Hud__xp__label}>Level: {player.level}</div>
                    <div className={styles.Hud__xp__progress}>
                        <div className={styles.Hud__xp__label}>XP: </div>
                        <div className={styles.Hud__xp__progress__bar}>
                            <ProgressBar now={player.xp} max={nextLevelXp} frontColor="#cac545" backColor="#dbdcaa"/>
                        </div>
                    </div>
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