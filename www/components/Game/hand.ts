export default class Hand {
  direction: string;
  moveDirection: string;
  degree: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  imageInfo: {
    width: number,
    height: number,
  };
  image: HTMLImageElement;
  constructor(direction, x, y, imageInfo) {
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.imageInfo = {
      width: imageInfo.width,
      height: imageInfo.height
    }
    this.degree = 0;
  }

  changeMoveDirection() {
    if (this.direction === 'left' && this.moveDirection === 'right' && this.degree <= -20) {
      this.moveDirection = 'left';
    } else if (this.direction === 'left' && this.moveDirection === 'left' && this.degree >= 0) (
      this.moveDirection = 'right'
    )

    if (this.direction === 'right' && this.moveDirection === 'left' && this.degree >= 20) {
      this.moveDirection = 'right';
    } else if (this.direction === 'right' && this.moveDirection === 'right' && this.degree <= 0) {
      this.moveDirection = 'left';
    }
  }
}
