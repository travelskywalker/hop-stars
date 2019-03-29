import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';

export class InstructionScene extends Scene {

  // bg
  bg: SpriteActor;
  swipe: SpriteActor;
  taptostart: SpriteActor;

  init(): void {

  }

  start(): void {
    // initialize and set bg
    this.bg = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.jpg');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.bg.getSprite().interactive = true;
    this.bg.getSprite().on('pointerup', () => { 
      console.log('go to game scene ');
      setTimeout(() => { this.app.goToScene(2); }, 200);
    });
    this.addChild(this.bg);

    this.swipe = new SpriteActor('int-bg', this.app, 'common', 'Instruction-group.png');
    this.swipe.setAnchor(.5, .5);
    this.swipe.setPosition(this.app.getScreenSize().w * .5, this.app.getScreenSize().h * .85);
    this.swipe.setScaleUpToScreenPercWidth(.9);
    this.swipe.getSprite().interactive = true;
    this.swipe.getSprite().on('pointerup', () => { 
      console.log('go to game scene ');
      setTimeout(() => { this.app.goToScene(2); }, 200);
    });
    
    this.addChild(this.swipe);

    this.taptostart = new SpriteActor('tap-bg', this.app, 'common', 'TAP TO START.png');
    this.taptostart.setAnchor(.5, .5);
    this.taptostart.setPosition(this.app.getScreenSize().w * .5, this.app.getScreenSize().h * .4);
    this.taptostart.setScaleUpToScreenPercWidth(.7);
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