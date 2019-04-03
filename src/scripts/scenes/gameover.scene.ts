import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';
import { SpriteAnimatedActor } from '@src/core/sprite.animated.actor';
import { Graphics } from 'pixi.js';
import { LeaderboardModal } from './../components/leaderboard.modal';
import { GameScene } from '@src/scripts/scenes/game.scene';

export class GameOverScene extends Scene {

  lmodal: LeaderboardModal;
  // Dummy data for testing
  dummy_data:object = { 
      alltime: [
        {
          name: 'Sander',
          score: '2500',
          prize: 'P5000',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '250',
          prize: 'P3000',
          user_id: 99992,
        },
        {
          name: 'Lei',
          score: '250',
          prize: 'P1000',
          user_id: 99991,
        },
        {
          name: 'Edric',
          score: '250',
          prize: 'P100',
          user_id: 99992,
        },
        {
          name: 'Ben',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P100',
          user_id: 99992,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P100',
          user_id: 99992,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P50',
          user_id: 99992,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P50',
          user_id: 99992,
        }
      ],
      weekly: [
        {
          name: 'Alben',
          score: '2500',
          prize: 'P5000',
          user_id: 99991,
        },
        {
          name: 'Levy',
          score: '250',
          prize: 'P3000',
          user_id: 99991,
        },
        {
          name: 'Sander',
          score: '25',
          prize: 'P1000',
          user_id: 99991,
        },
        {
          name: 'Edric',
          score: '25',
          prize: 'P100',
          user_id: 99992,
        },
        {
          name: 'Ben',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P100',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P100',
          user_id: 99992,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        },
        {
          name: 'Alben',
          score: '25',
          prize: 'P50',
          user_id: 99991,
        }
      ]
  };

  // bg
  bg: SpriteActor;

  // logo
  gameOverLogo: SpriteActor;

  // coin
  coin: SpriteActor;
 
  // buttons
  play_again_btn: SpriteActor;
  sound_btn: SpriteAnimatedActor;
  leaderboard_btn: SpriteActor;

  // Texts
  copyText1: PIXI.Text;
  copyText1Style: PIXI.TextStyle;
  copyText2: PIXI.Text;
  copyText2Style: PIXI.TextStyle;

  // dummy score data
  data = {
    best_score: 0,
    current_score: this.app.currentScore
  };

  init(): void {
    
  }

  start(): void {
    // submit score data
    this.app.getState().submitScore(this.app.currentScore);

    // initialize and set bg
    this.bg = new SpriteActor('gameover-bg', this.app, 'common', 'GAMEOVER_layover.png');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.bg.setScaleUpToScreenPercHeight(1);
    this.addChild(this.bg);

    // initialize and set logo
    this.gameOverLogo = new SpriteActor('gameover-logo', this.app, 'common', 'GAMEOVER.png');
    this.gameOverLogo.setAnchor(0.5, 0.5);
    this.gameOverLogo.setPosition(this.app.getScreenSize().w * 0.5, this.app.getScreenSize().h * 0.25);
    this.gameOverLogo.setScaleUpToScreenPercWidth(0.675);
    this.addChild(this.gameOverLogo);

    
    // TEXTS 
    // initialize and set text copy 1
    this.copyText1Style = new PIXI.TextStyle({
      fontFamily: 'Chennai-Bold',
      fontSize: `${this.gameOverLogo.getSprite().height * .105}px`,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fill: ['#ffffff'],
      wordWrap: false
    });
   
    this.copyText1 = new PIXI.Text(`BEST SCORE: ${this.app.getState().getBestScore()}`, this.copyText1Style);
    this.copyText1.anchor.x = .5;
    this.copyText1.anchor.y = .5;
    this.copyText1.position.x = this.app.getScreenSize().w * 0.5;
    this.copyText1.position.y = this.gameOverLogo.getSprite().position.y + ((this.gameOverLogo.getSprite().height / 2) + this.copyText1.height);
    this.container.addChild(this.copyText1);

    // SCORE
    const scoreText = new PIXI.Text(
      `${this.app.currentScore}`,
      {
        fontFamily: 'Chennai-Bold',
        fontSize: `${this.gameOverLogo.getSprite().height * .5}px`,
        fill : 0Xffffff, 
        align : 'right',
      });
    scoreText.anchor.set(0 , 0);

    // COIN
    const score_coin = new SpriteActor('ball', this.app, 'common', 'coin.png');
    score_coin.setAnchor(0, 0);
    score_coin.getSprite().position.x = scoreText.width + score_coin.getSprite().width * 0.4;
    score_coin.getSprite().position.y = scoreText.position.y + scoreText.height / 3;
    score_coin.setScaleUpToScreenPercWidth(0.115);

    const score_container = new Graphics();
    score_container.beginFill(0xF2F2F2, 0);
    score_container.drawRect(0, 0, scoreText.width + score_coin.getSprite().width * 1.2, this.app.getScreenSize().h * 0.175);
    score_container.endFill();
    score_container.position.x = this.app.getScreenSize().w / 2 - score_container.width / 2;
    score_container.position.y = this.copyText1.position.y + this.copyText1.height;
    this.container.addChild(score_container);

    score_container.addChild(scoreText);
    score_container.addChild(score_coin.getSprite());

    // sound button
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
          // for modal
          this.lmodal = new LeaderboardModal({app: this.app, var: this.dummy_data});
          this.container.addChild(this.lmodal);
    });
    this.addChild(this.leaderboard_btn);

  }

  update(_delta: number): void {

  }

  remove(): void {
    this.container.removeChildren();
  }

}