import { shuffleArray } from './util';
import Ya from './ya';
import Ball from './ball';
import TimeChecker from './time-checker';
import {getGames} from "../../pages";
import Hand from "./hand";

export default class Yayaya {
  wrapper: any;
  yas: any;
  ball: any;
  absolutePositionValue: any;
  renderData: any;
  timeChecker: TimeChecker;
  canvas: any;
  ctx: any;
  store: any;
  hands: {
    left: Hand,
    right: Hand
  };
  constructor(wrapper, ts, store) {
      this.wrapper = wrapper;
      this.yas = [];
      this.ball = {};
      this.hands = {
        left: new Hand('left', 0, 0, {
          width: 0,
          height: 0
        }),
        right: new Hand('right', 0, 0, {
          width: 0,
          height: 0
        })
      };
      this.absolutePositionValue = [];
      this.renderData = {
          stopAnimation: {},
          stopStartAnimation: {},
          stopEndAnimation: {},
          lastTick: 0,
          tickLength: 20,
          tickCnt: 0,
          velocity: 2,
      };
      this.timeChecker = new TimeChecker(ts);
      this.store = store;
  }

  init() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.wrapper.clientWidth;
      this.canvas.height = this.wrapper.clientHeight;
      this.wrapper.append(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.initYa();
      this.initHands();
  }

  async main(tFrame) {
      this.renderData.stopAnimation = window.requestAnimationFrame( tFrame => this.main(tFrame) );
      if (this.renderData.lastTick + this.renderData.tickLength <= tFrame) {
          this.moveHands();
          this.renderData.lastTick = tFrame;
          this.renderData.tickCnt = this.renderData.tickCnt + 1;
          if (this.checkEndedMoving() || !this.yas.some(ya => ya.isMoving)) {
              if (this.renderData.velocity <= 0.1 && this.timeChecker.isResultTime()) {
                  window.cancelAnimationFrame(this.renderData.stopAnimation);
                  const res = await getGames();
                  this.setBallPosition(res.data.data.results[0].result);
                  setTimeout(() => {
                      this.end(performance.now(), 1, {x: 0, y: this.absolutePositionValue[0].y} )
                  }, 500);
              } else {
                  this.changePosition();
                  this.moveYa();
              }
          } else {
              this.moveYa();
          }
      }
  }

  start(tFrame, step, position) {
      if (step === 1 && position.y === this.absolutePositionValue[0].y - 50) {
          step = 2;
      } else if (step === 2 && position.y === this.absolutePositionValue[0].y) {
          step = 3;
      } else if (step ===3 && position.y === this.absolutePositionValue[0].y - 24) {
          step = 4;
      }
      this.renderData.stopStartAnimation = window.requestAnimationFrame( tFrame => this.start(tFrame, step, position) );
      if (this.renderData.lastTick + this.renderData.tickLength <= tFrame && this.timeChecker.isAnimationTime()) {
          this.renderData.lastTick = tFrame;
          if (step === 1 && position.y > this.absolutePositionValue[0].y - 50) {
              position.y -= 2;
          } else if (step === 2 && position.y < this.absolutePositionValue[0].y) {
              position.y += 2;
          } else if (step === 3 && position.y > this.absolutePositionValue[0].y - 24) {
              position.y -= 2;
          } else if (step === 4 && position.y < this.absolutePositionValue[0].y) {
              position.y += 2;
          }
          this.yas.forEach(ya => {
              ya.y = position.y;
          });
          this.render(true);
          if (step === 4 && position.y === this.absolutePositionValue[0].y) {
              window.cancelAnimationFrame(this.renderData.stopStartAnimation);
              this.main(performance.now());
          }
      }
  }

  end(tFrame, step, position) {
      if (position.y === this.absolutePositionValue[0].y - 50) {
          step = 2;
      }
      this.renderData.stopStartAnimation = window.requestAnimationFrame( tFrame => this.end(tFrame, step, position) );
      if (this.renderData.lastTick + this.renderData.tickLength <= tFrame) {
          this.renderData.lastTick = tFrame;
          if (step === 1 && position.y > this.absolutePositionValue[0].y - 50) {
              position.y -= 2;
          } else if (step === 2 && this.timeChecker.isOverTime()) {
              this.store.refresh();
              window.cancelAnimationFrame(this.renderData.stopStartAnimation);
          }
          this.yas.forEach(ya => {
              ya.y = position.y;
          });
          this.render(true);
      }
  }

  changePosition() {
      if (this.renderData.velocity > 0.1 && this.timeChecker.isAnimationTime()) {
          this.renderData.velocity = 2 - (0.05 * Math.round(((Date.now() - this.timeChecker.animationStartTimeStamp) / 50) / 8));
      }

      const shuffledArray = shuffleArray(this.yas.map(ya => ya.position));
      shuffledArray.forEach((v, idx) => {
          const ya = this.yas[idx];
          ya.prevPosition = ya.position;
          ya.position = v;
          ya.movingPerFrame =
              ((this.absolutePositionValue[ya.position - 1].x - this.absolutePositionValue[ya.prevPosition - 1].x) /
              (this.renderData.tickLength * this.renderData.velocity));
          if (ya.prevPosition !== ya.position) {
              ya.isMoving = true;
          } else {
              ya.isMoving = false;
          }
      });
  }

  checkEndedMoving() {
      return this.yas
          .filter(ya => ya.isMoving)
          .some(ya => {
              const destPosition = this.absolutePositionValue[ya.position - 1];
              return ya.x < destPosition.x + 1 && ya.x > destPosition.x - 1;
          });
  }

  moveYa() {
      this.yas.forEach(ya => {
          ya.x = ya.x + ya.movingPerFrame;
      });
      this.render(false);
  }

  moveHands() {
    this.hands.left.changeMoveDirection();
    this.hands.right.changeMoveDirection();
    const velocity = 30 - this.renderData.velocity * 15;

    if (this.hands.left.moveDirection === 'right') {
      this.hands.left.x = this.hands.left.x + (1 + velocity);
    } else {
      this.hands.left.x = this.hands.left.x - (1 + velocity);
    }

    if (this.hands.right.moveDirection === 'right') {
      this.hands.right.x = this.hands.right.x + (1 + velocity);
    } else {
      this.hands.right.x = this.hands.right.x - (1 + velocity);
    }
  }

   initYa() {
       const yaImage = new Image();
       const ballImage = new Image();
       yaImage.onload = () => {
           this.initYaPosition(yaImage);
           this.changePosition();
           ballImage.src = '/static/images/ball.png';
       };

       ballImage.onload = () => {
           this.initBallPosition(1, ballImage);
           this.render(true);
           if (this.timeChecker.isReadyTime()) {
             this.start(performance.now(), 1, {x: 0, y: this.absolutePositionValue[0].y});
           } else if (this.timeChecker.isAnimationTime()) {
             this.main(performance.now());
           } else if (this.timeChecker.isResultTime()) {
             this.end(performance.now(), 1, {x: 0, y: this.absolutePositionValue[0].y});
           }
       };

       yaImage.src = '/static/images/cup.png';
   }

   initHands() {
    const leftHandImage = new Image();
    this.hands.left.image = leftHandImage;
    this.hands.left.moveDirection = 'right';
    const rightHandImage = new Image();
    this.hands.right.image = rightHandImage;
    this.hands.right.moveDirection = 'left';
    leftHandImage.onload = () => {
      this.initLeftHandPosition();
    };
    rightHandImage.onload = () => {
      this.initRightHandPosition();
    };

    leftHandImage.src = '/static/images/left-hand.png';
    rightHandImage.src = '/static/images/right-hand.png';
   }

  initLeftHandPosition() {
    const imageWidth = this.canvas.width / 3;
    const imageHeight = imageWidth * (this.hands.left.image.height / this.hands.left.image.width);
    this.hands.left.x = 0 - (imageWidth / 3);
    this.hands.left.y = this.canvas.height - (this.canvas.height / 2);
    this.hands.left.startX = this.hands.left.x;
    this.hands.left.startY = this.hands.left.y;
    this.hands.left.imageInfo = {
      width: imageWidth,
      height: imageHeight
    }
  }

  initRightHandPosition() {
    const imageWidth = this.canvas.width / 3;
    const imageHeight = imageWidth * (this.hands.right.image.height / this.hands.right.image.width);
    this.hands.right.x = this.canvas.width - (imageWidth - (imageWidth / 3));
    this.hands.right.y = this.canvas.height - (this.canvas.height / 2);
    this.hands.right.startX = this.hands.right.x;
    this.hands.right.startY = this.hands.right.y;
    this.hands.right.imageInfo = {
      width: imageWidth,
      height: imageHeight
    }
  }

  render(withBall) {
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      if (withBall) {
          this.drawBall();
      }
      this.drawYa();
      this.drawHands();
  }

  drawYa() {
      this.yas.forEach(ya => {
          this.ctx.beginPath();
          this.ctx.drawImage(ya.image, ya.x, ya.y, ya.imageInfo.width, ya.imageInfo.height);
          this.ctx.closePath();
      })
  }

  drawBall() {
      this.ctx.beginPath();
      this.ctx.drawImage(this.ball.image, this.ball.x, this.ball.y, this.ball.imageInfo.width, this.ball.imageInfo.height);
      this.ctx.closePath();
  }

  drawHands() {
    this.ctx.beginPath();
    this.ctx.drawImage(this.hands.left.image, this.hands.left.x, this.hands.left.y, this.hands.left.imageInfo.width, this.hands.left.imageInfo.height);
    this.ctx.drawImage(this.hands.right.image, this.hands.right.x, this.hands.right.y, this.hands.right.imageInfo.width, this.hands.right.imageInfo.height);
    this.ctx.closePath();
  }

  setBallPosition(position) {
    const ya = this.yas.find(ya => ya.position === position + 1);
    const imageWidth = this.ball.imageInfo.width;
    const imageHeight = this.ball.imageInfo.height;
    const x = (ya.x + (ya.imageInfo.width / 2)) - (imageWidth / 2);
    const y = ya.y + ya.imageInfo.height - imageHeight;
    this.ball.x = x;
    this.ball.y = y;
  }

  initBallPosition(position, ballImage) {
      const ya = this.yas[position];
      // const imageWidth = this.canvas.width / 10;
      const imageWidth = 45;
      const imageHeight = imageWidth * (ballImage.height / ballImage.width);
      const x = (ya.x + (ya.imageInfo.width / 2)) - (imageWidth / 2);
      const y = ya.y + ya.imageInfo.height - imageHeight;
      this.ball = new Ball(x, y, {
          width: imageWidth,
          height: imageHeight
      });
      this.ball.image = ballImage;
  }

  initYaPosition(yaImage) {
      // const imageWidth = this.canvas.width / 4;
      const imageWidth = 83;
      const imageHeight = imageWidth * (yaImage.height / yaImage.width);
      // const eachArea = this.canvas.width / 3;
      const eachArea = 400 / 3;
      // const leftSpace = (eachArea - this.canvas.width / 4) / 2;
      const leftSpace = 135;
      [1, 2, 3].forEach((position, index) => {
          const x = eachArea * index + leftSpace;
          const y = (this.canvas.width / 2) - imageHeight / 2;
          const ya = new Ya(position, x, y, {
            width: imageWidth,
            height: imageHeight
          });
          ya.image = yaImage;
          this.yas.push(ya);
          this.absolutePositionValue.push({x, y});
      });
  }
}
