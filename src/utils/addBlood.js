/**
 * прилетает объект с координатами зомби
 * @param coordinates
 */
export function addBlood(coordinates) {
  let {x, y} = coordinates;
  const ctx = document.getElementById('canvas').getContext('2d');

  const pic = new Image();
  const halfWidthImg = 44;
  const halfHeightImg = 16.5;
  const canvasPositionX = 1500 - halfWidthImg; //вычитаем половину ширины и высоты картинки, чтоб она центрировалась относительно координаты
  const canvasPositionY = 1500 - halfHeightImg;

  x *= 10;
  y *= 10;
  pic.src = `images/blood/${Math.floor(Math.random() * 3)}.png`;
  pic.onload = () => {
    ctx.drawImage(pic, x + canvasPositionX, y + canvasPositionY);
  };
}
