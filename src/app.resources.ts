import * as PIXI from 'pixi.js';
import { App } from '@src/app';
import * as WebFont from 'webfontloader';
import 'pixi-sound';

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
  loader.add('balls', `./assets/ball_sprites.json`);
  // sounds
  loader.add('ball_bounce', './assets/ball_bounce.{ogg,mp3}');
  loader.add('BGM_default', './assets/BGM_default.{ogg,mp3}');
  loader.add('button', './assets/button.{ogg,mp3}');
  loader.add('coin', './assets/coin.{ogg,mp3}');
  loader.add('BGM_S1', './assets/BGM_S1.{ogg,mp3}');
  loader.add('BGM_S2', './assets/BGM_S2.{ogg,mp3}');
  loader.add('BGM_S3', './assets/BGM_S3.{ogg,mp3}');
  loader.add('tile_1', './assets/tile_1.{ogg,mp3}');
  loader.add('tile_2', './assets/tile_2.{ogg,mp3}');
  loader.add('tile_3', './assets/tile_3.{ogg,mp3}');
  loader.add('tile_4', './assets/tile_4.{ogg,mp3}');
  loader.add('tile_5', './assets/tile_5.{ogg,mp3}');
  loader.add('tile_6', './assets/tile_6.{ogg,mp3}');
  loader.add('tile_7', './assets/tile_7.{ogg,mp3}');
  loader.add('tile_8', './assets/tile_8.{ogg,mp3}');
  
  // start loading resources
  loader.load((_loader: any, resources: any) => {
    WebFont.load({
      custom: {
        families: ['Chennai', 'Chennai-Bold'],
      },
      fontactive: (name, fvd) => {
        console.log(`Loading font files ${name}:${fvd}`);
      },
      active: () => {
        console.log('All font files loaded.');
        // provide loaded textures
        loaded(resources);
      },
      inactive: () => {
        console.error('Error loading fonts');
        // REPORT ERROR here
      },
    });
  });

  loader.on('progress', (_loader, res) => {

    // update progress in ui
    progress(Math.min(Math.ceil(loader.progress), 99));
  });

}