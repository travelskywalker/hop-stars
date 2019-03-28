import { Subject } from 'rxjs/Subject';

export class IAppState {

  explosionActive: boolean;
  volume: number = 0;
}

export class AppState extends Subject<IAppState> {

  public state: IAppState = new IAppState();

  public setExplosion(active: boolean): void {

    this.state.explosionActive = active;
    this.next(this.state);
  }

  public toggle_volume() {
    this.state.volume += 1;
    if (this.state.volume === 2) {
      this.state.volume = 0;
    }
    this.next(this.state);
  }

}