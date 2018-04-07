import { default as ResizeObserver } from 'resize-observer-polyfill';
import { Size } from '../../Store/MyasoStore';
const { noop } = require('../noop');

export class ResizeSensor {
    private readonly observer: ResizeObserver;
    private size: Size;

    constructor(element: HTMLElement,
                private callback: (size: Size) => void) {
        const { width, height } = element.getBoundingClientRect();
        this.size = {
            width,
            height,
        };

        this.observer = new ResizeObserver(this.resizeObserverCallback);
        this.observer.observe(element);
    }

    public getSize(): Size {
        return this.size;
    }

    public destroy() {
        this.callback = noop;
        this.observer.disconnect();
    }

    private readonly resizeObserverCallback: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
        const [{ contentRect: { width, height } }] = entries;

        if (this.size.width !== width || this.size.height !== height) {
            this.size = {
                width,
                height,
            };
            this.callback(this.size);
        }
    }
}
