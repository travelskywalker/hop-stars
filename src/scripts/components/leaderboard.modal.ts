import { App, app } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';
import { Sprite } from 'pixi.js';

export interface leaderboardData {
  app: App;
  var: any;
}

declare global { interface Window { Game: any; } }

interface JavaScriptInterface { 
  getGameLeaderboardData(): any;
}

declare var Android: JavaScriptInterface;

export class LeaderboardModal extends PIXI.Container {
  app: App;
  sprite: PIXI.Sprite[] = [];
  // bg
  bg_image: SpriteActor;
  leaderboard_bg: PIXI.Graphics;
  tab_nav_container: PIXI.Graphics;

  // profile
  profile_float_container: PIXI.Graphics;
  profile_container: PIXI.Graphics[] = [];
  avatar_container: PIXI.Graphics[] = [];
  maskC: PIXI.Graphics[] = [];
  avatar: PIXI.Sprite[] = [];
  spriteAvatar: SpriteActor;

  avatarLoader: any;
  
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
  dummy_data:object =  {data:
    {all_time_rankings: [
      {
        name: 'Sander',
        avatar: null,
        self: false,
        rank: 1,
        score: '2500',
        prize: null,
      },
      {
        name: 'Alben',
        score: '250',
        avatar: './assets/binay.jpg',
        self: false,
        rank: 2,
        prize: 'P3000',
      },
      {
        name: 'Lei',
        score: '250',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkN5P3Y2RqmdgWDRLtrzQUcps7ZkHU4W63pW0kHjVs4vejeLH4',
        self: false,
        rank: 3,
        prize: 'P1000',
      },
      {
        name: 'Edric',
        score: '250',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNYjE7i_iyymMlwf3WRYU7WNKpe1pBbdlnr9G_CzylNL6yw7tP',
        self: false,
        rank: 4,
        prize: 'P100',
      },
      {
        name: 'Ben',
        score: '25',
        avatar: null,
        self: false,
        rank: 5,
        prize: 'P100',
      },
      {
        name: 'Mac',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXhnN-so2rLeUJJ2J4H4LXkR01oxLRA7wwEKWZrE2ycY6woW50',
        self: false,
        rank: 6,
        score: '25',
        prize: null,
      },
      {
        name: 'Book',
        score: '24',
        avatar: 'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE1ODA0OTcxOTEwODU4MjUz/bruno-mars-17162400-1-402.jpg',
        self: false,
        rank: 7,
        prize: 'P100',
      },
      {
        name: 'Pro',
        score: '23',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkN5P3Y2RqmdgWDRLtrzQUcps7ZkHU4W63pW0kHjVs4vejeLH4',
        self: false,
        rank: 8,
        prize: 'P100',
      },
      {
        name: 'Micro',
        score: '2',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNYjE7i_iyymMlwf3WRYU7WNKpe1pBbdlnr9G_CzylNL6yw7tP',
        self: false,
        rank: 9,
        prize: 'P100',
      },
      {
        name: 'Soft',
        score: '1',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR34_pSmGMTSgK5khg_iQkvMpuoV-3QSG8gHmeovHGOMuvh81Jd',
        self: false,
        rank: 10,
        prize: 'P100',
      },
      {
        name: 'YOU',
        score: '0',
        avatar: null,
        self: true,
        rank: 2000,
        prize: '0',
      }       
    ]}
  };

  rank: PIXI.Text;

  constructor(data: leaderboardData) {

    super();

    window.Game.setLeaderboardData = (data: any) => {
      this.setLeaderboardData(JSON.parse(data));
    }

    this.app = data.app;
    this.getLeaderboardData();
  }

  private render_leaderboard(data: any) {
    // get userData
    let userData = data.find((user: any) => user.self == true);
    // console.log(userData);
    if(userData !== undefined) {
      // check if data user are less than 10 or more
      let dataLength = (userData.rank == data.length) ? data.length : data.length - 1;
      // check if user outside to top 10 or more
      let isUserNotInTop = (userData.rank > dataLength) ? true : false;   
      if(isUserNotInTop){
        this.createFloatingUser(userData);
      }
    }

    for (let x = 0; x < data.length; x++) {
      
      // initialize and set bg color via drawing shapes
      this.profile_container[x] = new PIXI.Graphics();
      if(data[x].self == true) {
        this.profile_container[x].beginFill(0Xc2d378, 1);
      }
      else {
        this.profile_container[x].beginFill(0X2E2D4B, 0);
      }
      
      // this.profile_container[x].drawRect(0, 0, this.app.getScreenSize().w * 0.9, this.app.getScreenSize().h * 0.12);
      this.profile_container[x].drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h * 0.12);
      this.profile_container[x].endFill();
      this.profile_container[x].position.x = this.app.getScreenSize().w * 0.5 - this.profile_container[x].width * 0.5;
      // this.profile_container[x].position.y = this.profile_container[x - 1].position.y + this.profile_container[x - 1].height;
      if (x !== 0) {
        this.profile_container[x].position.y = this.profile_container[x - 1].position.y + this.profile_container[x - 1].height;
      } else {
        this.profile_container[x].position.y = this.tab_nav_container.position.y + this.tab_nav_container.height;
      }

      this.leaderboard_bg.addChild(this.profile_container[x]);

      // player rank
      this.rank = new PIXI.Text(`${(data[x].rank != null) ? data[x].rank: ''}`, {
        fontFamily: this.fontFamily,
        fontSize: `${this.profile_container[x].height * 0.2}px`,
        fill: 0x744395,
        align: 'left',
      });
      this.rank.anchor.set(0, 0);
      this.rank.name = 'rank';
      this.rank.position.x = this.profile_container[x].width * .05;
      this.rank.position.y = this.profile_container[x].height * 0.5 - this.rank.height * 0.5;
      this.rank.visible = true;
      this.profile_container[x].addChild(this.rank);

      data[x].avatar = (data[x].avatar == null) ? './assets/profile-avatar.png' : data[x].avatar;

      this.renderProfileAvatar(data, x);

      // initialize and set user details container
      const user_details = new PIXI.Graphics();
      user_details.beginFill(0X000000, 0);
      user_details.drawRect(0, 0, this.profile_container[x].width * 0.55, this.profile_container[x].height * 0.5);
      
      user_details.position.x = this.avatar[x].width + this.avatar[x].position.x + 50;
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
      // player_name.anchor.set(0, 0);
      player_name.position.y = this.profile_container[x].height * 0.5 - player_name.height * 0.5;
      player_name.position.x = this.avatar_container[x].position.x + this.avatar_container[x].width;
      this.profile_container[x].addChild(player_name);
      // player points
      const player_points = new PIXI.Text(`${data[x].score} pts.`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.5}px`,
        fill: 0XFFFFFF,
        align: 'left',
      });
      
      // rewards
      const rewards = new PIXI.Graphics();  
      rewards.beginFill(0xbe388e, 0);
      rewards.drawRoundedRect(0, 0, this.profile_container[x].width * 0.2, this.profile_container[x].height * 0.45, 40);
      rewards.endFill();
      // rewards.position.x = this.profile_container[x].width - rewards.width;
      rewards.position.x = this.profile_container[x].width - (rewards.width + rewards.width * .16);
      rewards.position.y = this.profile_container[x].height * 0.5 - rewards.height * 0.5;
      this.profile_container[x].addChild(rewards);
      // rewards text
      const rewards_text = new PIXI.Text(`${data[x].prize}`, {
        fontFamily: this.fontFamily,
        fontSize: `${user_details.height * 0.4}px`,
        fill: 0XFFFFFF,
        align: 'right',
        padding: 0
      });
      player_points.position.y = rewards.height * 0.5 - rewards_text.height * 0.5;
      // player_points.position.x = rewards.width * 0.5 - rewards_text.width * 0.5;
      player_points.position.x = 0;
      rewards.addChild(player_points);
      
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

  renderProfileAvatar(data:any, index:number){  
      // set player avatar 
      this.avatar_container[index] = new PIXI.Graphics();
      this.avatar_container[index].beginFill(0xCC0000,0).drawRect(0,0,100,100).endFill();
      this.avatar_container[index].width = this.profile_container[index].width * .19;
      this.avatar_container[index].height = this.avatar_container[index].width;
      this.avatar_container[index].position.x = this.profile_container[index].width * 0.1;
      this.avatar_container[index].position.y = this.profile_container[index].height * 0.5 - this.avatar_container[index].height * 0.5;
      
      // masking
      this.maskC[index] = new PIXI.Graphics();
      this.maskC[index].beginFill(0xffffff, 1).drawCircle(0, 0, 50).endFill();
      this.maskC[index].width = 75;
      this.maskC[index].height = 75;
      this.maskC[index].position.x = 50;
      this.maskC[index].position.y = 50;
      this.maskC[index].renderable = true;
      
      const texture = PIXI.Texture.from(`${data[index].avatar}`);
      this.avatar[index] = new PIXI.Sprite(texture);
      this.avatar[index].mask = this.maskC[index];
      // this.avatar[index].anchor.set(0,0);
      this.avatar[index].position.x = 12.5;
      this.avatar[index].position.y = 12.5;
      this.setScaleSpriteItem(this.avatar_container[index], this.avatar[index], 1);
      this.avatar_container[index].addChild(this.maskC[index]);
      this.avatar_container[index].addChild(this.avatar[index]);
      this.profile_container[index].addChild(this.avatar_container[index]);
      
  }

  createFloatingUser(data:any){
    
    // initialize and set bg color via drawing shapes
    this.profile_float_container = new PIXI.Graphics();
    this.profile_float_container.beginFill(0Xc2d378, 1);
    this.profile_float_container.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h * 0.12);
    this.profile_float_container.endFill();
    this.profile_float_container.position.x = this.app.getScreenSize().w * 0.5 - this.profile_float_container.width * 0.5;
    this.profile_float_container.position.y = this.app.getScreenSize().h - this.profile_float_container.height;
    this.addChild(this.profile_float_container);
    
    // player rank
    const rank = new PIXI.Text(`${(data.rank != null) ? data.rank: ''}`, {
      fontFamily: this.fontFamily,
      fontSize: `${this.profile_float_container.height * 0.2}px`,
      fill: 0x744395,
      align: 'left',
    });
    rank.anchor.set(0, 0);
    rank.name = 'rank';
    rank.position.x = this.profile_float_container.width * .05;
    rank.position.y = this.profile_float_container.height * 0.5 - rank.height * 0.5;
    rank.visible = true;
    this.profile_float_container.addChild(rank);
    
    data.avatar = (data.avatar == null) ? './assets/profile-avatar.png' : data.avatar;

    // set player avatar 
    var avatar_container = new PIXI.Graphics();
    avatar_container.beginFill(0xCC0000,0).drawRect(0,0,100,100).endFill();
    avatar_container.width = this.profile_float_container.width * .19;
    avatar_container.height = avatar_container.width;
    avatar_container.position.x = this.profile_float_container.width * 0.1 + (rank.width * .7);
    avatar_container.position.y = this.profile_float_container.height * 0.5 - avatar_container.height * 0.5;
    
    // masking
    var maskC = new PIXI.Graphics();
    maskC.beginFill(0xffffff, 1).drawCircle(0, 0, 50).endFill();
    maskC.width = 75;
    maskC.height = 75;
    maskC.position.x = 50;
    maskC.position.y = 50;
    maskC.renderable = true;
    
    var texture = PIXI.Texture.from(`${data.avatar}`);
    var avatarPic = new PIXI.Sprite(texture);
    avatarPic.mask = maskC;
    // avatar.anchor.set(0,0);
    avatarPic.position.x = 12.5;
    avatarPic.position.y = 12.5;
    this.setScaleSpriteItem(avatar_container, avatarPic, 1);
    avatar_container.addChild(maskC);
    avatar_container.addChild(avatarPic);
    this.profile_float_container.addChild(avatar_container);
  
    // initialize and set user details container
    const user_details = new PIXI.Graphics();
    user_details.beginFill(0X000000, 0);
    user_details.drawRect(0, 0, this.profile_float_container.width * 0.55, this.profile_float_container.height * 0.5);
    user_details.position.x = avatar_container.width + avatar_container.position.x;
    user_details.position.y = this.profile_float_container.height * 0.5 - user_details.height * 0.5;
    user_details.endFill();
    this.profile_float_container.addChild(user_details);
    
    // player name
    const player_name = new PIXI.Text(`${data.name}`, {
      fontFamily: this.fontFamily,
      fontSize: `${user_details.height * 0.5}px`,
      fill: 0x744395,
      align: 'center',
    });
    player_name.anchor.set(0, 0);
    player_name.position.y = user_details.height * 0.5 - player_name.height * 0.5;
    player_name.position.x = avatar_container.width * .001;
    user_details.addChild(player_name);
    // player points
    const player_points = new PIXI.Text(`${data.score} pts.`, {
      fontFamily: this.fontFamily,
      fontSize: `${user_details.height * 0.5}px`,
      fill: 0XFFFFFF,
      align: 'left',
    });
    
    // rewards
    const rewards = new PIXI.Graphics();  
    rewards.beginFill(0xbe388e, 0);
    rewards.drawRoundedRect(0, 0, this.profile_float_container.width * 0.2, this.profile_float_container.height * 0.45, 40);
    rewards.endFill();
    // rewards.position.x = this.profile_float_container.width - rewards.width;
    rewards.position.x = this.profile_float_container.width - (rewards.width + rewards.width * .16);
    rewards.position.y = this.profile_float_container.height * 0.5 - rewards.height * 0.5;
    this.profile_float_container.addChild(rewards);
    // rewards text
    const rewards_text = new PIXI.Text(`${data.prize}`, {
      fontFamily: this.fontFamily,
      fontSize: `${user_details.height * 0.4}px`,
      fill: 0XFFFFFF,
      align: 'right',
      padding: 0
    });
    player_points.position.y = rewards.height * 0.5 - rewards_text.height * 0.5;
    player_points.position.x = 0;
    rewards.addChild(player_points);
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
      this.destroyTexture(this.leaderboardData.data.all_time_rankings);
      this.removeChild(this.leaderboard_bg);
      this.removeChild(this.bg_image.getSprite());
      this.removeChildren();
    });
    this.leaderboard_bg.addChild(this.closeBtn.getSprite());
    this.addChild(this.leaderboard_bg);
  }

  destroyTexture(data:any){
    for (let x = 0; x < data.length; x++) {
      PIXI.Texture.from(`${data[x].avatar}`).destroy(true)
    }
  }
  // LEADERBOARD
  public getLeaderboardData(){
    try{

      Android.getGameLeaderboardData();
    }catch(e){
      
      this.setLeaderboardData(this.dummy_data);
      console.log("leaderboard data from dummy data")
    }
  }

  public setLeaderboardData(data:any){
    
    this.leaderboardData = data;
    
    this.createLeaderboard();
    this.render_leaderboard(data.data.all_time_rankings);
  }

  private setScaleSpriteItem(parentContainer:any, sprite:any, perc: number): void {
    sprite.scale = new PIXI.Point(0.01, 0.01);
    const point = sprite.scale;
    // perc = parentContainer.width * perc;
    perc = 75 * perc;
    do {
      point.x += 0.01;
      point.y += 0.01;
      sprite.scale = point;
    } while (sprite.width < perc);
    sprite.width = Math.round(sprite.width);
    sprite.height = Math.round(sprite.height);
  }
  
}