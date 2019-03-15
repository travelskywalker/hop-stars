import { App } from '@src/app';
import { Scene } from '@src/core/scene';

// scenes to include
import { GameScene } from '@src/scripts/scenes/game.scene';

export function scenesProvider(_app: App, _scenes: Scene[]): void {

    // register scenes, the first will be the one that's active on start
    _scenes.push(new GameScene(_app));
}