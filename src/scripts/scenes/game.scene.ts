import { Scene } from '@src/core/scene';
import { Text, Container, Graphics, Texture, projection, Sprite } from 'pixi.js';
import 'pixi-projection';
import { App } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';

export class GameScene extends Scene {

  // objects
  bg: Graphics;
  bg_initial_x: number;
  bg_img: SpriteActor;
  gradient_bg: SpriteActor;
  circle: Graphics;
  square_bg: Graphics;
  circle_bg: Graphics;
  
  // scrollable points
  initialPoint: any;
  finalPoint: any;
  
  bounce_count = 0;

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
  SQUARE_HOP_POSITION = this.app.getScreenSize().h * 0.15;
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

  // coins
  coin: projection.Sprite2d [] = [];

  // score
  scoreText: Text;
  score: number = 0;

  // stage
  stageText: Text;
  stage: number = 1;
  stageProgress: number = 1;
  stageLimit: number = 5;

  init(): void {
    
    this.bigWhiteTexture = new PIXI.Texture(PIXI.Texture.WHITE.baseTexture);
    this.bigWhiteTexture.orig.width = this.CIRCLEWIDTH * 6;
    this.bigWhiteTexture.orig.height = this.CIRCLEWIDTH * 4;
    this.last_square_position = this.initial_square_distance + (this.initial_square_distance - this.initial_square_y) * 8;
  
  }

  start(): void {

  ///// BACKGROUND IMAGE
console.log('initial velocity', this.INITIAL_VELOCITY);
console.log('gravity', this.GRAVITY);
console.log('square distance', this.initial_square_distance);
    

   // stage
   this.stageText = new Text('',{fontFamily : 'Arial', fontSize: 100, fill : 0x000000, align : 'center'});
   this.container.addChild(this.stageText);

   this.renderStage(1);
     

  /////////// SQUARES

    this.initial_square = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.initial_square.tint = 0xF37DAE;
    this.initial_square.anchor.set(0.5);
    this.initial_square.position.set(0, this.initial_square_y);
    
    this.squareFar[0] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[0].tint = 0xF37DAE;
    this.squareFar[0].anchor.set(0.5);
    // this.squareFar[0].position.set(this.randomPosition(), this.initial_square_distance);
    this.coin[0] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[0].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[0].scale.set(this.squareFar[0].width * 0.01);
    this.coin[0].anchor.set(0.5, 1);
    this.squareFar[0].addChild(this.coin[0]);
    
    this.squareFar[1] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[1].tint = 0xF37DAE;
    this.squareFar[1].anchor.set(0.5);
    // this.squareFar[1].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance));
    this.coin[1] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[1].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[1].scale.set(this.squareFar[0].width * 0.01);
    this.coin[1].anchor.set(0.5, 1);
    this.squareFar[1].addChild(this.coin[1]);

    this.squareFar[2] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[2].tint = 0xF37DAE;
    this.squareFar[2].anchor.set(0.5);
    // this.squareFar[2].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance * 2));
    this.coin[2] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[2].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[2].scale.set(this.squareFar[0].width * 0.01);
    this.coin[2].anchor.set(0.5, 1);
    this.squareFar[2].addChild(this.coin[2]);

    this.squareFar[3] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[3].tint = 0xF37DAE;
    this.squareFar[3].anchor.set(0.5);
    // this.squareFar[3].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance * 3));
    this.coin[3] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[3].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[3].scale.set(this.squareFar[0].width * 0.01);
    this.coin[3].anchor.set(0.5, 1);
    this.squareFar[3].addChild(this.coin[3]);

    this.squareFar[4] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[4].tint = 0xF37DAE;
    this.squareFar[4].anchor.set(0.5);
    // this.squareFar[4].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance * 4));
    this.coin[4] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[4].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[4].scale.set(this.squareFar[0].width * 0.01);
    this.coin[4].anchor.set(0.5, 1);
    this.squareFar[4].addChild(this.coin[4]);

    this.squareFar[5] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[5].tint = 0xF37DAE;
    this.squareFar[5].anchor.set(0.5);
    // this.squareFar[5].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance * 5));
    this.coin[5] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[5].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[5].scale.set(this.squareFar[0].width * 0.01);
    this.coin[5].anchor.set(0.5, 1);
    this.squareFar[5].addChild(this.coin[5]);

    this.squareFar[6] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[6].tint = 0xF37DAE;
    this.squareFar[6].anchor.set(0.5);
    // this.squareFar[6].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance * 6));
    this.coin[6] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[6].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[6].scale.set(this.squareFar[0].width * 0.01);
    this.coin[6].anchor.set(0.5, 1);
    this.squareFar[6].addChild(this.coin[6]);

    this.squareFar[7] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[7].tint = 0xF37DAE;
    this.squareFar[7].anchor.set(0.5);
    // this.squareFar[7].position.set(this.randomPosition(), (this.initial_square_distance + this.square_distance * 7));
    this.coin[7] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[7].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[7].scale.set(this.squareFar[0].width * 0.01);
    this.coin[7].anchor.set(0.5, 1);
    this.squareFar[7].addChild(this.coin[7]);

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

  const score_coin = new SpriteActor('ball', this.app, 'common', 'coin.png');
  // circle1.setAnchor(this.circle.position.x, 0);
  score_coin.setPosition(this.app.getScreenSize().w * 0.85, this.app.getScreenSize().h * 0.02);
  score_coin.setScaleUpToScreenPercWidth(0.1);
  this.container.addChild(score_coin.getSprite());

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
  this.scoreText.position.x = score_coin.getSprite().position.x - 20;
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
    const circle1 = new SpriteActor('ball', this.app, 'common', 'ball.png');
    // circle1.setAnchor(this.circle.position.x, 0);
    circle1.setPosition(this.deviceScreenSize - this.circle.width/2, this.circleYPosition - this.circle.width/2);
    circle1.setScaleUpToScreenPercWidth(.16);  

    this.circle.addChild(circle1.getSprite());
    this.circle_bg.addChild(this.circle);

  //// TOUCH START
    this.circle_bg.on('touchstart', (interactionData: PIXI.interaction.InteractionEvent) => {      
         
      this.ball_click();
      
      // get initial tapped postion
      const point = interactionData.data.getLocalPosition(this.circle_bg);
      this.initialPoint = point;

  });

   //// TOUCH MOVE
    this.circle_bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
      const point = interactionData.data.getLocalPosition(this.circle);

      if(this.GAME_RESET !== true) {
        this.circle.position.x = Math.min(this.app.getScreenSize().w * 0.5 , this.circle.position.x + (point.x - this.initialPoint.x));
        this.circle.position.x = Math.max(this.circle.position.x , -(this.deviceScreenSize));
        this.container2d.position.x = -((this.circle.position.x + (point.x - this.initialPoint.x)) - this.deviceScreenSize);
        const bg_img_x = this.bg_img.getSprite().position.x + (point.x - this.initialPoint.x) / 8;
        this.bg_img.getSprite().position.x = Math.min(0, bg_img_x);
        // this.bg_img.getSprite().position.x = Math.max(this.circle.position.x + (point.x - this.initialPoint.x), -bg_img_x);
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

  stage3(){
    // SPEED
     // initial speed
     this.FREE_FALL = 12.5;
     this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 2;
     this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;
 
     // square speed
     this.SQUARE_VELOCITY = this.square_distance / (this.FREE_FALL * 2 - 1);
     // BACKGROUND

    this.bg_img = new SpriteActor('stage3-bg', this.app, 'lvl3', 'lv3_spacebg_mountains.jpg');

    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 0);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.bg_img.setScaleUpToScreenPercWidth(1.2);
    this.bg_img.setScaleUpToScreenPercHeight(1);
    this.bg_initial_x = -((this.bg_img.getSprite().width - this.app.getScreenSize().w) / 2);
    this.bg_img.getSprite().position.x = this.bg_initial_x;
    this.addChild(this.bg_img);
    
    this.container.addChild(this.bg_img.getSprite());
    this.container.setChildIndex(this.bg_img.getSprite(),0);

    // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('stage3-bg', this.app, 'lvl3', 'lv3_spacebg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = .4;
    this.gradient_bg.setScaleUpToScreenPercWidth(1); 
    this.gradient_bg.setScaleUpToScreenPercHeight(1);
    this.container.addChild(this.gradient_bg.getSprite());
    this.container.setChildIndex(this.gradient_bg.getSprite(),2)

    this.container.setChildIndex(this.scoreText,3)
  }

  stage2(){

    // SPEED
     // initial speed
    this.FREE_FALL = 15;
    this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 2;
    this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;


    // square speed
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
    
    this.container.addChild(this.bg_img.getSprite());
    this.container.setChildIndex(this.bg_img.getSprite(),0);
    // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('stage2-bg', this.app, 'lvl2', 'lv2_skybg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = .4;
    this.gradient_bg.setScaleUpToScreenPercWidth(1.2); 
    this.gradient_bg.setScaleUpToScreenPercHeight(1); 
    this.container.addChild(this.gradient_bg.getSprite());
    this.container.setChildIndex(this.gradient_bg.getSprite(),2)

    this.container.setChildIndex(this.scoreText,3)
  }

  stage1(){
    
    // SPEED
     // initial speed
     this.FREE_FALL = 20;
     this.INITIAL_VELOCITY = (this.app.getScreenSize().h * 0.02) * 2;
     this.GRAVITY = this.INITIAL_VELOCITY / this.FREE_FALL;
 
     // square speed
     this.SQUARE_VELOCITY = this.square_distance / (this.FREE_FALL * 2 - 1);

     // BACKGROUND
    // this.bg_img = new SpriteActor('stage2-bg', this.app, 'lvl1', 'lv1_gamearea_bgsample.png');
    this.bg_img = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.jpg');


    
    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 0);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.bg_img.setScaleUpToScreenPercWidth(1.2);
    this.bg_img.setScaleUpToScreenPercHeight(1);
    this.bg_initial_x = -( (this.bg_img.getSprite().width - this.app.getScreenSize().w) / 2);
    this.bg_img.getSprite().position.x = this.bg_initial_x;
    this.addChild(this.bg_img);
    
    this.container.addChild(this.bg_img.getSprite());
    this.container.setChildIndex(this.bg_img.getSprite(),0);

    // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('splash-bg', this.app, 'lvl1', 'lv1_mountainbg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = 1;
    this.gradient_bg.setScaleUpToScreenPercWidth(1); 
    this.gradient_bg.setScaleUpToScreenPercHeight(1);
    this.container.addChild(this.gradient_bg.getSprite());
    this.container.setChildIndex(this.gradient_bg.getSprite(),2)

  }

  renderStage(number: number){
    // ///////// background
    try{
      this.container.removeChild(this.bg_img.getSprite()); 
      this.container.removeChild(this.gradient_bg.getSprite())
    }catch(e){

      }

    switch (number) {
      case 1:
        this.stage1();
        break;
      case 2:
        this.stage2();
        break;
      default:
        this.stage3();
        break;
    }

  }

  update(_delta: number): void {
    
      // Project camera angle
      let posY = this.container2d.toLocal(this.squareY.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
      this.container2d.proj.setAxisY(posY, 1);

      if(this.GAME_RESET != true) {  
        // add square
        if(this.squareFar[0].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[0].position.y = this.squareFar[7].position.y + this.square_distance;
          this.squareFar[0].position.x = this.randomPosition();
          this.squareFar[0].addChild(this.coin[0]);
          }
        if(this.squareFar[1].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[1].position.y = this.squareFar[0].position.y + this.square_distance; 
          this.squareFar[1].position.x = this.randomPosition();
          this.squareFar[1].addChild(this.coin[1]);
        }
        if(this.squareFar[2].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[2].position.y = this.squareFar[1].position.y + this.square_distance; 
          this.squareFar[2].position.x = this.randomPosition();
          this.squareFar[2].addChild(this.coin[2]);
        }
        if(this.squareFar[3].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[3].position.y = this.squareFar[2].position.y + this.square_distance; 
          this.squareFar[3].position.x = this.randomPosition();
          this.squareFar[3].addChild(this.coin[3]);
        }
        if(this.squareFar[4].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[4].position.y = this.squareFar[3].position.y + this.square_distance;
          this.squareFar[4].position.x = this.randomPosition();
          this.squareFar[4].addChild(this.coin[4]);
        }
        if(this.squareFar[5].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[5].position.y = this.squareFar[4].position.y + this.square_distance;
          this.squareFar[5].position.x = this.randomPosition();
          this.squareFar[5].addChild(this.coin[5]);
        }
        if(this.squareFar[6].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[6].position.y = this.squareFar[5].position.y + this.square_distance;
          this.squareFar[6].position.x = this.randomPosition();
          this.squareFar[6].addChild(this.coin[6]);
        }
        if(this.squareFar[7].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[7].position.y = this.squareFar[6].position.y + this.square_distance; 
          this.squareFar[7].position.x = this.randomPosition();
          this.squareFar[7].addChild(this.coin[7]);
        }
      
        this.squareFar[0].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[1].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[2].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[3].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[4].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[5].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[6].position.y -= this.SQUARE_VELOCITY;
        this.squareFar[7].position.y -= this.SQUARE_VELOCITY;
        this.initial_square.position.y -= this.SQUARE_VELOCITY;
        
        if (this.circle.position.y <= 0 && this.TOUCHEND == false) {
          
          // IF BALL IS BOUNCING
          this.YVELOCITY -= this.GRAVITY;
          this.circle.position.y -= this.YVELOCITY;
          
        } else {
            
            
            let square = this.squareFar[this.bounce_count];
            console.log('square count: ', this.bounce_count);
            let bouncePosition = this.circle.position.x;

            // IF BALL FAILED TO BOUNCE ON SQUARE
            if(this.isInSquare(square, bouncePosition) === true ) {
              console.log('catched, bounce count: ', this.bounce_count);
              // IF BALL FALL ON COIN
              if(this.isCoined(square, bouncePosition) && this.TOUCHEND == false){
                this.scoreText.text = `${this.score+=1}`;

                // remove coin
                square.removeChildren();

                // change stage
                // point per stage

                if(this.stageProgress == this.stageLimit){
                  this.stage+=1;
                  this.stageProgress = 1;
                  this.renderStage(this.stage);
                }else{
                  this.stageProgress+=1;
                }
              }
              
              this.bounce_count += 1;
              console.log('bounced');

            } else {
              this.TOUCHEND = true;
              this.bounce_count = 0;
              console.log('uncatched', this.isInSquare(square,bouncePosition)); 
            }

            
            if(this.TOUCHEND == true) {
              console.log('falling');
              if(this.fall_position < this.circle.position.y) {
                // if ball out of screen
                this.reset_game();
              } else {
                // continuous falling
                this.YVELOCITY -= this.GRAVITY;
                this.circle.position.y -= this.YVELOCITY;
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

  resetStage(){
    this.stage = 1;
    this.stageProgress = 1;

    this.generateStartSquares();
    this.renderStage(1);

    // this.INITIAL_VELOCITY = this.app.getScreenSize().h * 0.02;
    // this.GRAVITY = this.INITIAL_VELOCITY * .05;
  }

  isCoined(square: projection.Sprite2d, bouncePosition: number){
    // square coordinates
    let square_start = (square.position.x/2.1) - (square.width/4);
    let square_end = (square.position.x/2.1) + (square.width/4);

    // coin width
    let coinWidth = (square.width/2)*.68;

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

    // IF BALL OUT OF SCREEN, RESET GAME
      console.log('reset game')
      // this.circle.position.y = 0;
      this.circle.position.y = 0; 
      this.circle.position.x = 0;
      this.container2d.position.x = this.deviceScreenSize;
      this.YVELOCITY = this.INITIAL_VELOCITY;
      this.GAME_RESET = true;
      this.TOUCHEND = false;
      this.bounce_count = 0;
      this.scoreText.text = `${this.score = 0}`;
      this.bg_img.getSprite().position.x = this.bg_initial_x;

      this.resetStage();
      // this.initial_square.position.y = this.initial_square_y;
      // this.squareFar[0].position.y = this.initial_square_distance;
      // this.squareFar[1].position.y = this.initial_square_distance + this.square_distance;
      // this.squareFar[2].position.y = this.initial_square_distance + this.square_distance * 2;
      // this.squareFar[3].position.y = this.initial_square_distance + this.square_distance * 3;
      // this.squareFar[4].position.y = this.initial_square_distance + this.square_distance * 4;
      // this.squareFar[5].position.y = this.initial_square_distance + this.square_distance * 5;
      // this.squareFar[6].position.y = this.initial_square_distance + this.square_distance * 6;
      // this.squareFar[7].position.y = this.initial_square_distance + this.square_distance * 7;
      // this.app.goToScene(2);

      
  }

  generateStartSquares(){
    this.initial_square.position.y = this.initial_square_y;
      this.squareFar[0].position.set(this.randomPosition(), this.initial_square_distance);
      this.squareFar[1].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance);
      this.squareFar[2].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance * 2);
      this.squareFar[3].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance * 3);
      this.squareFar[4].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance * 4);
      this.squareFar[5].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance * 5);
      this.squareFar[6].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance * 6);
      this.squareFar[7].position.set(this.randomPosition(), this.initial_square_distance + this.square_distance * 7);
  }

  isInSquare(square:projection.Sprite2d, ball_bounce: number){
    // if ball bounce at the center and square is in the center
    let square_position = square.position.x;
    let ball_position = ball_bounce;

    let square_start = (square.position.x/2.1) - (square.width/4);
    let square_end = (square.position.x/2.1) + (square.width/4);
    
    console.log('bounce_count', this.bounce_count);
    
    if (ball_position > square_start && ball_position < square_end) {
      return true;
    } else {
      return false;
    }
  }

  remove(): void {
  }

  ball_click(): void {
    // bounce ball when tapped
    if(this.GAME_RESET == false) {
     this.TOUCHEND = false;
    } else {
      this.GAME_RESET = false;
    }
  }

}