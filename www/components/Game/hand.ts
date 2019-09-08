export default class Hand {
  direction: string;
  moveDirection: string;
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
  }

  changeMoveDirection() {
    if (this.direction === 'left' && this.moveDirection === 'right' && this.startX + 35 <= this.x) {
      this.moveDirection = 'left';
    } else if (this.direction === 'left' && this.moveDirection === 'left' && this.startX >= this.x) (
      this.moveDirection = 'right'
    )

    if (this.direction === 'right' && this.moveDirection === 'right' && this.startX <= this.x) {
      this.moveDirection = 'left';
    } else if (this.direction === 'right' && this.moveDirection === 'left' && this.startX - 35 >= this.x) {
      this.moveDirection = 'right';
    }
  }
}
