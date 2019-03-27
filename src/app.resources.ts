import * as PIXI from 'pixi.js';
import { App } from '@src/app';

export function resourcesProvider(_app: App, loaded: (resources: any) => void, progress?: (percent: number) => void): void {

  // use pixi loader
  const loader = PIXI.loader;
  const loader_resolution = window.devicePixelRatio >= 2 ? '@2x' : '@1x';
  loader.concurrency = 1;

  // add assets
  // loader.add('barmaid', `./assets/barmaid${loader_resolution}.json`);
  loader.add('common', `./assets/spritesheet-common.json`);
  loader.add('lvl1', `./assets/hop-game-level-1.json`);
  loader.add('lvl2', `./assets/hop-game-level-2.json`);
  loader.add('lvl3', `./assets/hop-game-level-3.json`);

  // start loading resources
  loader.load((_loader: any, resources: any) => {

    // provide loaded textures
    loaded(resources);
  });

  loader.on('progress', (_loader, res) => {

    // update progress in ui
    progress(Math.min(Math.ceil(loader.progress), 99));
  });

}