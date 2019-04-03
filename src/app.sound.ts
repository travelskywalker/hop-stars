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
    PIXI.sound.play('BGM', { loop: true });
    this.state_subscription = this.app.getState().subscribe((_state: IAppState) => {
      PIXI.sound.volumeAll = [0, 1.0][_state.volume];
    });
  }

  play(name: SoundName) {
    PIXI.sound.play(name);
  }

  stop(name: SoundName) {
    PIXI.sound.stop(name);
  }
}

export type SoundName =
    'ball_bounce'
  | 'BGM'
  | 'button'
  | 'coin';