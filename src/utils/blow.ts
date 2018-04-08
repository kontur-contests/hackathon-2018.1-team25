import { PointCoordinates, Size } from '../Store/MyasoStore';

const blowImageSrc = './images/blow.gif';

export function blow({
                         x,
                         y,
                         width,
                         height,
                     }: PointCoordinates & Size) {
    const { animationContainer } = window as any;

    const image = document.createElement('img');
    animationContainer.appendChild(image);
    image.src = blowImageSrc + '?' + Math.random();

    image.style.position = 'absolute';

    image.style.width = `${width / 3}%`;
    image.style.height = `${height / 3}%`;
    image.style.top = `${(y + 150) / 3}%`;
    image.style.left = `${(x + 150) / 3}%`;

    setTimeout(() => animationContainer.removeChild(image), 1000);
}