import { App } from '@src/app';
import { SpriteAnimatedActor } from '@src/core/sprite.animated.actor';

export class UnitActor extends SpriteAnimatedActor {

  constructor(_id: string, _app: App) {

    super(_id, _app);

    this.addAnimation('barmaid', `tile`);
    this.setScaleUpToScreenPercWidth(0.15);
    this.setAnchor(0.5, 0.5);
  }

  update(_delta: number): void {

  }

}