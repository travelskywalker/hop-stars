import * as PIXI from 'pixi.js';
import { App } from '@src/app';
import { Actor } from './actor';

export class SpriteAnimatedActor extends Actor {

  animations: any = {};
  animatedSprite: PIXI.extras.AnimatedSprite;
  currentAnimation: string;

  constructor(_id: string, _app: App) {

    super(_id, _app);

  }

  public addAnimation(_spritesheet: string, _animation: string): void {

    this.animations[_animation] = this.app.getResource(_spritesheet).data.animations[_animation].map((t_name: string) => {
      return this.app.getResource(_spritesheet).spritesheet.textures[t_name];
    });

    if (this.animatedSprite == null) {

      this.displayObject = new PIXI.extras.AnimatedSprite(this.animations[_animation]);
      this.animatedSprite = this.displayObject as PIXI.extras.AnimatedSprite;
      this.animatedSprite.interactive = false;
    }
  }

  public getAnimatedSprite(): PIXI.extras.AnimatedSprite {

    return this.animatedSprite;
  }

  public setPosition(x: number, y: number): void {

    this.animatedSprite.x = x;
    this.animatedSprite.y = y;
  }

  public setRotation(radians: number): void {

    this.animatedSprite.rotation = radians;
  }

  public setAnchor(x: number, y: number): void {

    this.animatedSprite.anchor.set(x, y);
  }

  public setScale(x: number, y: number): void {

    this.animatedSprite.scale = new PIXI.Point(x * window.devicePixelRatio, y * window.devicePixelRatio);
  }

  public setScaleUpToScreenPercWidth(perc: number): void {

    const point = this.animatedSprite.scale;
    perc = this.app.getScreenSize().w * perc;
    do {
      point.x += 0.01;
      point.y += 0.01;
      this.animatedSprite.scale = point;
    } while (this.animatedSprite.width < perc);
    this.animatedSprite.width = Math.round(this.animatedSprite.width);
    this.animatedSprite.height = Math.round(this.animatedSprite.height);
  }

  public setScaleUpToScreenPercHeight(perc: number): void {

    this.animatedSprite.scale = new PIXI.Point(0.01, 0.01);
    const point = this.animatedSprite.scale;
    perc = this.app.getScreenSize().h * perc;
    do {
      point.x += 0.01;
      point.y += 0.01;
      this.animatedSprite.scale = point;
    } while (this.animatedSprite.height < perc);
    this.animatedSprite.width = Math.round(this.animatedSprite.width);
    this.animatedSprite.height = Math.round(this.animatedSprite.height);
  }

  public setAnimationSpeed(speed: number): void {

    this.animatedSprite.animationSpeed = speed;
  }

  public switchAnimation(_animation: string, _speed: number = 60, _loop: boolean = false): void {

    if (_animation !== this.currentAnimation) {

      this.currentAnimation = _animation;
      this.animatedSprite.textures = this.animations[_animation];
      this.setLoop(_loop);
      this.setAnimationSpeed(_speed);
      this.animatedSprite.gotoAndPlay(0);
    }
  }

  public setLoop(enabled: boolean): void {

    this.animatedSprite.loop = enabled;
  }

  public play(): void {

    this.animatedSprite.gotoAndPlay(0);
  }

}