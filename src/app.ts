import * as PIXI from 'pixi.js';
import { b64_loader } from '@src/app.loader.b64';

// state management
import { AppState } from '@src/app.state';

// scene management
import { Scene } from '@src/core/scene';
import { scenesProvider } from '@src/app.scenes';
import { resourcesProvider } from '@src/app.resources';
import { AppSound } from './app.sound';

declare global { interface Window { Game: any; } }

// android
interface JavaScriptInterface { 
  gameStarted(data: any): any;
}

declare var Android: JavaScriptInterface;

export class App {
  // data requirements
  public currentScore: number = 0;
  public session_id: any;

  // pixijs engine reference
  public _app: PIXI.Application;

  // scene management
  private _scenes: Scene[] = [];
  private _currentScene: Scene;

  // resource management
  private _resources: any;

  // state management
  private _state: AppState;

  // sound management
  private _sound: AppSound;

  // app lifecycle
  private _timeSinceStart: number = 0;

  // loader
  private _loaderSprite: PIXI.Sprite;
  private _loaderText: PIXI.Text;

  // 
  public isRunningBackground: boolean = false;

  constructor() {
  
    // setup game framework
    this.setup();

    // dismiss static loader
    this.dismissStaticLoader();

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
    
    window.document.addEventListener("visibilitychange", (e) =>  {
      if(window.document.visibilityState == 'hidden'){
        this.isRunningBackground = true;
        PIXI.sound.pauseAll();
      }else{
        setTimeout(() => {
          this.isRunningBackground = false;
          PIXI.sound.resumeAll();
        }, 50);
      }
      
    });
  }

  private setup() {

    // remove pixijs watermark before anything else
    PIXI.utils.skipHello();

    // get available screen size (html viewport meta)
    const w = window.innerWidth;
    const h = window.innerHeight;

    // create application
    try {

      // adjust frame rate from default(0.4-0.6) to 1.5 || optimization
      PIXI.settings.TARGET_FPMS = 1.5;

      this._app = new PIXI.Application(w * window.devicePixelRatio, h * window.devicePixelRatio, { resolution: window.devicePixelRatio, antialias: true });

    } catch (error) {

      // alert(`Sorry, your device is not supported.`);
      // create not available page
      setTimeout(() => {

        // dismiss static loader
        this.dismissStaticLoader();

        document.getElementById('not-supported').classList.add('active');

        // send not supported event
        const data = {
          event: "not-supported",
          }

          try {
            Android.gameStarted(JSON.stringify(data));
          } catch (error) {
            alert(error)
          }
        

      }, 50);
    }

    // create pixijs renderer
    this._app.renderer = PIXI.autoDetectRenderer();
    // this._app.renderer = new PIXI.CanvasRenderer();

    if(this._app.renderer.type == 2){
      this._app.renderer.plugins['sprite2d'] = this._app.renderer.plugins['sprite'];
    }

    this._app.renderer.backgroundColor = 0xFFFFFF;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST; 

    // adapt size to screensize
    this._app.renderer.view.style.position = 'absolute';
    this._app.renderer.view.style.display = 'block';
    this._app.renderer.view.style.width = `${window.innerWidth}px`;
    this._app.renderer.view.style.height = `${window.innerHeight}px`;
    this._app.renderer.resize(w * window.devicePixelRatio, h * window.devicePixelRatio);
    
    // console.log(PIXI.settings);
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

    // create sound manager
    this._sound = new AppSound(this);

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

  public goToScene(sceneIndex: number, data: any = {}) {

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
    this.currentScore = data.score;
    this.session_id = data.session_id;

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

  public getSoundPlayer(): AppSound {

    return this._sound;
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

  private dismissStaticLoader(): void{
    // remove loader
    document.getElementById('loading').classList.remove('active');
  }

}
export const app = new App();