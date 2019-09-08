export default class Ya {
  image: HTMLImageElement;
  name: any;
  x: any;
  y: any;
  prevPosition: any;
  position: any;
  movingPerFrame: any;
  isMoving: any;
  imageInfo: any;
    constructor(position, x, y, imageInfo) {
        this.name = 'ya' + position;
        this.x = x;
        this.y = y;
        this.prevPosition = 0;
        this.position = position;
        this.movingPerFrame = 0;
        this.isMoving = false;
        this.imageInfo = {
            width: imageInfo.width,
            height: imageInfo.height
        }
    }
}
