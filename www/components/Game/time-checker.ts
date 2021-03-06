export default class TimeChecker {
  startTimeStamp: any;
  animationStartTimeStamp: any;
  animationEndTimeStamp: any;
  endTimeStamp: any;
    constructor(ts) {
        this.startTimeStamp = ts;
        this.animationStartTimeStamp = ts + 20000;
        this.animationEndTimeStamp = ts + 40000;
        this.endTimeStamp = ts + 60000;
    }

    isAnimationTime() {
        const now = Date.now();
        return (this.animationStartTimeStamp <= now && this.animationEndTimeStamp > now);
    }

    isReadyTime() {
        const now = Date.now();
        return (this.startTimeStamp <= now && this.animationStartTimeStamp > now);
    }

    isResultTime() {
        const now = Date.now();
        return (this.endTimeStamp > now && this.animationEndTimeStamp < now);
    }

    isOverTime() {
      const now = Date.now();
      return (this.endTimeStamp < now);
    }
}
