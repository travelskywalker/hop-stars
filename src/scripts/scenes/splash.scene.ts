import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';
import { SpriteAnimatedActor } from '@src/core/sprite.animated.actor';

export class SplashScene extends Scene {

  // bg
  bg: SpriteActor;

  // logo
  logo: SpriteActor;
 
  // buttons
  play_btn: SpriteActor;
  sound_btn: SpriteAnimatedActor;
  leaderboard_btn: SpriteActor;
  howtowin_btn: SpriteActor;




  init(): void {

    // initialize and set bg
    this.bg = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.png');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.addChild(this.bg);

    // initialize and set logo
    this.logo = new SpriteActor('logo', this.app, 'common', 'hophop_logo.png');
    this.logo.setAnchor(0.5, 0.5);
    this.logo.setPosition(this.app.getScreenSize().w * 0.5, this.app.getScreenSize().h * 0.25);
    this.logo.setScaleUpToScreenPercWidth(0.675);
    this.addChild(this.logo);

    // initialize and set play button
    this.play_btn = new SpriteActor('play', this.app, 'common', 'start_btn.png');
    this.play_btn.setAnchor(0.5, 0.5);
    this.play_btn.setPosition(this.logo.getSprite().position.x, this.logo.getSprite().position.y + (this.logo.getSprite().height * 0.7));
    this.play_btn.setScaleUpToScreenPercWidth(.375);
    this.addChild(this.play_btn);


    this.sound_btn = new SpriteAnimatedActor('volume', this.app);
    this.sound_btn.addAnimation('common', 'volume');
    this.sound_btn.getAnimatedSprite().gotoAndStop(this.app.getState().state.volume);
    this.sound_btn.setAnchor(0.5, 0.5);
    this.sound_btn.setPosition(this.app.getScreenSize().w * 0.25, this.app.getScreenSize().h * .875);
    this.sound_btn.setScaleUpToScreenPercWidth(0.25);
    this.sound_btn.getAnimatedSprite().interactive = true;
    this.sound_btn.getAnimatedSprite().on('pointerup', () => { console.log('leve'); this.app.getState().toggle_volume(); });
    this.addChild(this.sound_btn);


    // initialize and set sound button
    // this.sound_on_btn = new SpriteActor('volume_on', this.app, 'common', 'volume_on.png');
    // this.sound_off_btn = new SpriteActor('volume_off', this.app, 'common', 'volume_off.png');
    // this.sound_off_btn.setAnchor(0.5, 0.5);
    // this.sound_off_btn.setPosition(this.app.getScreenSize().w * 0.25, this.app.getScreenSize().h * .875);
    // this.sound_off_btn.setScaleUpToScreenPercWidth(.25);
    // this.sound_off_btn.getSprite().interactive = true;
    // this.addChild(this.sound_off_btn);
    


    // initialize and set leaderboard_btn button
    this.leaderboard_btn = new SpriteActor('leaderboard_btn', this.app, 'common', 'leaderboard_btn.png');
    this.leaderboard_btn.setAnchor(0.5, 0.5);
    this.leaderboard_btn.setPosition(this.sound_btn.getAnimatedSprite().position.x + (this.sound_btn.getAnimatedSprite().width * 1), this.sound_btn.getAnimatedSprite().position.y);
    this.leaderboard_btn.setScaleUpToScreenPercWidth(.25);
    this.addChild(this.leaderboard_btn);

    // initialize and set mechanic_btn button
    this.howtowin_btn = new SpriteActor('howtowin_btn', this.app, 'common', 'howtowin_btn.png');
    this.howtowin_btn.setAnchor(0.5, 0.5);
    this.howtowin_btn.setPosition(this.leaderboard_btn.getSprite().position.x + (this.leaderboard_btn.getSprite().width * 1), this.leaderboard_btn.getSprite().position.y);
    this.howtowin_btn.setScaleUpToScreenPercWidth(.25);
    this.addChild(this.howtowin_btn);

    
  }

  start(): void {
    // var textureButtonDown = PIXI.Texture.fromImage(`${this.sound_on_btn}`);
    // var textureButtonOver = PIXI.Texture.fromImage('examples/assets/button_over.png');

    // this.sound_off_btn.getSprite().on('pointerdown', function(){
    //     console.log('levy')

    // })
  }

  update(_delta: number): void {

  }

  remove(): void {

  }

}