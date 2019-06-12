import { App } from './app';
import { Subscription } from 'rxjs/Subscription';
import { IAppState } from './app.state';
import 'pixi-sound';

export class AppSound {

  app: App;
  state_subscription: Subscription;

  constructor(_app: App) {
    this.app = _app;
    PIXI.sound.volumeAll = 0;
    PIXI.sound.play('BGM_default', { loop: true });
    this.state_subscription = this.app.getState().subscribe((_state: IAppState) => {
      PIXI.sound.volumeAll = [0, 1][_state.volume];
    });
  }

  play(name: string, volume: any=1) {
    PIXI.sound.play(name, {"volume": volume});
  }

  stop(name: string) {
    PIXI.sound.stop(name);
  }
}