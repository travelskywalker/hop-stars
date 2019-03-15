import * as PIXI from 'pixi.js';
import { App } from '@src/app';
import { SceneItem } from '@src/core/scene.item';

export class Actor extends SceneItem {

  protected displayObject: PIXI.DisplayObject;

  constructor(_id: string, _app: App) {

    super(_id, _app);
  }

  // public methods

  public getDisplayObject() {

    // only meant to be called from core scene class
    return this.displayObject;
  }

}