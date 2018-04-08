import * as React from 'react';
import {MyasoStore, Player} from '../../Store/MyasoStore';
import {connect, MapDispatchToPropsFunction, MapStateToPropsFactory} from 'react-redux';
import ProgressBar from "../Common/ProgressBar/view";
import {getNextLevelXp} from '../../utils/playerInteractions';
import * as styles from './style.pcss';
import {toggleMenu} from "../../Store/actions";

type StateToProps = {
    player: Player;
    showShopMenu: boolean;
}

type DispatchToProps = {
    toggleShopMenu: (show: boolean) => void;
}

export type HudProps =
    StateToProps
    & DispatchToProps;

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
                    <div className={styles.Hud__money__label}>Money: {player.money}</div><br/>
                    <div className={styles.Hud__money__button} onClick={() => this.props.toggleShopMenu(!this.props.showShopMenu)}>{this.props.showShopMenu ? "-" : "+"} buy</div>
                </div>
            </div>
        );
    }
}

const mapStateToPropsFactory: MapStateToPropsFactory<StateToProps, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({player, showShopMenu}, ownProps): StateToProps => {
        return {
            player,
            showShopMenu,
        };
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchToProps, {}> =
    (dispatch, ownProps): DispatchToProps => {
        return {
            toggleShopMenu: show => {dispatch(toggleMenu(show))},
        };
    };

export default connect(mapStateToPropsFactory, mapDispatchToProps)(Hud);