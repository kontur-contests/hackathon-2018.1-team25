
import { addElementEventListener } from '../../utils/addElementEventListener';

/**
 * Current dragging position
 */
import { noop } from '../../utils/noop';
import { removeSelection } from '../../utils/removeSelection';

type Position = {
    x: number;
    y: number;
};


/**
 * Dragging position on start dragging
 */
type StartPosition = {
    startX: number;
    startY: number;
};

/**
 * Current dragging position relative to start dragging position
 */
type RelativePosition = {
    relativeX: number;
    relativeY: number;
};

export type DragPosition =
    & Position
    & StartPosition
    & RelativePosition;

export type DragListenerCallbacks = {
    onStart: (dragPosition: DragPosition) => void;
    onMove: (dragPosition: DragPosition) => void;
    onEnd: (dragPosition: DragPosition) => void;
};

/**
 * Для корректной работы на элементе должен быть установлен стиль `user-select: none;`
 */
export class DragListener {
    private readonly callbacks: DragListenerCallbacks;

    private draggingStartRelativePosition: RelativePosition | undefined;
    private readonly onDestroyFunctions: Array<() => void> = [];

    constructor(private readonly element: HTMLElement,
                {
                    onStart = noop,
                    onMove = noop,
                    onEnd = noop,
                }: Partial<DragListenerCallbacks>) {
        const { documentElement } = element.ownerDocument;

        this.callbacks = {
            onStart,
            onMove,
            onEnd,
        };

        const unsubscribeMouseDown = addElementEventListener(
            element,
            'mousedown',
            this.startDragging
        );
        const unsubscribeMouseMove = addElementEventListener(
            documentElement,
            'mousemove',
            this.moveDragging
        );
        const unsubscribeMouseUp = addElementEventListener(
            documentElement,
            'mouseup',
            this.endDragging
        );

        this.onDestroyFunctions.push(
            unsubscribeMouseDown,
            unsubscribeMouseMove,
            unsubscribeMouseUp,
        );
    }

    /**
     * Possibility to start dragging manually
     */
    public start() {
        if (this.draggingStartRelativePosition !== undefined) {
            throw new Error('DragListener is already started');
        }

        const {
            documentElement,
        } = this.element.ownerDocument;

        let wasMoved = false;

        const unsubscribeFirstMouseMove = addElementEventListener(
            documentElement,
            'mousemove',
            (event) => {
                wasMoved = true;
                this.startDragging(event);
            },
            {
                once: true,
            },
        );

        const unsubscribeFirstMouseUp = addElementEventListener(
            documentElement,
            'mouseup',
            ({
                 clientX,
                 clientY,
             }) => {
                unsubscribeFirstMouseMove();

                if (!wasMoved) {
                    removeSelection();

                    this.callbacks.onEnd({
                        x: clientX,
                        y: clientY,
                        startX: clientX,
                        startY: clientY,
                        relativeX: 0,
                        relativeY: 0,
                    });

                    this.draggingStartRelativePosition = undefined;
                }
            },
            {
                once: true,
            },
        );

        this.onDestroyFunctions.push(
            unsubscribeFirstMouseMove,
            unsubscribeFirstMouseUp,
        );
    }

    public destroy(): void {
        this.onDestroyFunctions.forEach((fn) => fn());
    }

    private startDragging = (mouseDownEvent: MouseEvent) => {
        if (this.draggingStartRelativePosition !== undefined) {
            return;
        }

        removeSelection();

        this.draggingStartRelativePosition = {
            relativeX: mouseDownEvent.clientX,
            relativeY: mouseDownEvent.clientY,
        };

        this.callbacks.onStart({
            x: mouseDownEvent.clientX,
            y: mouseDownEvent.clientY,
            startX: mouseDownEvent.clientX,
            startY: mouseDownEvent.clientY,
            relativeX: 0,
            relativeY: 0,
        });
    }

    private moveDragging = (mouseMoveEvent: MouseEvent) => {
        if (this.draggingStartRelativePosition === undefined) {
            return;
        }

        removeSelection();

        const {
            relativeX: startX,
            relativeY: startY,
        } = this.draggingStartRelativePosition;

        this.callbacks.onMove({
            x: mouseMoveEvent.clientX,
            y: mouseMoveEvent.clientY,
            startX,
            startY,
            relativeX: mouseMoveEvent.clientX - startX,
            relativeY: mouseMoveEvent.clientY - startY,
        });
    }

    private endDragging = (mouseUpEvent: MouseEvent) => {
        if (this.draggingStartRelativePosition === undefined) {
            return;
        }

        removeSelection();

        const {
            relativeX: startX,
            relativeY: startY,
        } = this.draggingStartRelativePosition;

        this.callbacks.onEnd({
            x: mouseUpEvent.clientX,
            y: mouseUpEvent.clientY,
            startX,
            startY,
            relativeX: mouseUpEvent.clientX - startX,
            relativeY: mouseUpEvent.clientY - startY,
        });

        this.draggingStartRelativePosition = undefined;
    }
}
