import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';
import { SpriteAnimatedActor } from '@src/core/sprite.animated.actor';

export class GameOverScene extends Scene {

  // bg
  bg: SpriteActor;

  // logo
  gameOverLogo: SpriteActor;
 
  // buttons
  play_again_btn: SpriteActor;
  sound_btn: SpriteAnimatedActor;
  leaderboard_btn: SpriteActor;

  init(): void {

  }

  start(): void {
    // initialize and set bg
    this.bg = new SpriteActor('gameover-bg', this.app, 'common', 'GAMEOVER_layover.png');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.addChild(this.bg);

    // initialize and set logo
    this.gameOverLogo = new SpriteActor('gameover-logo', this.app, 'common', 'GAMEOVER.png');
    this.gameOverLogo.setAnchor(0.5, 0.5);
    this.gameOverLogo.setPosition(this.app.getScreenSize().w * 0.5, this.app.getScreenSize().h * 0.25);
    this.gameOverLogo.setScaleUpToScreenPercWidth(0.675);
    this.addChild(this.gameOverLogo);


    this.sound_btn = new SpriteAnimatedActor('volume', this.app);
    this.sound_btn.addAnimation('common', 'volume');
    this.sound_btn.getAnimatedSprite().gotoAndStop(this.app.getState().state.volume);
    this.sound_btn.setAnchor(0.5, 0.5);
    this.sound_btn.setPosition(this.app.getScreenSize().w * 0.25, this.app.getScreenSize().h * .875);
    this.sound_btn.setScaleUpToScreenPercWidth(0.25);
    this.sound_btn.getAnimatedSprite().interactive = true;
    // toggle image on and off
    this.sound_btn.getAnimatedSprite().on('pointerup', () => { 
      this.app.getState().toggle_volume();  
      this.sound_btn.getAnimatedSprite().gotoAndStop(this.app.getState().state.volume);
      console.log("sound on/off");
    });
    this.addChild(this.sound_btn);

     // initialize and set play button
     this.play_again_btn = new SpriteActor('play-again', this.app, 'common', 'restart_btn.png');
     this.play_again_btn.setAnchor(0.5, 0.5);
     this.play_again_btn.setPosition(this.sound_btn.getAnimatedSprite().position.x + (this.sound_btn.getAnimatedSprite().width * 1.1), this.sound_btn.getAnimatedSprite().position.y - (this.play_again_btn.getSprite().height * .7));
     this.play_again_btn.setScaleUpToScreenPercWidth(.275);
     this.play_again_btn.getSprite().interactive = true;
     this.play_again_btn.getSprite().on('pointerup', () => { 
       console.log('go to instruction screen scene ');
       setTimeout(() => { this.app.goToScene(2); }, 200);
     });
     this.addChild(this.play_again_btn);   

    // initialize and set leaderboard_btn button
    this.leaderboard_btn = new SpriteActor('leaderboard_btn', this.app, 'common', 'leaderboard_btn.png');
    this.leaderboard_btn.setAnchor(0.5, 0.5);
    this.leaderboard_btn.setPosition(this.play_again_btn.getSprite().position.x + (this.play_again_btn.getSprite().width * 1), this.sound_btn.getAnimatedSprite().position.y);
    this.leaderboard_btn.setScaleUpToScreenPercWidth(.25);
    this.leaderboard_btn.getSprite().interactive = true;
    this.leaderboard_btn.getSprite().on('pointerup', () => { 
      console.log('show leaderboard scene');
    });
    this.addChild(this.leaderboard_btn);

  }

  update(_delta: number): void {

  }

  remove(): void {

  }

}