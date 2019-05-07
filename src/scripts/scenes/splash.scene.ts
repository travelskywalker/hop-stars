import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { Subscription } from 'rxjs/Subscription';
import { SpriteActor } from '@src/core/sprite.actor';
import { SpriteAnimatedActor } from '@src/core/sprite.animated.actor';
import { LeaderboardModal } from './../components/leaderboard.modal';
import { HowtowinModal } from './../components/howtowin.modal';
export class SplashScene extends Scene {

  state_subscription: Subscription;

  lmodal: LeaderboardModal;
  howtomodal: HowtowinModal;
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
  logo: SpriteActor;
  closeBtn: SpriteActor;
  // buttons
  play_btn: SpriteActor;
  sound_btn: SpriteAnimatedActor;
  // sound_btn: SpriteActor;
  leaderboard_btn: SpriteActor;
  howtowin_btn: SpriteActor;
  // closeBtnStyle: PIXI.TextStyle;
  // closeBtn: PIXI.Text;

  // Texts
  copyText1: PIXI.Text;
  copyText1Style: PIXI.TextStyle;

  // dummy score data
  data = {
    best_score: this.app.getState().getBestScore(),
    current_score: 0
  };  

  // timespent
  timeStart: any;

  init(): void {

  }

  start(): void {

    this.timeStart = Date.now();

    this.data.best_score = this.app.getState().getBestScore();
    
    // initialize and set bg
    this.bg = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.jpg');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.bg.setScaleUpToScreenPercHeight(1);
    this.addChild(this.bg);

    this.closeBtn =  new SpriteActor('exit_button', this.app, 'common', 'x_btn.png');
    this.closeBtn.setAnchor(0, 0);
    this.closeBtn.setPosition(this.app.getScreenSize().w * .92, this.app.getScreenSize().h * .02);
    this.closeBtn.setScaleUpToScreenPercWidth(.0625);
    this.closeBtn.getSprite().interactive = true;
    this.closeBtn.getSprite().on('pointerup', () => {
      this.app.getSoundPlayer().play('button'); 
     this.app.getState().gameCancelled();
    });
    this.addChild(this.closeBtn);

    // initialize and set logo
    this.logo = new SpriteActor('logo', this.app, 'common', 'hophop_logo.png');
    this.logo.setAnchor(0.5, 0.5);
    this.logo.setPosition(this.app.getScreenSize().w * 0.5, this.app.getScreenSize().h * 0.25);
    // this.logo.setScaleUpToScreenPercWidth(0.675);
    this.logo.setScaleUpToScreenPercWidth(.8);
    this.addChild(this.logo);

    // this.closeBtnStyle = new PIXI.TextStyle({
    //   fontFamily: 'Arial',
    //   fontSize: `79px`,
    //   fontStyle: 'bold',
    //   fontWeight: 'bold',
    //   fill: ['#540a6f'],
    //   wordWrap: false,
    //   dropShadow: false,
    //   dropShadowAngle: 12,
    //   dropShadowBlur: 6,
    //   dropShadowColor: 0x6e706f,
    //   dropShadowDistance: 0,
    //   padding: 15
    // });
    // this.closeBtn = new PIXI.Text(`X`, this.closeBtnStyle);
    // this.closeBtn.anchor.set(0,0);
    // this.closeBtn.position.set(this.app.getScreenSize().w * .92, this.app.getScreenSize().h * .02);
    // this.closeBtn.interactive = true;
    // this.closeBtn.on('pointerup', () => {
    //    this.app.getSoundPlayer().play('button'); 
    //    this.app.getState().gameCancelled();
    // });
    // this.container.addChild(this.closeBtn);

      // TEXTS 
    // initialize and set text copy 1
    this.copyText1Style = new PIXI.TextStyle({
      fontFamily: 'Chennai-Bold',
      fontSize: `${this.logo.getSprite().height * .15}px`,
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
   
    this.copyText1 = new PIXI.Text(`BEST SCORE: ${this.data.best_score}`, this.copyText1Style);
    this.copyText1.anchor.x = .5;
    this.copyText1.anchor.y = .5;
    this.copyText1.position.x = this.app.getScreenSize().w * 0.5;
    this.copyText1.position.y = this.logo.getSprite().position.y + ((this.logo.getSprite().height /2) + this.copyText1.height);
    this.container.addChild(this.copyText1);  

    // initialize and set play button
    this.play_btn = new SpriteActor('play', this.app, 'common', 'start_btn.png');
    this.play_btn.setAnchor(0.5, 0);
    this.play_btn.setPosition(this.logo.getSprite().position.x, this.copyText1.position.y + (this.copyText1.height * 2));
    this.play_btn.setScaleUpToScreenPercWidth(.315);
    this.play_btn.getSprite().interactive = true;
    this.play_btn.getSprite().on('pointerup', () => { 
      console.log('go to instruction screen scene ');
      this.app.getSoundPlayer().play('button');
      setTimeout(() => { this.app.goToScene(2); }, 200);
    });
    this.addChild(this.play_btn);


    this.sound_btn = new SpriteAnimatedActor('volume', this.app);
    this.sound_btn.addAnimation('common', 'volume');
    this.sound_btn.getAnimatedSprite().gotoAndStop(this.app.getState().state.volume);
    this.sound_btn.setAnchor(0.5, 0.5);
    this.sound_btn.setPosition(this.app.getScreenSize().w * 0.25, this.app.getScreenSize().h * .875);
    this.sound_btn.setScaleUpToScreenPercWidth(.25);
    this.sound_btn.getAnimatedSprite().interactive = true;
    // toggle image on and off
    this.sound_btn.getAnimatedSprite().on('pointerup', () => { 
      this.app.getSoundPlayer().play('button');
      this.app.getState().toggle_volume();  
      this.sound_btn.getAnimatedSprite().gotoAndStop(this.app.getState().state.volume);
      console.log("sound on/off");
    });
    this.addChild(this.sound_btn);

    // this.sound_btn = new SpriteActor('volume_on', this.app, 'common', 'volume_on.png');
    // this.sound_btn.setAnchor(0.5, 0.5);
    // this.sound_btn.setPosition(this.app.getScreenSize().w * 0.25, this.app.getScreenSize().h * .875);
    // this.sound_btn.setScaleUpToScreenPercWidth(.25);

    // this.addChild(this.sound_btn);

    // initialize and set leaderboard_btn button
    this.leaderboard_btn = new SpriteActor('leaderboard_btn', this.app, 'common', 'leaderboard_btn.png');
    this.leaderboard_btn.setAnchor(0.5, 0.5);
    this.leaderboard_btn.setPosition(this.sound_btn.getAnimatedSprite().position.x + (this.sound_btn.getAnimatedSprite().width * 1), this.sound_btn.getAnimatedSprite().position.y);
    this.leaderboard_btn.setScaleUpToScreenPercWidth(.25);
    this.leaderboard_btn.getSprite().interactive = true;
    this.leaderboard_btn.getSprite().on('pointerup', () => { 
      console.log('show leaderboard scene');
      this.app.getSoundPlayer().play('button');
      // for modal
      this.lmodal = new LeaderboardModal({app: this.app, var: this.dummy_data});
      this.container.addChild(this.lmodal);
      
    });
    this.addChild(this.leaderboard_btn);

    // initialize and set mechanic_btn button
    this.howtowin_btn = new SpriteActor('howtowin_btn', this.app, 'common', 'howtowin_btn.png');
    this.howtowin_btn.setAnchor(0.5, 0.5);
    this.howtowin_btn.setPosition(this.leaderboard_btn.getSprite().position.x + (this.leaderboard_btn.getSprite().width * 1), this.leaderboard_btn.getSprite().position.y);
    this.howtowin_btn.setScaleUpToScreenPercWidth(.25);
    this.howtowin_btn.getSprite().interactive = true;
    this.howtowin_btn.getSprite().on('pointerup', () => { 
      console.log('show howtowin modal');
      this.app.getSoundPlayer().play('button');
      // this.app.goToScene(3);
      // modal
      this.howtomodal = new HowtowinModal({app: this.app});
      this.container.addChild(this.howtomodal);
      
    });
    this.addChild(this.howtowin_btn);


    this.state_subscription = this.app.getState().subscribe((state: IAppState) => {
      this.sound_btn.getAnimatedSprite().gotoAndStop(state.volume);
    });
  }

  update(_delta: number): void {

  }

  remove(): void {
    this.container.removeChildren();

    let timespent = {
      screen: "main_menu",
      timestart:this.timeStart,
      timeend: Date.now()
    }

    this.app.getState().timeSpent(timespent);

  }

}