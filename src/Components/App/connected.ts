import { connect, MapDispatchToPropsFunction, MapStateToPropsFactory } from 'react-redux';
import { setShotPositoin } from '../../Store/actions';
import { MyasoStore } from '../../Store/MyasoStore';
import { App, AppDispatchProps, } from './view';

const mapStateToPropsFactory: MapStateToPropsFactory<{}, {}, MyasoStore> = (initialStore, initialOwnProps) => {
    return ({
                units,
            }, ownProps): {} => {
        return {
            //
        };
    };
};

const mapDispatchToProps: MapDispatchToPropsFunction<AppDispatchProps, {}> =
    (dispatch, ownProps): AppDispatchProps => {
        return {
            setShotPosition: (shotPosition) => {
                dispatch(setShotPositoin(shotPosition));
            },
        };
    };

export const AppConnected = connect(mapStateToPropsFactory, mapDispatchToProps)(App);
