import { Scene } from '@src/core/scene';
import { SpriteActor } from '@src/core/sprite.actor';
import { Graphics } from 'pixi.js';
// import { bgColor, fontFamily } from '@src/app.config';
// import { statsModal } from '../components/stats.component';

export class LeaderboardScene extends Scene {

  // bg
  bg: SpriteActor;
  leaderboard_bg: Graphics;
  tab_nav_container: Graphics;

  // profile
  profile_container: PIXI.Graphics[] = [];
  
  // font
  fontFamily = 'Chennai-Bold';

  // scrollable points
  initialPoint: any;
  finalPoint: any;

  // Dummy data for testing
  dummy_data = 
    { 
      alltime: [
        {
          name: 'Sander',
          score: '25',
          prize: '1000',
          user_id: 99991,
        },
        {
          name: 'Sander',
          score: '25',
          prize: '1000',
          user_id: 99992,
        },
      ],
      weekly: [
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99992,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      },
      {
        name: 'Alben',
        score: '25',
        prize: '1000',
        user_id: 99991,
      }
    ]};

  init(): void {

  }

  start(): void {

    // initialize and set bg color via drawing shapes
    this.bg = new SpriteActor('lboared-bg', this.app, 'common', 'leaderbord_bg.png');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.bg.getSprite().interactive = true;
    this.addChild(this.bg);
    
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
    
    // weekly
    const weekly = new PIXI.Text(`WEEKLY`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.tab_nav_container.height * 0.35}px`,
      fill: 0XFFFFFF,
      align: 'center',
    });
    weekly.anchor.set(0, 0);
    weekly.position.x = (this.tab_nav_container.width / 4) - (weekly.width / 2);
    weekly.position.y = weekly.height * .5;
    weekly.interactive = true;
    

    // alltime
    const alltime = new PIXI.Text(`ALL TIME`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.tab_nav_container.height * 0.35}px`,
      fill: 0XFFFFFF,
      align: 'center',
    });
    alltime.anchor.set(0, 0);
    alltime.position.x = this.tab_nav_container.width * 0.75 - alltime.width * 0.5;
    alltime.position.y = weekly.position.y;
    alltime.interactive = true;
   
    // alltime
    const seperatorBar = new PIXI.Text(`|`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.tab_nav_container.height * .35}px`,
      fill: 0XFFFFFF,
      align: 'center',
    });
    seperatorBar.anchor.set(0, 0);
    seperatorBar.position.x = this.tab_nav_container.width * 0.5;
    seperatorBar.position.y = weekly.position.y;

    // add to nav container
    this.leaderboard_bg.addChild(this.tab_nav_container);
    this.tab_nav_container.addChild(weekly);
    this.tab_nav_container.addChild(alltime);
    this.tab_nav_container.addChild(seperatorBar);


// RENDER LEADERBOARD DATA
    // Initial leaderboard data
    const data = this.dummy_data.weekly;

    this.render_leaderboard(data);
    weekly.on('pointerup', () => { 
      const data = this.dummy_data.weekly;
      this.render_leaderboard(data);
    });
    alltime.on('pointerup', () => { 
      const data = this.dummy_data.alltime;
      this.render_leaderboard(data);
    });   
    
    this.container.addChild(this.leaderboard_bg);
  }

  update(_delta: number): void {

  }

  remove(): void {

  }

  private render_leaderboard(data: any) {
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
      const avatar = new SpriteActor('profile_image', this.app, 'common', 'profile-avatar.png');
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
        fontSize: `${user_details.height * 0.4}px`,
        fill: 0x744395,
        align: 'center',
      });
      player_name.anchor.set(0, 0);
      user_details.addChild(player_name);

      // player points
      const player_points = new PIXI.Text(`${data[x].score} pts.`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.4}px`,
        fill: 0XFFFFFF,
        align: 'center',
      });
      player_points.anchor.set(0, 0);
      player_points.position.y = user_details.height - player_points.height;
      user_details.addChild(player_points);

      // rewards
      const rewards = new PIXI.Graphics();  
      rewards.beginFill(0xbe388e, 1);
      rewards.drawRoundedRect(0, 0, this.profile_container[x].width * 0.2, this.profile_container[x].height * 0.45, 35);
      rewards.endFill();
      rewards.position.x = this.profile_container[x].width - rewards.width;
      rewards.position.y = this.profile_container[x].height * 0.5 - rewards.height * 0.5;
      this.profile_container[x].addChild(rewards);
      // rewards text
      const rewards_text = new PIXI.Text(`${data[x].prize}`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.4}px`,
        fill: 0XFFFFFF,
        align: 'center',
      });
      rewards_text.position.y = rewards.height * 0.5 - rewards_text.height * 0.5;
      rewards_text.position.x = rewards.width * 0.5 - rewards_text.width * 0.5;
      rewards.addChild(rewards_text);

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
}