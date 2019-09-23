export enum State {
  Ready = 'ready',
  OnProgress = 'onprogress',
  Done = 'done',
}

export default class GameState {
  private readonly state: State;

  constructor(nowSeconds: number) {
    if (nowSeconds < 20000) {
      this.state = State.Ready;
    } else {
      this.state = nowSeconds < 40000 ? State.OnProgress : State.Done;
    }
  }

  getState(): State {
    return this.state;
  }

  isDone(): boolean {
    return this.state === State.Done;
  }
}
