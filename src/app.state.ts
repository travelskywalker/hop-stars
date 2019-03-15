import { Subject } from 'rxjs/Subject';

export class IAppState {

  explosionActive: boolean;
}

export class AppState extends Subject<IAppState> {

  public s: IAppState = new IAppState();

  public setExplosion(active: boolean): void {

    this.s.explosionActive = active;
    this.next(this.s);
  }

}