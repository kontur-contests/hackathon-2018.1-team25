import * as React from 'react';
import { Size } from '../../Store/MyasoStore';
import { ResizeSensor } from '../../utils/ResizeSensor/index';
import { UnitsConnected } from '../Units/connected';
import HUD from '../HUD/view'
import * as c from './style.pcss';

type AppState = {
    size: Size;
}

export class App extends React.Component<{}, AppState> {
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
                    />


                </div>
                <UnitsConnected/>
            </div>
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

        function loadImage(src: string):Promise<HTMLImageElement> {
            return new Promise((resolve) => {
                const img = document.createElement('img');
                img.onload = ()=>{
                    resolve(img)
                };
                img.src = src;
            })
        }

        Promise.all([
            loadImage('images/background.jpg'),
            loadImage('images/stone.png')
        ]).then(([img1, img2])=>{
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
    }
}

