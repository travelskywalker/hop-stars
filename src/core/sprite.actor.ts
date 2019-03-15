import * as PIXI from 'pixi.js';
import { Actor } from '@src/core/actor';
import { App } from '@src/app';

export class SpriteActor extends Actor {

  sprite: PIXI.Sprite;

  constructor(_id: string, _app: App, _spritesheet: string, _sprite: string) {

    super(_id, _app);
    this.displayObject = new PIXI.Sprite(this.app.getResource(_spritesheet).spritesheet.textures[_sprite]);
    this.sprite = this.displayObject as PIXI.Sprite;
    this.sprite.interactive = false;
  }

  public getSprite(): PIXI.Sprite {

    return this.sprite;
  }

  public setPosition(x: number, y: number): void {

    this.sprite.x = x;
    this.sprite.y = y;
  }

  public setRotation(radians: number): void {

    this.sprite.rotation = radians;
  }

  public setAnchor(x: number, y: number): void {

    this.sprite.anchor.set(x, y);
  }

  public setScale(x: number, y: number): void {

    this.sprite.scale = new PIXI.Point(x * window.devicePixelRatio, y * window.devicePixelRatio);
  }

  public setScaleUpToScreenPercWidth(perc: number): void {

    this.sprite.scale = new PIXI.Point(0.01, 0.01);
    const point = this.sprite.scale;
    perc = this.app.getScreenSize().w * perc;
    do {
      point.x += 0.01;
      point.y += 0.01;
      this.sprite.scale = point;
    } while (this.sprite.width < perc);
    this.sprite.width = Math.round(this.sprite.width);
    this.sprite.height = Math.round(this.sprite.height);
  }

  public setScaleUpToScreenPercHeight(perc: number): void {

    const point = this.sprite.scale;
    perc = this.app.getScreenSize().h * perc;
    do {
      point.x += 0.01;
      point.y += 0.01;
      this.sprite.scale = point;
    } while (this.sprite.height < perc);
    this.sprite.width = Math.round(this.sprite.width);
    this.sprite.height = Math.round(this.sprite.height);
  }

}