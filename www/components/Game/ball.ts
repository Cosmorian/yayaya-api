export default class Ball {
  x: number;
  y: number;
  imageInfo: any;
  image: HTMLImageElement;
    constructor(x, y, imageInfo) {
        this.x = x;
        this.y = y;
        this.imageInfo = {
            width: imageInfo.width,
            height: imageInfo.height
        }
    }
}
