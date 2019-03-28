import * as PIXI from 'pixi.js';
import { b64_loader } from '@src/app.loader.b64';

// state management
import { AppState } from '@src/app.state';

// scene management
import { Scene } from '@src/core/scene';
import { scenesProvider } from '@src/app.scenes';
import { resourcesProvider } from '@src/app.resources';

export class App {

  // pixijs engine reference
  public _app: PIXI.Application;

  // scene management
  private _scenes: Scene[] = [];
  private _currentScene: Scene;

  // resource management
  private _resources: any;

  // state management
  private _state: AppState;

  // app lifecycle
  private _timeSinceStart: number = 0;

  // loader
  private _loaderSprite: PIXI.Sprite;
  private _loaderText: PIXI.Text;

  constructor() {

    // setup game framework
    this.setup();

    // loader image
    const loader_img = new Image();
    loader_img.src = b64_loader;
    this._loaderSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(loader_img)));
    this._loaderSprite.anchor.set(0.5, 0.5);
    this._loaderSprite.scale = new PIXI.Point(3, 3);
    let perc = (window.innerWidth * window.devicePixelRatio) * 0.25;
    do {
      this._loaderSprite.width += 0.09;
      this._loaderSprite.height += 0.1;
    } while (this._loaderSprite.width < perc);

    this._loaderSprite.x = this._app.renderer.width * 0.5;
    this._loaderSprite.y = this._app.renderer.height * 0.5;
    this._app.stage.addChild(this._loaderSprite);

    // loader slider
    this._loaderText = new PIXI.Text(
      'LOADING... 0%',
      { fontFamily: 'Chennai', fontSize: 14 * window.devicePixelRatio, fill: 0X942363, align: 'center' },
    );
    this._loaderText.scale = new PIXI.Point(1, 1);
    perc = (window.innerWidth * window.devicePixelRatio) * 0.2;
    do {
      this._loaderText.scale.x += 0.1;
      this._loaderText.scale.y += 0.1;
    } while (this._loaderText.width < perc);
    this._loaderText.x = this._loaderSprite.x - this._loaderText.width * 0.55;
    this._loaderText.y = this._loaderSprite.y + this._loaderSprite.height * 0.6;
    this._app.stage.addChild(this._loaderText);

    // load resources
    this.resources(
      // start engine on resources ready
      this.start.bind(this),
    );
  }

  private setup() {

    // remove pixijs watermark before anything else
    PIXI.utils.skipHello();

    // get available screen size (html viewport meta)
    const w = window.innerWidth;
    const h = window.innerHeight;

    // create application
    this._app = new PIXI.Application(w * window.devicePixelRatio, h * window.devicePixelRatio, { resolution: window.devicePixelRatio });

    // create pixijs renderer
    this._app.renderer = PIXI.autoDetectRenderer();
    this._app.renderer.backgroundColor = 0xFFFFFF;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    // adapt size to screensize
    this._app.renderer.view.style.position = 'absolute';
    this._app.renderer.view.style.display = 'block';
    this._app.renderer.view.style.width = `${window.innerWidth}px`;
    this._app.renderer.view.style.height = `${window.innerHeight}px`;
    this._app.renderer.resize(w * window.devicePixelRatio, h * window.devicePixelRatio);

    // finally insert canvas to html
    setTimeout(() => { document.body.appendChild(this._app.view); }, 200);
  }

  private resources(loaded: () => void) {

    resourcesProvider(this, (resources: any) => {
      setTimeout(() => {
        // set local reference to loaded resources
        this._resources = resources;
        this._app.stage.removeChild(this._loaderSprite);
        this._app.stage.removeChild(this._loaderText);
        loaded();
      }, 2000);
    }, (percent: number) => {
      this._loaderText.text = `LOADING... ${percent}%`;
    });
  }

  private start() {

    // create state
    this._state = new AppState();

    // register scenes
    scenesProvider(this, this._scenes);

    // call scenes init function before starting game loop
    this._scenes.forEach((scene: Scene) => scene.init());

    // call init on scene actors
    this._scenes.forEach((scene: Scene) => scene.initChildrenPropagate());

    // set current scene to first item
    this._currentScene = this._scenes[0];
    this._app.stage.addChild(this._currentScene.container);

    // start game loop
    this._app.ticker.add(this.update.bind(this));
  }

  private update(_delta: number) {

    // call start method of scenes
    if (!this._currentScene.started) {

      this._currentScene.start();
      this._currentScene.startChildrenPropagate();
      this._currentScene.started = true;
      return;
    }

    // call update method of scenes
    this._currentScene.update(_delta);

    // update scene actors
    this._currentScene.updateChildrenPropagate(_delta);

    // update time elapsed since start
    this._timeSinceStart += this._app.ticker.elapsedMS;
  }

  public goToScene(sceneIndex: number) {

    // get target scene from scene list
    const entryScene = this._scenes[sceneIndex];
    if (!entryScene) {
      throw new Error('[App] goToScene -> Invalid scene index!');
    }

    // replace current scene with new scene
    this._currentScene.started = false;
    this._currentScene.remove();
    this._currentScene.removeChildrenPropagate();
    this._app.stage.removeChild(this._currentScene.container);
    this._app.stage.addChild(entryScene.container);
    this._currentScene = entryScene;
  }

  public getPixiApplication(): PIXI.Application {

    // initialized in constructor
    return this._app;
  }

  public getScreenSize(): { w: number, h: number } {

    return {
      w: this._app.renderer.width,
      h: this._app.renderer.height,
    };
  }

  public getTime(): number {

    // time is updated in app update function
    return this._timeSinceStart;
  }

  public getResource(key: string): any {

    // return cached resource from loader
    return this._resources[key];
  }

  public getCurrentScene(): Scene {

    return this._currentScene;
  }

  public getState(): AppState {

    return this._state;
  }

}
export const app = new App();