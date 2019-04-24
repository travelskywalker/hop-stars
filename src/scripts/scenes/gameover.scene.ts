import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';
import { Graphics, Container } from 'pixi.js';
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

  // container
  bottomContainer: Container;
  score_container: Graphics;

  // bg
  bg: SpriteActor;

  // coin
  coin: SpriteActor;
 
  // buttons
  play_again_btn: SpriteActor;
  home_btn: SpriteActor;
  leaderboard_btn: SpriteActor;

  // Texts
  gameOverLogo: PIXI.Text;
  gameOverLogoStyle: PIXI.TextStyle;
  copyText1: PIXI.Text;
  copyText1Style: PIXI.TextStyle;
  copyText2: PIXI.Text;
  copyText2Style: PIXI.TextStyle;

  // animation
  animatingTop: boolean = false;
  animatingBottom: boolean = false;
  topAnimationStart: number = -(this.app.getScreenSize().h * 0.25);
  bottomAnimationStart: number = this.app.getScreenSize().h/2;

  // dummy score data
  data = {
    best_score: 0,
    current_score: this.app.currentScore
  };

  init(): void {
    
  }

  animateTop(){
    if(this.animatingTop == true) return;
    
    if(this.topAnimationStart <= this.app.getScreenSize().h * 0.25){
      this.container.addChild(this.gameOverLogo);
      this.container.addChild(this.copyText1);
      this.container.addChild(this.score_container);

      this.gameOverLogo.y = this.topAnimationStart += 35;
      this.copyText1.y = this.gameOverLogo.position.y + ((this.gameOverLogo.height / 2) + this.copyText1.height);
      this.score_container.y = this.copyText1.position.y + this.copyText1.height;
    }else{

      this.animatingTop = true;
      this.topAnimationStart = -(this.app.getScreenSize().h * 0.25);
    }
  }

  animateBottom(){
    if(this.animatingBottom == true) return;
    
    if(this.bottomAnimationStart >= 0){

      this.container.addChild(this.bottomContainer);
      this.bottomContainer.y = this.bottomAnimationStart -= 35;
    }else{

      this.animatingBottom = true;
      this.bottomAnimationStart = this.app.getScreenSize().h/2;
    }
  }

  start(): void {
    // send data 
    this.app.getState().submitScore(this.app.currentScore);
    this.animatingTop = false;
    this.animatingBottom = false;
    // event | gameend
    let event = {
      event: "end",
      session_id: this.app.session_id,
      score: this.app.currentScore
      }
    this.app.getState().eventStarted(event);

    // initialize and set bg
    this.bg = new SpriteActor('gameover-bg', this.app, 'common', 'GAMEOVER_layover.png');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.bg.setScaleUpToScreenPercHeight(1);
    this.addChild(this.bg);

    // initialize and set logo
    this.gameOverLogoStyle = new PIXI.TextStyle({
      fontFamily: 'Chennai-Bold',
      fontSize: `${this.app.getScreenSize().h * .13}px`,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fill: ['#fc84a9'],
      align: 'center',
      wordWrap: false,
      dropShadow: true,
      dropShadowAngle: 12,
      dropShadowBlur: 15,
      dropShadowColor: 0x072e49,
      dropShadowDistance: 0,
      padding: 5,
      lineHeight: this.app.getScreenSize().h * .11
    });
    const gotext = `GAME
OVER`;
    this.gameOverLogo = new PIXI.Text(gotext, this.gameOverLogoStyle);
    this.gameOverLogo.anchor.set(.5, .5);
    this.gameOverLogo.position.x = this.app.getScreenSize().w * 0.5;
    this.gameOverLogo.position.y = this.app.getScreenSize().h * 0.25;
    // this.gameOverLogo.setScaleUpToScreenPercWidth(0.675)

    // TEXTS 
    // initialize and set text copy 1
    this.copyText1Style = new PIXI.TextStyle({
      fontFamily: 'Chennai-Bold',
      fontSize: `${this.gameOverLogo.height * .105}px`,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fill: ['#ffffff'],
      wordWrap: false,
      dropShadow: true,
      dropShadowAngle: 12,
      dropShadowBlur: 6,
      dropShadowColor: 0x6e706f,
      dropShadowDistance: 0,
      padding: 15
    });
   
    this.copyText1 = new PIXI.Text(`BEST SCORE: ${this.app.getState().getBestScore()}`, this.copyText1Style);
    this.copyText1.anchor.x = .5;
    this.copyText1.anchor.y = .5;
    this.copyText1.position.x = this.app.getScreenSize().w * 0.5;
    this.copyText1.position.y = this.gameOverLogo.position.y + ((this.gameOverLogo.height / 2) + this.copyText1.height);

    // SCORE
    const scoreText = new PIXI.Text(
      `${this.app.currentScore}`,
      {
        fontFamily: 'Chennai-Bold',
        fontSize: `${this.gameOverLogo.height * .5}px`,
        fill : 0Xffffff, 
        align : 'right',
        dropShadow: true,
        dropShadowAngle: 12,
        dropShadowBlur: 6,
        dropShadowColor: 0x6e706f,
        dropShadowDistance: 0,
        padding: 15
      });
    scoreText.anchor.set(0 , 0);

    // COIN
    const score_coin = new SpriteActor('ball', this.app, 'common', 'coin.png');
    score_coin.setAnchor(0, 0);
    score_coin.getSprite().position.x = scoreText.width + score_coin.getSprite().width * 0.4;
    score_coin.getSprite().position.y = scoreText.position.y + scoreText.height / 3;
    score_coin.setScaleUpToScreenPercWidth(0.115);

    this.score_container = new Graphics();
    this.score_container.beginFill(0xF2F2F2, 0);
    this.score_container.drawRect(0, 0, scoreText.width + score_coin.getSprite().width * 1.2, this.app.getScreenSize().h * 0.175);
    this.score_container.endFill();
    this.score_container.position.x = this.app.getScreenSize().w / 2 - this.score_container.width / 2;

    this.score_container.addChild(scoreText);
    this.score_container.addChild(score_coin.getSprite());

    this.bottomContainer = new Container();

    // sound button
    this.home_btn = new SpriteActor('home', this.app, 'lvl1', 'home.png');
    this.home_btn.setAnchor(0.5, 0.5);
    this.home_btn.setPosition(this.app.getScreenSize().w * 0.25, this.app.getScreenSize().h * .875);
    this.home_btn.setScaleUpToScreenPercWidth(0.25);
    setTimeout( () => this.home_btn.getSprite().interactive = true, 500);
    // toggle image on and off
    this.home_btn.getSprite().on('pointerup', () => { 
    //   this.app.getState().toggle_volume();  
    //   this.home_btn.getAnimatedSprite().gotoAndStop(this.app.getState().state.volume);
      console.log("go home");
      this.app.goToScene(0);
    });
    this.bottomContainer.addChild(this.home_btn.getSprite());
     // initialize and set play button
     this.play_again_btn = new SpriteActor('play-again', this.app, 'common', 'restart_btn.png');
     this.play_again_btn.setAnchor(0.5, 0.5);
     this.play_again_btn.setPosition(
       this.app.getScreenSize().w / 2, 
       this.home_btn.getSprite().position.y - this.play_again_btn.getSprite().height/3);
     this.play_again_btn.setScaleUpToScreenPercWidth(.275);
     setTimeout( () => this.play_again_btn.getSprite().interactive = true, 500);
     this.play_again_btn.getSprite().on('pointerup', () => { 
       console.log('go to instruction screen scene ');
       setTimeout(() => { this.app.goToScene(2); }, 200);
     });
    this.bottomContainer.addChild(this.play_again_btn.getSprite());

    // initialize and set leaderboard_btn button
    this.leaderboard_btn = new SpriteActor('leaderboard_btn', this.app, 'common', 'leaderboard_btn.png');
    this.leaderboard_btn.setAnchor(0.5, 0.5);
    this.leaderboard_btn.setPosition(this.play_again_btn.getSprite().position.x + (this.play_again_btn.getSprite().width * 1), this.home_btn.getSprite().position.y);
    this.leaderboard_btn.setScaleUpToScreenPercWidth(.25);
    setTimeout( () => this.leaderboard_btn.getSprite().interactive = true, 500);
    this.leaderboard_btn.getSprite().on('pointerup', () => { 
      console.log('show leaderboard scene');
          // for modal
          this.lmodal = new LeaderboardModal({app: this.app, var: this.dummy_data});
          this.container.addChild(this.lmodal);
    });
    this.bottomContainer.addChild(this.leaderboard_btn.getSprite());

  }

  update(_delta: number): void {
    this.animateTop();
    this.animateBottom();
  }

  remove(): void {
    this.container.removeChildren();
  }

}