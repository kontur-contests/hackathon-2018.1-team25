import * as React from 'react';
import { Size } from '../../Store/MyasoStore';
import { ResizeSensor } from '../../utils/ResizeSensor/index';
import { UnitsConnected } from '../Units/connected';
import * as c from './style.pcss';
import {Menu} from "../MenuUpdateWeapon/menu";

type AppState = {
    size: Size;
}

export class App extends React.Component<{}, AppState> {
    public state = {
        size: {
            width: 0,
            height: 0,
        }
    }

    private resizeSensor?: ResizeSensor;
    private container?: HTMLElement;

    public render() {
        const {
            size: {
                width,
                height,
            },
        } = this.state;

        const squareSize = Math.min(width, height);
        const left = width > height
            ? (width - squareSize) / 2
            : 0;
        const top = width > height
            ? 0
            : (height - squareSize) / 2;

        return <div
            className={ c.App }
            ref={ (element) => {
                this.container = element!;
            } }
        >
            <div
                className={ c.App__square }
                style={{
                    width: `${squareSize}px`,
                    height: `${squareSize}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                }}
            >
                <UnitsConnected/>
                <Menu/>
            </div>
        </div>;
    }

    public componentDidMount() {
        this.resizeSensor = new ResizeSensor(this.container!, (size) => {
            this.setState({ size });
        });

        this.setState({
            size: this.resizeSensor.getSize(),
        });
    }
}
