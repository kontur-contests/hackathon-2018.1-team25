import { connect, MapDispatchToPropsFunction, MapStateToPropsFactory } from 'react-redux';
import { MyasoStore } from '../../Store/MyasoStore';
import { Units, UnitsProps } from './view';

const mapStateToPropsFactory: MapStateToPropsFactory<UnitsProps, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({
                units,
            }, ownProps): UnitsProps => {
        return {
            units,
        };
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<{}, {}> =
    (dispatch, ownProps): {} => {
        return {};
    };

export const UnitsConnected = connect(mapStateToPropsFactory, mapDispatchToProps)(Units);
