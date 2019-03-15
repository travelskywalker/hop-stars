import * as PIXI from 'pixi.js';
import { App } from '@src/app';
import { Actor } from '@src/core/actor';
import { SceneItem } from '@src/core/scene.item';

export class Scene {

  app: App;
  children: SceneItem[] = [];
  container: PIXI.Container;
  started: boolean;

  constructor(_app: App) {

    this.app = _app;
    this.container = new PIXI.Container();
  }

  // virtual methods

  init(): void { }
  start(): void { }
  update(_delta: number): void { }
  remove(): void { }

  // protected methods

  public addChild(_child: SceneItem): void {

    if (_child instanceof Actor) {
      this.container.addChild((_child as Actor).getDisplayObject());
    }
    this.children.push(_child);
    _child.start();
  }

  public removeChild(_child: SceneItem): void {

    const index = this.children.indexOf(_child, 0);
    if (index > -1) {
      if (_child instanceof Actor) {
        this.container.removeChild((_child as Actor).getDisplayObject());
      }
      this.children.splice(index, 1);
      _child.remove();
    }
  }

  // public methods

  public initChildrenPropagate(): void {

    // called within app.ts
    this.children.forEach((actor: SceneItem) => actor.init());
  }

  public startChildrenPropagate(): void {

    // called within app.ts
    this.children.forEach((actor: SceneItem) => actor.start());
  }

  public updateChildrenPropagate(_delta: number): void {

    // called within app.ts
    this.children.forEach((actor: SceneItem) => actor.update(_delta));
  }

  public removeChildrenPropagate(): void {

    // called within app.ts
    this.children.forEach((actor: SceneItem) => actor.remove());
  }

}