import { App, app } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';

export interface leaderboardData {
  app: App;
  var: any;
}

declare global { interface Window { Game: any; } }

interface JavaScriptInterface { 
  getLeaderboardData(): any;
}

declare var Android: JavaScriptInterface;

export class LeaderboardModal extends PIXI.Container {
  app: App;
  // bg
  bg_image: SpriteActor;
  leaderboard_bg: PIXI.Graphics;
  tab_nav_container: PIXI.Graphics;

  // profile
  profile_container: PIXI.Graphics[] = [];
  
  // font
  fontFamily = 'Chennai-Bold';

  // scrollable points
  initialPoint: any;
  finalPoint: any;
  // text
  weekly: PIXI.Text;
  alltime: PIXI.Text;
  // x btn
  // closeBtnStyle: PIXI.TextStyle;
  // closeBtn: PIXI.Text;
  closeBtn: SpriteActor;

  leaderboardData: any;

  is_weekly_active:boolean = true;

  // Dummy data for testing
  dummy_data:object =  [
      {
        name: 'Sander',
        score: '2500',
        prize: null,
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
    ];

  constructor(data: leaderboardData) {

    super();

    // expose function for android integration
    window.Game = {
      setLeaderboardData: (data: any) => {
        this.setLeaderboardData(data);
      }
    }

    this.app = data.app;
    this.leaderboardData = this.getLeaderboardData();

    console.log("show leaderboard modal");
  }

  private render_leaderboard() {

    let data = this.leaderboardData;
    for (let x = 0; x < data.length; x++) {

      // initialize and set bg color via drawing shapes
      this.profile_container[x] = new PIXI.Graphics();
      this.profile_container[x].beginFill(0X2E2D4B, 0);
      this.profile_container[x].drawRect(0, 0, this.app.getScreenSize().w * 0.9, this.app.getScreenSize().h * 0.12);
      this.profile_container[x].endFill();
      this.profile_container[x].position.x = this.app.getScreenSize().w * 0.5 - this.profile_container[x].width * 0.5;
      if (x !== 0) {
        this.profile_container[x].position.y = this.profile_container[x - 1].position.y + this.profile_container[x - 1].height;
      } else {
        this.profile_container[x].position.y = this.tab_nav_container.position.y + this.tab_nav_container.height;
      }

      this.leaderboard_bg.addChild(this.profile_container[x]);

      // player rank
      const rank = new PIXI.Text(`${x + 1}`, {
        fontFamily: this.fontFamily,
        fontSize: `${this.profile_container[x].height * 0.2}px`,
        fill: 0x744395,
        align: 'center',
      });
      rank.anchor.set(0, 0);
      rank.name = 'rank';
      rank.position.y = this.profile_container[x].height * 0.5 - rank.height * 0.5;
      rank.visible = true;
      this.profile_container[x].addChild(rank);

      // set player avatar
      const avatar = new SpriteActor('profile_image', this.app, 'leaderboard', 'profile-avatar.png');
      avatar.setScaleUpToScreenPercHeight(this.profile_container[x].height * 0.0002);
      avatar.setAnchor(0, 0);
      avatar.setPosition(
        this.profile_container[x].width * 0.08,
        this.profile_container[x].height * 0.5 - avatar.getSprite().height * 0.5);
      this.profile_container[x].addChild(avatar.getSprite());

      // initialize and set user details container
      const user_details = new PIXI.Graphics();
      user_details.beginFill(0X000000, 0);
      user_details.drawRect(0, 0, this.profile_container[x].width * 0.55, this.profile_container[x].height * 0.5);
      user_details.position.x = avatar.getSprite().width + avatar.getSprite().position.x + 20;
      user_details.position.y = this.profile_container[x].height * 0.5 - user_details.height * 0.5;
      user_details.endFill();
      this.profile_container[x].addChild(user_details);

      // player name
      const player_name = new PIXI.Text(`${data[x].name}`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.5}px`,
        fill: 0x744395,
        align: 'center',
      });
      player_name.anchor.set(0, 0);
      player_name.position.y = user_details.height * 0.5 - player_name.height * 0.5;
      player_name.position.x = 0
      user_details.addChild(player_name);

      // player points
      const player_points = new PIXI.Text(`${data[x].score} pts.`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.4}px`,
        fill: 0XFFFFFF,
        align: 'center',
      });

      // rewards
      const rewards = new PIXI.Graphics();  
      rewards.beginFill(0xbe388e, 0);
      rewards.drawRoundedRect(0, 0, this.profile_container[x].width * 0.2, this.profile_container[x].height * 0.45, 40);
      rewards.endFill();
      rewards.position.x = this.profile_container[x].width - rewards.width;
      rewards.position.y = this.profile_container[x].height * 0.5 - rewards.height * 0.5;
      
      // rewards text
      const rewards_text = new PIXI.Text(`${data[x].prize}`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.4}px`,
        fill: 0XFFFFFF,
        align: 'center',
      });

      player_points.position.y = rewards.height * 0.5 - rewards_text.height * 0.5;
      player_points.position.x = rewards.width * 0.5 - rewards_text.width * 0.5;

      // show rewards if prize is not null
      if(data[x].prize != null){
        this.profile_container[x].addChild(rewards);
        rewards.addChild(player_points);
      }

      // line break
      const breakline = new PIXI.Graphics();
      breakline.beginFill(0xf7cfdf, 1);
      breakline.drawRect(0, 0, this.profile_container[x].width, 2);
      breakline.endFill();
      breakline.position.x = 0;
      breakline.position.y = this.profile_container[x].height;
      this.profile_container[x].addChild(breakline);
    }
  }

  createLeaderboard() { 

    // initialize and set bg color via drawing shapes
    this.bg_image = new SpriteActor('leaderboard_bg', this.app, 'leaderboard', 'leaderbord_bg.png');
    this.bg_image.setAnchor(0, 0);
    this.bg_image.setPosition(0,0);
    this.bg_image.setScaleUpToScreenPercWidth(1);
    this.bg_image.setScaleUpToScreenPercHeight(1);
    this.addChild(this.bg_image.getSprite());
    
    // leaderboard container
    this.leaderboard_bg = new PIXI.Graphics();
    this.leaderboard_bg.beginFill(0x000000, 0);
    this.leaderboard_bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.leaderboard_bg.endFill();
    this.leaderboard_bg.interactive = true;

    this.leaderboard_bg.on('touchstart', (interactionData: PIXI.interaction.InteractionEvent) => {
        const point = interactionData.data.getLocalPosition(this.leaderboard_bg);
        this.initialPoint = point;
    });

    this.leaderboard_bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
        const point = interactionData.data.getLocalPosition(this.leaderboard_bg);
        this.leaderboard_bg.position.y =  Math.min(0, this.leaderboard_bg.position.y + point.y - this.initialPoint.y);
        this.leaderboard_bg.position.y = Math.max(this.leaderboard_bg.position.y, -(this.leaderboard_bg.height - this.app.getScreenSize().h));
    });

    // Leaderboard Title
    const Title = new PIXI.Text(`LEADERBOARD`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.app.getScreenSize().w * 0.08}px`,
      fill: 0XFFFFFF,
      align: 'center',
    });

    Title.anchor.set(0, 0);
    Title.position.x = this.app.getScreenSize().w * 0.5 - Title.width * 0.5;
    Title.position.y = this.app.getScreenSize().h * 0.02;
    this.leaderboard_bg.addChild(Title);

    // Leaderboard Navigation
    this.tab_nav_container = new PIXI.Graphics();
    this.tab_nav_container.beginFill(0x000000, 0);
    this.tab_nav_container.drawRect(0.5, 0.5, (this.app.getScreenSize().w ), this.app.getScreenSize().h * 0.06);
    this.tab_nav_container.endFill();
    this.tab_nav_container.position.x = (this.app.getScreenSize().w / 2 ) - (this.tab_nav_container.width / 2), - this.tab_nav_container.width * 0.5 ;
    this.tab_nav_container.position.y = Title.position.y + Title.height;
    this.tab_nav_container.visible = false; // show or hide nav bar
   
    
    // weekly
    this.weekly = new PIXI.Text(`WEEKLY`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.tab_nav_container.height * 0.35}px`,
      fill: (this.is_weekly_active) ? 0x744395 : 0xFFFFFF,
      align: 'center',
    });
    this.weekly.anchor.set(0, 0);
    this.weekly.position.x = (this.tab_nav_container.width / 4) - (this.weekly.width / 2);
    this.weekly.position.y = this.weekly.height * .5;
    this.weekly.interactive = true;
  
    // alltime
    this.alltime = new PIXI.Text(`ALL TIME`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.tab_nav_container.height * 0.35}px`,
      fill: 0XFFFFFF,
      align: 'center',
    });
    this.alltime.anchor.set(0, 0);
    this.alltime.position.x = this.tab_nav_container.width * 0.75 - this.alltime.width * 0.5;
    this.alltime.position.y = this.weekly.position.y;
    this.alltime.interactive = true;
   
    // alltime
    const seperatorBar = new PIXI.Text(`|`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.tab_nav_container.height * .35}px`,
      fill: 0XFFFFFF,
      align: 'center',
    });
    seperatorBar.anchor.set(0, 0);
    seperatorBar.position.x = this.tab_nav_container.width * 0.5;
    seperatorBar.position.y = this.weekly.position.y;

    // add to nav container
    this.leaderboard_bg.addChild(this.tab_nav_container);
    this.tab_nav_container.addChild(this.weekly);
    this.tab_nav_container.addChild(this.alltime);
    this.tab_nav_container.addChild(seperatorBar);

    this.closeBtn =  new SpriteActor('exit_button', this.app, 'common', 'x_btn.png');
    this.closeBtn.setAnchor(0, 0);
    this.closeBtn.setPosition(this.app.getScreenSize().w * .92, Title.position.y);
    this.closeBtn.setScaleUpToScreenPercWidth(.0625);
    this.closeBtn.getSprite().interactive = true;
    this.closeBtn.getSprite().on('pointerup', () => { 
     
      this.removeChild(this.leaderboard_bg);
      this.removeChild(this.bg_image.getSprite());
      this.removeChildren();
    });
    this.leaderboard_bg.addChild(this.closeBtn.getSprite());
    this.addChild(this.leaderboard_bg);
  }

  // LEADERBOARD
  public getLeaderboardData(){
    try{
      Android.getLeaderboardData();
    }catch(e){
      this.setLeaderboardData(this.dummy_data);
      console.log("leaderboard data from dummy data")
    }
  }

  public setLeaderboardData(data:any){

    this.createLeaderboard();
    this.leaderboardData = data;
    this.render_leaderboard();
  }
}