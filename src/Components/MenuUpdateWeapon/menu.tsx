import * as React from 'react';
import * as c from './style.pcss';
import * as cx from 'classnames'

export class Menu extends React.Component<{}> {

    public render() {

        return <div className={cx('pointer', c.Menu__field)}>
        </div>;
    }
}
