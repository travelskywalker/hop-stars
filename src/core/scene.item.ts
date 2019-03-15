
import { App } from '@src/app';

export class SceneItem {

  public id: string;
  protected app: App;

  constructor(_id: string, _app: App) {

    // set id for referencing
    this.id = _id;
    this.app = _app;
  }

  // protected methods

  init(): void { }
  start(): void { }
  update(_delta: number): void { }
  remove(): void { }

}