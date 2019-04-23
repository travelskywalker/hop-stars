import { Scene } from '@src/core/scene';
import { Text, Container, Graphics, Texture, projection, Sprite, TextStyle } from 'pixi.js';
import 'pixi-projection';
import { App } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';
import { SpriteAnimatedActor } from '@src/core/sprite.animated.actor';
import { Button } from '@src/scripts/components/button.component';

export class GameScene extends Scene {

  // objects
  bg: Graphics;
  bg_initial_x: number;
  bg_img: SpriteActor;
  gradient_bg: SpriteActor;
  circle: Graphics;

  circle1: SpriteAnimatedActor;

  square_bg: Graphics;
  circle_bg: Graphics;

  swipe_hand: SpriteActor;
  swipe: SpriteActor;
  swipe_hand_direction = 'right';
  
  // scrollable points
  initialPoint: any;
  finalPoint: any;
  
  bounce_count = 0;
  air_time = 0;

  // Circle
  CIRCLEWIDTH = this.app.getScreenSize().w * .08;
  circleYPosition: number = this.app.getScreenSize().h - this.app.getScreenSize().h * 0.2;
  fall_position: number = this.app.getScreenSize().h - this.circleYPosition;

  // bounce speed
  // YVELOCITY: number;
  // INITIAL_VELOCITY: number = this.app.getScreenSize().h * 0.02;
  // GRAVITY: number = this.INITIAL_VELOCITY * .05;

  // initial speed
  FREE_FALL: number = 20;
  INITIAL_VELOCITY: number = (this.app.getScreenSize().h * 0.02) * 2;
  GRAVITY: number = this.INITIAL_VELOCITY / this.FREE_FALL;
  YVELOCITY: number;

  // squares position
  last_square_position: number;
  initial_square_y: number = this.app.getScreenSize().h * 0.18;
  initial_square_distance: number = this.app.getScreenSize().h * 0.960;
  square_distance: number = this.initial_square_distance - this.initial_square_y;

  // square speed
  SQUARE_VELOCITY: number = this.square_distance / (this.FREE_FALL * 2 - 1);

  // flag
  GAME_RESET: boolean = false;
  TOUCHEND: boolean = false;
  TICKSTARTED: boolean = false;

  // camera projection
  bigWhiteTexture: Texture;
  container2d: PIXI.projection.Container2d;
  squareY: PIXI.Sprite;
  deviceScreenSize: number = this.app.getScreenSize().w * 0.5;

  // squares
  initial_square: projection.Sprite2d;
  squareFar: projection.Sprite2d [] = [];

  // animate squares
  squareAnimateThreshold: number = 7; //points needed to animate tiles
  squareAnimate: boolean = false;
  hit: any = [];
  squareFarPosition: any = [];
  squareFarToAnimate: any = [];
  animatedSquares: any = [1,3,5,7];

  // coins
  coin: projection.Sprite2d [] = [];
  score_coin: SpriteActor;
  coinAnimate: boolean = false; //config
  randomCoin: boolean = true; //config

  // score
  scoreText: Text;
  score: number = 0;

  // stage
  stageText: Text;
  stage: number = 1;
  stageProgress: number = 1;
  stageLimit: number = 50; //config

  // sounds
  randomTileSound: boolean = true; //config
  tileSound: boolean = true; //config
  tileVolume: any = 1; //config

  // game
  gameStarted: boolean = false;
  timeStart: any;

  // data requirements
  sessionId: any;

  // Nto 
  ntoContainer: Graphics;
  ntoStyle: TextStyle;
  ntoText: Text;
  retry: Button;
  cancel: Button;

  init(): void {
    
    this.bigWhiteTexture = new PIXI.Texture(PIXI.Texture.EMPTY.baseTexture);
    this.bigWhiteTexture.orig.width = this.CIRCLEWIDTH * 6;
    this.bigWhiteTexture.orig.height = this.CIRCLEWIDTH * 4;
    this.last_square_position = this.initial_square_distance + (this.initial_square_distance - this.initial_square_y) * 8;
    this.air_time = this.FREE_FALL * 2 - 1;
  
  }

  public getScore(){
    return this.score;
  }

  start(): void {

  // data requirements
  this.sessionId = this.app.getState().generateSessionId();

  this.coinAnimate = false;
  this.gameStarted = false;

  // hit
  for(let x=1; x<=7; x++){
    this.hit[x] = 'left';
  }

  ///// BACKGROUND IMAGE
  // console.log('initial velocity', this.INITIAL_VELOCITY);
  // console.log('gravity', this.GRAVITY);
  // console.log('initial square distance', this.initial_square_distance);
  // console.log('square fall pos: ', this.initial_square_y);
  // console.log('square distance: ', this.square_distance);
  // console.log('--------');
  // console.log('device height', this.app.getScreenSize().h);
  // console.log('device width', this.app.getScreenSize().w);

   // stage
   this.stageText = new Text('',{fontFamily : 'Arial', fontSize: 100, fill : 0x000000, align : 'center'});
   this.container.addChild(this.stageText);

   this.renderStage(1);
     
  /////////// SQUARES

  // GUIDE SQUARE ------------------
    this.initial_square = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.initial_square.anchor.set(0.5);
    this.initial_square.position.set(0, this.initial_square_y);

    const s_img_i = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_i.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_i.anchor.set(0.5, 0.5);
    s_img_i.position.y = 0;
    this.initial_square.addChild(s_img_i);
    
    // square 0 ------------------
    this.squareFar[0] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[0].tint = 0;
    this.squareFar[0].anchor.set(0.5);
    this.coin[0] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[0].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[0].scale.set(this.squareFar[0].width * 0.008);
    this.coin[0].anchor.set(0.5, 1);
    
    const s_img_0 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_0.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_0.anchor.set(0.5, 0.5);
    s_img_0.position.y = 0;
    this.squareFar[0].addChild(s_img_0);
    
    // square 1 ------------------
    this.squareFar[1] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[1].tint = 0xF37DAE;
    this.squareFar[1].anchor.set(0.5);
    this.coin[1] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[1].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[1].scale.set(this.squareFar[0].width * 0.008);
    this.coin[1].anchor.set(0.5, 1);
    
    const s_img_1 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_1.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_1.anchor.set(0.5, 0.5);
    s_img_1.position.y = 0;
    this.squareFar[1].addChild(s_img_1);

    // square 2 ------------------
    this.squareFar[2] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[2].tint = 0xF37DAE;
    this.squareFar[2].anchor.set(0.5);
    this.coin[2] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[2].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[2].scale.set(this.squareFar[0].width * 0.008);
    this.coin[2].anchor.set(0.5, 1);
    
    const s_img_2 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_2.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_2.anchor.set(0.5, 0.5);
    s_img_2.position.y = 0;
    this.squareFar[2].addChild(s_img_2);

    // square 3 ------------------
    this.squareFar[3] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[3].tint = 0xF37DAE;
    this.squareFar[3].anchor.set(0.5);
    this.coin[3] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[3].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[3].scale.set(this.squareFar[0].width * 0.008);
    this.coin[3].anchor.set(0.5, 1);
    
    const s_img_3 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_3.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_3.anchor.set(0.5, 0.5);
    s_img_3.position.y = 0;
    this.squareFar[3].addChild(s_img_3);

    // square 4 ------------------
    this.squareFar[4] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[4].tint = 0xF37DAE;
    this.squareFar[4].anchor.set(0.5);
    this.coin[4] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[4].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[4].scale.set(this.squareFar[0].width * 0.008);
    this.coin[4].anchor.set(0.5, 1);
    
    const s_img_4 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_4.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_4.anchor.set(0.5, 0.5);
    s_img_4.position.y = 0;
    this.squareFar[4].addChild(s_img_4);

    // square 5 ------------------
    this.squareFar[5] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[5].tint = 0xF37DAE;
    this.squareFar[5].anchor.set(0.5);
    this.coin[5] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[5].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[5].scale.set(this.squareFar[0].width * 0.008);
    this.coin[5].anchor.set(0.5, 1);

    const s_img_5 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_5.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_5.anchor.set(0.5, 0.5);
    s_img_5.position.y = 0;
    this.squareFar[5].addChild(s_img_5);
    
    // square 6 ------------------
    this.squareFar[6] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[6].tint = 0xF37DAE;
    this.squareFar[6].anchor.set(0.5);
    this.coin[6] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[6].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[6].scale.set(this.squareFar[0].width * 0.008);
    this.coin[6].anchor.set(0.5, 1);

    const s_img_6 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_6.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_6.anchor.set(0.5, 0.5);
    s_img_6.position.y = 0;
    this.squareFar[6].addChild(s_img_6);

    // square 7 ------------------
    this.squareFar[7] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[7].tint = 0xF37DAE;
    this.squareFar[7].anchor.set(0.5);
    this.coin[7] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[7].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[7].scale.set(this.squareFar[0].width * 0.008);
    this.coin[7].anchor.set(0.5, 1);

    // animating coin --------------
    this.coin[100] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/coin.png'));
    this.coin[100].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[100].scale.set(this.squareFar[0].width * 0.01);
    this.coin[100].anchor.set(0.5, 1);

    const s_img_7 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('./assets/platform.png'));
    s_img_7.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_7.anchor.set(0.5, 0.5);
    s_img_7.position.y = 0;
    this.squareFar[7].addChild(s_img_7);

    this.generateStartSquares();

    this.squareY = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.squareY.anchor.set(0.5);
    this.squareY.position.set(this.app.getScreenSize().w / 2, 0);

  // PROJECTION CONTAINER
    this.container2d = new PIXI.projection.Container2d();
    this.container2d.position.set(this.app.getScreenSize().w / 2, this.app.getScreenSize().h);
    this.container.addChild(this.container2d);
    this.container.setChildIndex(this.container2d, 1)

    //illuminate the sprite from two points!
    var lightY = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
    lightY.tint = 0x000000;
    lightY.anchor.set(0.5, 0);
    lightY.scale.set(this.app.getScreenSize().w * 0.2, this.app.getScreenSize().h);
    lightY.alpha = 0;
    this.container2d.addChildAt(lightY, 0);
    
  /////  SCORE

  this.score_coin = new SpriteActor('ball', this.app, 'common', 'coin.png');
  this.score_coin.setPosition(this.app.getScreenSize().w * 0.85, this.app.getScreenSize().h * 0.02);
  this.score_coin.setScaleUpToScreenPercWidth(0.1);
  this.container.addChild(this.score_coin.getSprite());

  this.scoreText = new Text(
    `${this.score}`,
    {
      fontFamily : 'Arial',
      fontWeight: 'Bold',
      fontSize: this.app.getScreenSize().w * 0.1, 
      fill : 0Xffffff, 
      align : 'right',
      dropShadow: true,
      dropShadowAngle: 12,
      dropShadowBlur: 15,
      dropShadowColor: 0x6e706f,
      dropShadowDistance: 0
    });
  this.scoreText.anchor.set(1 , 0);
  this.scoreText.position.x = this.score_coin.getSprite().position.x - 20;
  this.scoreText.position.y = this.app.getScreenSize().h * 0.02;
  this.container.addChild(this.scoreText);

  //////////////////////////////

  // CIRCLE BACKGROUND
    this.circle_bg = new Graphics();
    this.circle_bg.beginFill(0xF2F2F2, 0);
    this.circle_bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.circle_bg.endFill();
    this.circle_bg.interactive = true;
    this.container.addChild(this.circle_bg);

  // CIRCLE
    this.circle = new Graphics();
    this.circle.beginFill(0X942363);
    this.circle.drawCircle(this.deviceScreenSize, this.circleYPosition, this.CIRCLEWIDTH);
    
  // EVENTS
    // const circle1 = new SpriteActor('ball', this.app, 'common', 'ball.png');
    this.circle1 = new SpriteAnimatedActor('tiles_ball', this.app);
    this.circle1.addAnimation('tiles_ball', 'ball');
    // this.circle1.switchAnimation('ball', 0.9, true);
    this.circle1.setAnchor(this.circle.position.x, 0);
    this.circle1.setPosition(this.deviceScreenSize - this.circle.width/2, this.circleYPosition - this.circle.width/2);
    
    this.circle1.setScaleUpToScreenPercWidth(.16);
    this.circle.addChild(this.circle1.getAnimatedSprite());
    this.circle_bg.addChild(this.circle);

  //// TOUCH START
    this.circle_bg.on('touchstart', (interactionData: PIXI.interaction.InteractionEvent) => {  
        
      if(interactionData.data.identifier > 0) return;

      this.container.removeChild(instructionContainer);
      this.container.removeChild(this.swipe.getSprite());
      this.container.removeChild(this.swipe_hand.getSprite());
      this.container.removeChild(taptostart.getSprite());

      // game started
      if(this.gameStarted == false){
        let event = {
                    event: "start",
                    session_id: this.sessionId
                    }
        this.app.getState().eventStarted(event); //send payload
        this.gameStarted = true;
      }
      
      this.ball_click();

      // get initial tapped postion
      const point = interactionData.data.getLocalPosition(this.circle);
      this.initialPoint = point;

  });

   //// TOUCH MOVE
    this.circle_bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
      // console.log('touchmove');
      // disable multitouch
      if(interactionData.data.identifier > 0) return;

      const point = interactionData.data.getLocalPosition(this.circle);

      if(this.GAME_RESET !== true) {
        // circle move -----
        this.circle.position.x = Math.min(this.app.getScreenSize().w * 0.5 , this.circle.position.x + (point.x - this.initialPoint.x));
        this.circle.position.x = Math.max(this.circle.position.x , -(this.deviceScreenSize));
        // box container -----
        this.container2d.position.x = -((this.circle.position.x + (point.x - this.initialPoint.x)) - this.deviceScreenSize);
        const bg_img_x = this.bg_img.getSprite().position.x + (point.x - this.initialPoint.x) / 8;
        this.bg_img.getSprite().position.x = Math.min(0, bg_img_x);
        this.bg_img.getSprite().position.x = Math.max(this.bg_img.getSprite().position.x, - (this.bg_img.getSprite().width - this.app.getScreenSize().w));
      }

    });
    this.circle_bg.on('touchend', () => {
      // this.TOUCHEND = true;
    });

    this.YVELOCITY = this.INITIAL_VELOCITY;
    this.container2d.addChild(this.initial_square);
    this.container2d.addChild(this.squareFar[0]);
    this.container2d.addChild(this.squareFar[1]);
    this.container2d.addChild(this.squareFar[2]);
    this.container2d.addChild(this.squareFar[3]);
    this.container2d.addChild(this.squareFar[4]);
    this.container2d.addChild(this.squareFar[5]);
    this.container2d.addChild(this.squareFar[6]);
    this.container2d.addChild(this.squareFar[7]);

    this.GAME_RESET = true;
    
    // INSTRUCITON
    const instructionContainer = new Graphics();
    instructionContainer.beginFill(0x000).drawRoundedRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h, 0);
    instructionContainer.position.x = 0;
    instructionContainer.position.y = 0;
    instructionContainer.alpha = .4;
    // instructionContainer.interactive = true;
    
    const taptostart = new SpriteActor('tap-bg', this.app, 'common', 'TAP TO START.png');
    taptostart.setAnchor(.5, .5);
    taptostart.setPosition(this.app.getScreenSize().w * .5, this.app.getScreenSize().h * .4);
    taptostart.setScaleUpToScreenPercWidth(.7);

    this.swipe = new SpriteActor('swipe-bg', this.app, 'lvl1', 'swipe-arrow.png');
    this.swipe.setAnchor(.5, .5);
    this.swipe.setPosition(this.app.getScreenSize().w * .5, this.app.getScreenSize().h * .85);
    this.swipe.setScaleUpToScreenPercWidth(.9);

    this.swipe_hand = new SpriteActor('swipe-hand', this.app, 'lvl1', 'hand.png');
    this.swipe_hand.setAnchor(.5, .5);
    this.swipe_hand.setPosition(this.app.getScreenSize().w * .5, this.swipe.getSprite().position.y + this.swipe.getSprite().height );
    this.swipe_hand.setScaleUpToScreenPercHeight(0.1);

    this.container.addChild(instructionContainer);
    this.container.addChild(this.swipe.getSprite());
    this.container.addChild(this.swipe_hand.getSprite());
    this.container.addChild(taptostart.getSprite());

    instructionContainer.on('touchstart', () => { 
      alert('s');
      this.container.removeChild(instructionContainer);
      this.container.removeChild(this.swipe.getSprite());
      this.container.removeChild(this.swipe_hand.getSprite());
      this.container.removeChild(taptostart.getSprite());

      // game started
      // this.app.getState().eventStarted(); //send payload
      this.ball_click(); 
    })
    // END OF INSTRUCTION

  }

  randomPosition(){

    const rightMost = this.app.getScreenSize().w * 0.5;
    const rightMid = this.app.getScreenSize().w * 0.25;
    const mid = 0;
    const leftMid = -(this.app.getScreenSize().w * 0.25);
    const leftMost = -(this.app.getScreenSize().w * 0.5);

    let n = Math.floor(Math.random() * 5 +1);
    switch (n) {
      case 1:
        return leftMost;
        break;
      case 2: 
        return leftMid;
        break;
      case 3:
        return rightMost;
        break;
      case 4:
        return rightMid;
        break;
      default:
        return mid
        break;
    }
  }

  renderStage(number: number){

    try{

      if( number <= 3) {
        this.container.removeChild(this.bg_img.getSprite()); 
        this.container.removeChild(this.gradient_bg.getSprite());
      }
      
    }catch(e){
      // console.log(e);
    }

    // render stages
    switch (number) {
      case 1:
        this.stage1();
        break;
      case 2:
        this.stage2();
        break;
      case 3:
        this.stage3();
        break;
      default:
        this.stage4();
        break;
    }

  }

  isAnimating(){
    let n = Math.floor(Math.random() * 2);
    return (n == 1) ? true : false;
  }

  animateSquare(){
    
    // do not animate if animation is turned off
    if(this.squareAnimate == false) return false;
    console.log("animate squares");

    let squares = this.animatedSquares;

    let moveSpeed = 8;
    let moveLength = this.app.getScreenSize().w * .40;

    for(let x = 0; x <= squares.length-1; x++){
      
      if(this.squareFarToAnimate[squares[x]] == true){

        if(this.squareFar[squares[x]].x <= this.squareFarPosition[squares[x]] + moveLength && this.hit[squares[x]] == 'left'){

          this.hit[squares[x]] = 'left';
          this.squareFar[squares[x]].x += moveSpeed;

        } else {

          if(this.squareFar[squares[x]].x >= this.squareFarPosition[squares[x]]){

            this.hit[squares[x]] = 'right';
            this.squareFar[squares[x]].x -= moveSpeed;

          }else{

            this.hit[squares[x]]= 'left';

          }
          
        }
      }
    };
  }

  addCoin(squares: number[]){

    for(let x=0; x<=squares.length-1; x++){

      if(this.randomCoin == true){

        let n = Math.floor(Math.random() * 2);
        
        if(n == 1){
          this.squareFar[squares[x]].addChild(this.coin[squares[x]]);
        }
        
      }else{

        this.squareFar[squares[x]].addChild(this.coin[squares[x]]);
      }
    }
    
  }

  coinAnimation(){
    if(this.coinAnimate == false) {
      this.container2d.removeChild(this.coin[100]);
      return;
    }

    // this.coin[100].y += 300;
    // this.coin[100].x += 50;
  }

  update(_delta: number): void {

    // Project camera angle
    let posY = this.container2d.toLocal(this.squareY.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
    this.container2d.proj.setAxisY(posY, 1);

    // Tap to Start ---- swipe hand moving
    // SWIPE HAND MOVING
    if (this.swipe_hand.getSprite().position.x <= this.swipe.getSprite().position.x + (this.swipe.getSprite().width/4) * 1.5 && this.swipe_hand_direction === 'right') {
      this.swipe_hand_direction = 'right';
      this.swipe_hand.getSprite().position.x += 10;
    } else {
      this.swipe_hand_direction = 'left';
      if( this.swipe_hand.getSprite().position.x <= this.swipe.getSprite().width / 4 ) {
        this.swipe_hand_direction = 'right';
        this.swipe_hand.getSprite().position.x += 10;
      } else {
        this.swipe_hand.getSprite().position.x -= 10;
      }
    }

    // animate square
    try{
      this.animateSquare();
    }catch(error){
      // console.log("animate error", error);
    }

    this.coinAnimation();

      if(this.GAME_RESET != true) {
        
        // add square
        if(this.squareFar[0].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[0].position.y = this.squareFar[7].position.y + this.square_distance;
          this.squareFar[0].position.x = this.randomPosition();
          this.addCoin([0]);
          this.squareFarPosition[0] = this.squareFar[0].position.x;
          this.squareFarToAnimate[0] = this.isAnimating();
          }
        if(this.squareFar[1].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[1].position.y = this.squareFar[0].position.y + this.square_distance; 
          this.squareFar[1].position.x = this.randomPosition();
          this.addCoin([1]);
          this.squareFarPosition[1] = this.squareFar[1].position.x;
          this.squareFarToAnimate[1] = this.isAnimating();

        }
        if(this.squareFar[2].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[2].position.y = this.squareFar[1].position.y + this.square_distance; 
          this.squareFar[2].position.x = this.randomPosition();
          this.addCoin([2]);
          this.squareFarPosition[2] = this.squareFar[2].position.x;
          this.squareFarToAnimate[2] = this.isAnimating();
        }
        if(this.squareFar[3].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[3].position.y = this.squareFar[2].position.y + this.square_distance; 
          this.squareFar[3].position.x = this.randomPosition();
          this.addCoin([3]);
          this.squareFarPosition[3] = this.squareFar[3].position.x;
          this.squareFarToAnimate[3] = this.isAnimating();
        }
        if(this.squareFar[4].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[4].position.y = this.squareFar[3].position.y + this.square_distance;
          this.squareFar[4].position.x = this.randomPosition();
          this.addCoin([4]);
          this.squareFarPosition[4] = this.squareFar[4].position.x;
          this.squareFarToAnimate[4] = this.isAnimating();
        }
        if(this.squareFar[5].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[5].position.y = this.squareFar[4].position.y + this.square_distance;
          this.squareFar[5].position.x = this.randomPosition();
          this.addCoin([5]);
          this.squareFarPosition[5] = this.squareFar[5].position.x;
          this.squareFarToAnimate[5] = this.isAnimating();
        }
        if(this.squareFar[6].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[6].position.y = this.squareFar[5].position.y + this.square_distance;
          this.squareFar[6].position.x = this.randomPosition();
          this.addCoin([6]);
          this.squareFarPosition[6] = this.squareFar[6].position.x;
          this.squareFarToAnimate[6] = this.isAnimating();
        }
        if(this.squareFar[7].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[7].position.y = this.squareFar[6].position.y + this.square_distance; 
          this.squareFar[7].position.x = this.randomPosition();
          this.addCoin([7]);
          this.squareFarPosition[7] = this.squareFar[7].position.x;
          this.squareFarToAnimate[7] = this.isAnimating();
        }
      
        // move squares towards user
        for(let s=0; s <= 7; s++){
          this.squareFar[s].position.y -= this.SQUARE_VELOCITY;
         }

        this.initial_square.position.y -= this.SQUARE_VELOCITY;
        
        if (this.circle.position.y <= 0 && this.TOUCHEND == false) {
          
          // IF BALL IS BOUNCING
          this.YVELOCITY -= this.GRAVITY;
          this.circle.position.y -= this.YVELOCITY;
          this.air_time -= 1;
        } else {

            let square = this.squareFar[this.bounce_count];
            let bouncePosition = this.circle.position.x;

            // IF BALL IS ON AIR
            if ( this.air_time <= -1 || this.air_time <= 1 ) {

              // stage progression by platform ----
              if(this.stageProgress == this.stageLimit){
                this.stage += 1;
                this.stageProgress = 1;
                this.renderStage(this.stage);
              }else{
                this.stageProgress+=1;
              }

              // IF BALL FAILED TO BOUNCE ON SQUARE
              if(this.isInSquare(square, bouncePosition) == true ) {
                
                if(this.TOUCHEND == false) this.playTileSound();

                // if square has coin, check if ball fall on coin, get coin, add score
                try{
                  square.getChildIndex(this.coin[this.bounce_count])

                  // console.log("has coin", square.getChildIndex(this.coin[this.bounce_count]))
                  if(this.isCoined(square, bouncePosition) && this.TOUCHEND == false){
                    this.app.getSoundPlayer().play('coin', .3);
                    this.scoreText.text = `${this.score += 1}`;
                    
                    // remove coin
                    try{
                      square.removeChildAt(1);
                    }catch(e){

                    }
                    // this.animateCoin(this.squareFar[this.bounce_count]);

                    // animate square on points threshold
                    // if(this.score >= this.squareAnimateThreshold){
                    //   this.squareAnimate = true;
                    // }
                    
                  }

                }catch(e){
                  // console.log(e);
                }

                this.bounce_count += 1;
                this.air_time = this.FREE_FALL * 2 - 1;
              } else {
                this.TOUCHEND = true;
                this.bounce_count = 0;
              }
            }
            
            if(this.TOUCHEND == true) {
              // console.log('falling');
              if(this.fall_position < this.circle.position.y) {
                // if ball out of screen
                this.reset_game();
              } else {
                // continuous falling __until out of screen
                this.YVELOCITY -= this.GRAVITY;
                this.circle.position.y -= this.YVELOCITY;

                // dropping ball sound
                this.app.getSoundPlayer().play('ball_bounce');
              }
            } else {
              this.YVELOCITY = this.INITIAL_VELOCITY;
              this.YVELOCITY -= this.GRAVITY;
              this.circle.position.y -= this.YVELOCITY;
            }
            
          // // SCREEN STILL ON TOUCH
          if (this.bounce_count > this.squareFar.length - 1) {
            this.bounce_count = 0;
          } 
        
      }
  }
  }

  animateCoin(square: projection.Sprite2d){

    let sqx = square.x;
    let sqy = square.y;

    this.coin[100].position.set(sqx,sqy);
    this.container2d.addChild(this.coin[100]);

    this.coinAnimate = true;

    setTimeout(() => {
      this.container2d.removeChild(this.coin[100]);
    }, this.FREE_FALL*5);
  }

  resetStage(){
    this.stage = 1;
    this.stageProgress = 1;

    this.generateStartSquares();
    this.squareAnimate = false;
    this.renderStage(1);
  }

  isCoined(square: projection.Sprite2d, bouncePosition: number){
    
    // square coordinates
    let square_start = (square.position.x/2.1) - (square.width/4);
    let square_end = (square.position.x/2.1) + (square.width/4);

    // coin width
    let coinWidth = (square.width/2)*.64;

    // center of square coordinates
    let centerSquare = square_start + (square.width/4);

    // coin position
    let coinStart = centerSquare - (coinWidth/2);
    let coinEnd = centerSquare + (coinWidth/2);

    if(bouncePosition > coinStart && bouncePosition < coinEnd){
      return true;
    }else{
      return false;
    }
  }

  reset_game() {

    // goto gameover scene
      
    if(this.app.getState().isOnline() == true){

      this.app.goToScene(4, {score: this.score, session_id: this.sessionId, timeStart: this.timeStart});

      // IF BALL OUT OF SCREEN, RESET GAME
     this.circle.position.y = 0; 
     this.circle.position.x = 0;
     this.container2d.position.x = this.deviceScreenSize;
     this.YVELOCITY = this.INITIAL_VELOCITY;
     
     this.TOUCHEND = false;
     this.bounce_count = 0;
     setTimeout(()=>{ this.scoreText.text = `${this.score = 0}`;},100);
     this.bg_img.getSprite().position.x = this.bg_initial_x;
     this.resetStage();

    }else{
      this.showNTOModal();
    }

    this.GAME_RESET = true;
     
  }

  generateStartSquares(){
    this.initial_square.position.y = this.initial_square_y;
    this.squareFar[0].position.set(this.randomPosition(), this.initial_square_distance);
    this.squareFar[1].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance);
    this.squareFar[2].position.set(this.randomPosition(),this.initial_square_distance + this.square_distance * 2);
    this.squareFar[3].position.set(this.randomPosition(),this.initial_square_distance + this.square_distance * 3);
    this.squareFar[4].position.set(this.randomPosition(),this.initial_square_distance + this.square_distance * 4);
    this.squareFar[5].position.set(this.randomPosition(),this.initial_square_distance + this.square_distance * 5);
    this.squareFar[6].position.set(this.randomPosition(),this.initial_square_distance + this.square_distance * 6);
    this.squareFar[7].position.set(this.randomPosition(),this.initial_square_distance + this.square_distance * 7);

    this.addCoin([0,1,2,3,4,5,6,7]);
  }

  isInSquare(square:projection.Sprite2d, ball_bounce: number){
    // if ball bounce at the center and square is in the center
    let square_position = square.position.x;
    let ball_position = ball_bounce;

    let square_start = (square.position.x/2.1) - (square.width/4);
    let square_end = (square.position.x/2.1) + (square.width/4);
    
    if (ball_position > square_start && ball_position < square_end) {
      return true;
    } else {
      return false;
    }
  }

  remove(): void {
    setTimeout(()=>{ 
      this.container.removeChildren();
    },120);
  }

  ball_click(): void {
    // bounce ball when tapped
    if(this.GAME_RESET == false) {
     this.TOUCHEND = false;
     
    } else {
      this.circle1.switchAnimation('ball', 0.9, true);
      this.GAME_RESET = false;
    }
  }
  // SOUND ------------------------------------------------------------------
  playTileSound(){
    if (this.tileSound == false) return;

    if(this.randomTileSound == true){
      let n = Math.floor(Math.random() * 8 +1);
      this.app.getSoundPlayer().play('tile_'+n);
    }else{
      // play default tile sound
      this.app.getSoundPlayer().play('tile_1',this.tileVolume);
    }
  }
  playBGMSound(name:string) {
    PIXI.sound.play(name, { loop: true });
  }
  stopBGMSound() {
    // this.app.getSoundPlayer().stop(name);
    PIXI.sound.stopAll();
  }
  resetBGMSound(){
    PIXI.sound.stopAll();
    PIXI.sound.play("BGM_default", { loop: true });
  }

  // STAGES -----------------------------------------------------------------
  stage4(){
    
    // SPEED
     this.FREE_FALL = 10;
     this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 3.25;
     this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;
     this.SQUARE_VELOCITY = this.square_distance / (this.FREE_FALL * 2 - 1);
    
  }

  stage3(){

    // SPEED
     this.FREE_FALL = 12.5;
     this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 2.75;
     this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;
     this.SQUARE_VELOCITY = this.square_distance / (this.FREE_FALL * 2 - 1);
     // BACKGROUND
    this.bg_img = new SpriteActor('stage3-bg', this.app, 'lvl3', 'lv3_spacebg_gradient.png');
    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 0);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.bg_img.setScaleUpToScreenPercWidth(1.2);
    this.bg_img.setScaleUpToScreenPercHeight(1);
    this.bg_initial_x = -((this.bg_img.getSprite().width - this.app.getScreenSize().w) / 2);
    this.bg_img.getSprite().position.x = this.bg_initial_x;
    this.addChild(this.bg_img);
    // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('stage3-bg', this.app, 'lvl3', 'lv3_spacebg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = .45;
    this.gradient_bg.setScaleUpToScreenPercWidth(1); 
    this.gradient_bg.setScaleUpToScreenPercHeight(1);
    this.container.addChild(this.bg_img.getSprite());
    this.container.setChildIndex(this.bg_img.getSprite(),0);
    this.container.addChild(this.gradient_bg.getSprite());
    this.container.setChildIndex(this.gradient_bg.getSprite(),2)
    this.container.setChildIndex(this.scoreText,3)

    this.stopBGMSound();
    this.playBGMSound('BGM_S3');

  }

  stage2(){
    
    // animate squares
    this.squareAnimate = true;

    // SPEED
    this.FREE_FALL = 15;
    this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 2.5;
    this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;
    this.SQUARE_VELOCITY = this.square_distance / (this.FREE_FALL * 2 - 1);
    // BACKGROUND
    this.bg_img = new SpriteActor('stage2-bg', this.app, 'lvl2', 'lv2_skybg_mountains.jpg');
    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 0);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.bg_img.setScaleUpToScreenPercWidth(1.2);
    this.bg_img.setScaleUpToScreenPercHeight(1);
    this.bg_initial_x = -((this.bg_img.getSprite().width - this.app.getScreenSize().w) / 2);
    this.bg_img.getSprite().position.x = this.bg_initial_x;
    this.addChild(this.bg_img);
    // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('stage2-bg', this.app, 'lvl2', 'lv2_skybg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = .65;
    this.gradient_bg.setScaleUpToScreenPercWidth(1.2); 
    this.gradient_bg.setScaleUpToScreenPercHeight(1);
    this.container.addChild(this.bg_img.getSprite());
    this.container.setChildIndex(this.bg_img.getSprite(),0);
    this.container.addChild(this.gradient_bg.getSprite());
    this.container.setChildIndex(this.gradient_bg.getSprite(),2)
    this.container.setChildIndex(this.scoreText,3)

    this.stopBGMSound();
    this.playBGMSound('BGM_S2');
  }

  stage1(){
    
    // SPEED
     // initial speed
     this.FREE_FALL = 20;
     this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 2;
     this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;
     this.SQUARE_VELOCITY = this.square_distance / (this.FREE_FALL * 2 - 1);
     // BACKGROUND
    this.bg_img = new SpriteActor('stage2-bg', this.app, 'lvl1', 'lv1_gamearea_bgsample.png');
    // this.bg_img = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.jpg');
    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 0);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.bg_img.setScaleUpToScreenPercWidth(1.2);
    this.bg_img.setScaleUpToScreenPercHeight(1);
    this.bg_initial_x = -( (this.bg_img.getSprite().width - this.app.getScreenSize().w) / 2);
    this.bg_img.getSprite().position.x = this.bg_initial_x;
    this.addChild(this.bg_img);
    // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('splash-bg', this.app, 'lvl1', 'lv1_mountainbg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = 1;
    this.gradient_bg.setScaleUpToScreenPercWidth(1); 
    this.gradient_bg.setScaleUpToScreenPercHeight(1);
    this.container.addChild(this.bg_img.getSprite());
    this.container.setChildIndex(this.bg_img.getSprite(),0);
    this.container.addChild(this.gradient_bg.getSprite());
    this.container.setChildIndex(this.gradient_bg.getSprite(),2)

    this.resetBGMSound();

  }

  // NETWORK TIMEOUT
  showNTOModal(){
    // NTO BG
    this.ntoContainer = new PIXI.Graphics();
    this.ntoContainer.beginFill(0x000).drawRoundedRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h, 0);
    this.ntoContainer.position.x = 0;
    this.ntoContainer.position.y = 0;
    this.ntoContainer.alpha = .4;
    // NTO TEXT
    this.ntoStyle = new PIXI.TextStyle({
      fontFamily: 'Chennai-Bold',
      fontSize: `${this.ntoContainer.height * .05}px`,
      fontStyle: 'normal',
      fontWeight: 'normal',
      align: 'center',
      fill: ['#ffffff'],
      dropShadow: true,
      dropShadowAngle: 12,
      dropShadowBlur: 15,
      dropShadowColor: 0x6e706f,
      dropShadowDistance: 0
      // wordWrap: true,
      // wordWrapWidth: this.app.getScreenSize().w * .7//modal.width * .8
    });
    
    this.ntoText = new PIXI.Text(
        `No Internet Connection`, 
        this.ntoStyle);
    this.ntoText.anchor.x = .5;
    this.ntoText.anchor.y = .5;
    this.ntoText.position.x = this.app.getScreenSize().w * .5;
    this.ntoText.position.y = this.ntoContainer.height * .4;
    this.container.addChild(this.ntoContainer);
    this.container.addChild(this.ntoText);

    // NTO BUTTON
     this.retry = new Button({
      app: this.app,
      text: 'Retry',
      height: null,
      y: this.app.getScreenSize().h - this.app.getScreenSize().h * 0.275,
      align: 'center',
      type: 'selected',
      icon: '',
      details: '',
    });
    this.container.addChild(this.retry);

    this.cancel = new Button({
      app: this.app,
      text: 'Cancel',
      height: null,
      y: this.retry.position.y + (this.retry.height * 1.2),
      align: 'center',
      type: 'selected',
      icon: '',
      details: '',
    });
    this.container.addChild(this.cancel);

    this.retry.clicked = () => { 
      if(this.app.getState().isOnline() == true){
        this.app.goToScene(4, {score: this.score, session_id: this.sessionId, timeStart: this.timeStart});
      } 
    };

    this.cancel.clicked = () => { 
      this.app.getState().eventStarted({event:'cancel'});
    };
  }
  removeNTOModal(){
    this.container.removeChild(this.ntoContainer);
    this.container.removeChild(this.ntoText);
    this.container.removeChild(this.retry);
    this.container.removeChild(this.cancel);
  }

}