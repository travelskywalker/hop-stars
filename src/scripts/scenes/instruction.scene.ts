import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';

export class InstructionScene extends Scene {

  // bg
  bg1: SpriteActor;
  swipe: SpriteActor;
  taptostart: SpriteActor;

  init(): void {

  }

  start(): void {
    // initialize and set bg
    this.bg1 = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.jpg');
    this.bg1.setAnchor(0, 0);
    this.bg1.setPosition(0,0);
    this.bg1.setScaleUpToScreenPercWidth(1);
    this.addChild(this.bg1);

    this.swipe = new SpriteActor('int-bg', this.app, 'common', 'instructions_overlay.png');
    this.swipe.setAnchor(0, 0);
    this.swipe.setPosition(0,0);
    this.swipe.setScaleUpToScreenPercWidth(1);
    this.addChild(this.swipe);

    this.taptostart = new SpriteActor('tap-bg', this.app, 'common', 'tapstart_overlay.png');
    this.taptostart.setAnchor(0, 0);
    this.taptostart.setPosition(0,0);
    this.taptostart.setScaleUpToScreenPercWidth(1);
    this.taptostart.getSprite().interactive = true;
    this.taptostart.getSprite().on('pointerup', () => { 
      console.log('go to game scene ');
      setTimeout(() => { this.app.goToScene(2); }, 200);
    });
    this.addChild(this.taptostart);
  }

  update(_delta: number): void {

  }

  remove(): void {

  }

}