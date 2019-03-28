import { App } from '@src/app';
import { Scene } from '@src/core/scene';

// scenes to include
import { SplashScene } from '@src/scripts/scenes/splash.scene';
import { InstructionScene } from '@src/scripts/scenes/instruction.scene';
import { GameScene } from '@src/scripts/scenes/game.scene';
import { HowtowinScene } from '@src/scripts/scenes/howtowin.scene';

export function scenesProvider(_app: App, _scenes: Scene[]): void {

    // register scenes, the first will be the one that's active on start
    _scenes.push(new SplashScene(_app));
    _scenes.push(new InstructionScene(_app));
    _scenes.push(new GameScene(_app));
    _scenes.push(new HowtowinScene(_app));
}