import * as React from 'react';
import {PointCoordinates, Size} from '../../Store/MyasoStore';
import {DragListener} from '../../Store/utils/DragListener';
import {addElementEventListener} from '../../utils/addElementEventListener';
import {ResizeSensor} from '../../utils/ResizeSensor';
import HUD from '../HUD/view'
import {MenuConnected} from "../MenuUpdateWeapon/menu";
import {UnitsConnected} from '../Units/connected';
import * as c from './style.pcss';

type AppState = {
    size: Size;
}

export type AppDispatchProps = {
    setShotPosition: (shotPosition: PointCoordinates | undefined) => void;
    setHoverPosition: (hoverPosition: PointCoordinates) => void;
}

export class App extends React.Component<AppDispatchProps, AppState> {
    public state = {
        size: {
            width: 0,
            height: 0,
        }
    };

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
            className={c.App}
            ref={(element) => {
                this.container = element!;
            }}
        >
            <HUD/>
            <div
                className={c.App__square}
                style={{
                    width: `${squareSize}px`,
                    height: `${squareSize}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                }}
            >
                <div
                    className={c.App__background}
                    ref={(element) => {
                        this.container = element!;
                    }}
                >
                    <canvas

                        ref={(element) => {
                            (window as any).canvas = element!;
                        }}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        id={'canvas'}
                    />


                </div>
                <UnitsConnected/>
                <MenuConnected/>
            </div>
            <div
                className={c.App__animations}
                ref={(element) => {
                    (window as any).animationContainer = element;
                }}
            />
        </div>;
    }

    public componentDidMount() {
        this.resizeSensor = new ResizeSensor(this.container!, (size) => {
            this.setState({size});
        });

        const size = this.resizeSensor.getSize();

        (window as any).canvas.width = 3000;
        (window as any).canvas.height = 3000;

        let ctx = (window as any).canvas.getContext('2d');

        function loadImage(src: string): Promise<HTMLImageElement> {
            return new Promise((resolve) => {
                const img = document.createElement('img');
                img.onload = () => {
                    resolve(img)
                };
                img.src = src;
            })
        }

        Promise.all([
            loadImage('images/background.jpg'),
            loadImage('images/stone.png')
        ]).then(([img1, img2]) => {
            for (let row = 0; row < ctx.canvas.height; row += img1.height) {
                for (let col = 0; col < ctx.canvas.width; col += img1.width) {
                    ctx.drawImage(img1, col, row);
                }
            }
            for (let i = 0; i < 50; i++) {
                ctx.drawImage(img2, Math.round(0 - 0.5 + Math.random() * 3001), Math.round(0 - 0.5 + Math.random() * 3001))
            }
        });
        this.setState({
            size,
        });

        const {setShotPosition} = this.props;

        new DragListener(this.container!, {
            onStart: (dragPosition) => {
                setShotPosition(this.getGamePosition(dragPosition));
            },
            onMove: (dragPosition) => {
                setShotPosition(this.getGamePosition(dragPosition));
            },
            onEnd: () => {
                setShotPosition(undefined);
            },
        });

        addElementEventListener(this.container!, 'mousemove', (e: MouseEvent) => {
            const point = this.getGamePosition({
                x: e.clientX,
                y: e.clientY,
            });

            this.props.setHoverPosition(point);
        })
    }

    private getGamePosition({
                                x,
                                y,
                            }: PointCoordinates): PointCoordinates {
        const {
            width,
            height,
        } = this.state.size;

        const squareSize = Math.min(width, height);
        const left = width > height
            ? (width - squareSize) / 2
            : 0;
        const top = width > height
            ? 0
            : (height - squareSize) / 2;

        const center = {
            x: left + squareSize / 2,
            y: top + squareSize / 2,
        };

        return {
            x: -(center.x - x) / squareSize * 100,
            y: -(center.y - y) / squareSize * 100,
        };
    }
}

