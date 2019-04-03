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
  animateParam: number = 7; //points needed to animate tiles
  animate: boolean = false;
  hit1: string = 'left';
  hit3: string = 'left';
  hit5: string = 'left';
  hit7: string = 'left';
  squareFarPosition: any = [];
  squareFarToAnimate: any = [];
  animatedSquares: any = [1,3,5];

  // coins
  coin: projection.Sprite2d [] = [];
  score_coin: SpriteActor;
  coinAnimate: boolean = false;

  // score
  scoreText: Text;
  score: number = 0;

  // stage
  stageText: Text;
  stage: number = 1;
  stageProgress: number = 1;
  stageLimit: number = 5;

  // how to win
  instructionContainer: Graphics;
  swipe: SpriteActor;
  taptostart: SpriteActor;

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

  this.coinAnimate = false;

  ///// BACKGROUND IMAGE
  console.log('initial velocity', this.INITIAL_VELOCITY);
  console.log('gravity', this.GRAVITY);
  console.log('initial square distance', this.initial_square_distance);
  console.log('square fall pos: ', this.initial_square_y);
  console.log('square distance: ', this.square_distance);
  console.log('--------');
  console.log('device height', this.app.getScreenSize().h);
  console.log('device width', this.app.getScreenSize().w);

   // stage
   this.stageText = new Text('',{fontFamily : 'Arial', fontSize: 100, fill : 0x000000, align : 'center'});
   this.container.addChild(this.stageText);

   this.renderStage(1);
     
  /////////// SQUARES

  // GUIDE SQUARE ------------------
    this.initial_square = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.initial_square.anchor.set(0.5);
    this.initial_square.position.set(0, this.initial_square_y);

    const s_img_i = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_i.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_i.anchor.set(0.5, 0.5);
    s_img_i.position.y = 0;
    this.initial_square.addChild(s_img_i);
    
    
    // square 0 ------------------
    this.squareFar[0] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[0].tint = 0;
    this.squareFar[0].anchor.set(0.5);
    this.coin[0] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[0].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[0].scale.set(this.squareFar[0].width * 0.008);
    this.coin[0].anchor.set(0.5, 1);
    
    const s_img_0 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_0.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_0.anchor.set(0.5, 0.5);
    s_img_0.position.y = 0;
    this.squareFar[0].addChild(s_img_0);
    this.squareFar[0].addChild(this.coin[0]);
    
    
    // square 1 ------------------
    this.squareFar[1] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[1].tint = 0xF37DAE;
    this.squareFar[1].anchor.set(0.5);
    this.coin[1] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[1].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[1].scale.set(this.squareFar[0].width * 0.008);
    this.coin[1].anchor.set(0.5, 1);
    
    const s_img_1 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_1.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_1.anchor.set(0.5, 0.5);
    s_img_1.position.y = 0;
    this.squareFar[1].addChild(s_img_1);
    this.squareFar[1].addChild(this.coin[1]);
    

    // square 2 ------------------
    this.squareFar[2] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[2].tint = 0xF37DAE;
    this.squareFar[2].anchor.set(0.5);
    this.coin[2] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[2].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[2].scale.set(this.squareFar[0].width * 0.008);
    this.coin[2].anchor.set(0.5, 1);
    
    const s_img_2 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_2.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_2.anchor.set(0.5, 0.5);
    s_img_2.position.y = 0;
    this.squareFar[2].addChild(s_img_2);
    this.squareFar[2].addChild(this.coin[2]);

    // square 3 ------------------
    this.squareFar[3] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[3].tint = 0xF37DAE;
    this.squareFar[3].anchor.set(0.5);
    this.coin[3] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[3].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[3].scale.set(this.squareFar[0].width * 0.008);
    this.coin[3].anchor.set(0.5, 1);
    
    const s_img_3 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_3.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_3.anchor.set(0.5, 0.5);
    s_img_3.position.y = 0;
    this.squareFar[3].addChild(s_img_3);
    this.squareFar[3].addChild(this.coin[3]);

    // square 4 ------------------
    this.squareFar[4] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[4].tint = 0xF37DAE;
    this.squareFar[4].anchor.set(0.5);
    this.coin[4] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[4].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[4].scale.set(this.squareFar[0].width * 0.008);
    this.coin[4].anchor.set(0.5, 1);
    
    const s_img_4 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_4.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_4.anchor.set(0.5, 0.5);
    s_img_4.position.y = 0;
    this.squareFar[4].addChild(s_img_4);
    this.squareFar[4].addChild(this.coin[4]);

    // square 5 ------------------
    this.squareFar[5] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[5].tint = 0xF37DAE;
    this.squareFar[5].anchor.set(0.5);
    this.coin[5] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[5].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[5].scale.set(this.squareFar[0].width * 0.008);
    this.coin[5].anchor.set(0.5, 1);

    const s_img_5 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_5.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_5.anchor.set(0.5, 0.5);
    s_img_5.position.y = 0;
    this.squareFar[5].addChild(s_img_5);
    this.squareFar[5].addChild(this.coin[5]);
    
    // square 6 ------------------
    this.squareFar[6] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[6].tint = 0xF37DAE;
    this.squareFar[6].anchor.set(0.5);
    this.coin[6] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[6].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[6].scale.set(this.squareFar[0].width * 0.008);
    this.coin[6].anchor.set(0.5, 1);
    this.squareFar[6].addChild(this.coin[6]);

    const s_img_6 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_6.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_6.anchor.set(0.5, 0.5);
    s_img_6.position.y = 0;
    this.squareFar[6].addChild(s_img_6);
    this.squareFar[6].addChild(this.coin[6]);

    // square 7 ------------------
    this.squareFar[7] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[7].tint = 0xF37DAE;
    this.squareFar[7].anchor.set(0.5);
    this.coin[7] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[7].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[7].scale.set(this.squareFar[0].width * 0.008);
    this.coin[7].anchor.set(0.5, 1);
    this.squareFar[7].addChild(this.coin[7]);

    // animating coin --------------
    this.coin[100] = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/coin.png'));
    this.coin[100].proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.coin[100].scale.set(this.squareFar[0].width * 0.01);
    this.coin[100].anchor.set(0.5, 1);

    const s_img_7 = new PIXI.projection.Sprite2d(PIXI.Texture.fromImage('/assets/platform.png'));
    s_img_7.scale.set(-this.initial_square.width * 0.0062, -this.initial_square.height * 0.011);
    s_img_7.anchor.set(0.5, 0.5);
    s_img_7.position.y = 0;
    this.squareFar[7].addChild(s_img_7);
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
      const point = interactionData.data.getLocalPosition(this.circle);
      this.initialPoint = point;

  });

   //// TOUCH MOVE
    this.circle_bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
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

      // how to win
    this.instructionContainer = new Graphics();
    this.instructionContainer.beginFill(0x000).drawRoundedRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h, 0);
    this.instructionContainer.position.x = 0;
    this.instructionContainer.position.y = 0;
    this.instructionContainer.alpha = .4;
    this.container.addChild(this.instructionContainer);
    this.instructionContainer.interactive = true;
    this.instructionContainer.on('pointerup', () => {
      this.removeInstruction();
    })
    
    this.swipe = new SpriteActor('int-bg', this.app, 'common', 'Instruction-group.png');
    this.swipe.setAnchor(.5, .5);
    this.swipe.setPosition(this.app.getScreenSize().w * .5, this.app.getScreenSize().h * .85);
    this.swipe.setScaleUpToScreenPercWidth(.9);
    
    this.container.addChild(this.swipe.getSprite());

    this.taptostart = new SpriteActor('tap-bg', this.app, 'common', 'TAP TO START.png');
    this.taptostart.setAnchor(.5, .5);
    this.taptostart.setPosition(this.app.getScreenSize().w * .5, this.app.getScreenSize().h * .4);
    this.taptostart.setScaleUpToScreenPercWidth(.7);
    this.container.addChild(this.taptostart.getSprite());
    // end of how to win


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

  removeInstruction(){
    this.container.removeChild(this.instructionContainer);
    this.container.removeChild(this.swipe.getSprite());
    this.container.removeChild(this.taptostart.getSprite());
  }

  renderStage(number: number){

    try{

      if( number <= 3) {
        this.container.removeChild(this.bg_img.getSprite()); 
        this.container.removeChild(this.gradient_bg.getSprite());
      }
      
    }catch(e){

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
    if(this.animate == false) return false;

  let moveSpeed = 8;
  let moveLength = this.app.getScreenSize().w * .40;

    // square1
  if(this.squareFarToAnimate[1] == true){
    let maxPosition1 = this.squareFarPosition[1] + moveLength;

    let moveRight1 = this.squareFar[1].x += moveSpeed;
    let moveLeft = this.squareFar[1].x -= moveSpeed;
    
    if(this.squareFar[1].x <= maxPosition1 && this.hit1 == 'left'){
      this.hit1 = 'left';
      this.squareFar[1].x = moveRight1;
    }else{
      if(this.squareFar[1].x >= this.squareFarPosition[1]){
        this.hit1 = 'right';
        this.squareFar[1].x -= moveSpeed;
      }else{
        this.hit1 = 'left';
      }
      
    }
  }

  if(this.squareFarToAnimate[3] == true){
    let maxPosition3 = this.squareFarPosition[3] + moveLength;

    let moveRight3 = this.squareFar[3].x += moveSpeed;
    let moveLeft = this.squareFar[3].x -= moveSpeed;
    
    if(this.squareFar[3].x <= maxPosition3 && this.hit3 == 'left'){
      this.hit3 = 'left';
      this.squareFar[3].x = moveRight3;
    }else{
      if(this.squareFar[3].x >= this.squareFarPosition[3]){
        this.hit3 = 'right';
        this.squareFar[3].x -= moveSpeed;
      }else{
        this.hit3 = 'left';
      }
      
    }
  }

  if(this.squareFarToAnimate[5] == true){
      let maxPosition5 = this.squareFarPosition[1] + moveLength;

      let moveRight5 = this.squareFar[5].x += moveSpeed;
      
      if(this.squareFar[5].x <= maxPosition5 && this.hit5 == 'left'){
        this.hit5 = 'left';
        this.squareFar[5].x = moveRight5;
      }else{
        if(this.squareFar[5].x >= this.squareFarPosition[5]){
          this.hit5 = 'right';
          this.squareFar[5].x -= moveSpeed;
        }else{
          this.hit5 = 'left';
        }
        
      }
    }

    if(this.squareFarToAnimate[7] == true){
      let maxPosition7 = this.squareFarPosition[1] + moveLength;

      let moveRight7 = this.squareFar[7].x += moveSpeed;
      
      if(this.squareFar[7].x <= maxPosition7 && this.hit7 == 'left'){
        this.hit7 = 'left';
        this.squareFar[7].x = moveRight7;
      }else{
        if(this.squareFar[7].x >= this.squareFarPosition[7]){
          this.hit7 = 'right';
          this.squareFar[7].x -= moveSpeed;
        }else{
          this.hit7 = 'left';
        }
        
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

    // animate square
    this.animate = true;
    try{
      this.animateSquare();
    }catch(error){
      // console.log("animate error", error);
    }

    this.coinAnimation();

      // Project camera angle
      let posY = this.container2d.toLocal(this.squareY.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
      this.container2d.proj.setAxisY(posY, 1);

      if(this.GAME_RESET != true) {  
        // add square
        if(this.squareFar[0].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[0].position.y = this.squareFar[7].position.y + this.square_distance;
          this.squareFar[0].position.x = this.randomPosition();
          this.squareFar[0].addChild(this.coin[0]);
          this.squareFarPosition[0] = this.squareFar[0].position.x;
          this.squareFarToAnimate[0] = this.isAnimating();
          }
        if(this.squareFar[1].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[1].position.y = this.squareFar[0].position.y + this.square_distance; 
          this.squareFar[1].position.x = this.randomPosition();
          this.squareFar[1].addChild(this.coin[1]);
          this.squareFarPosition[1] = this.squareFar[1].position.x;
          this.squareFarToAnimate[1] = this.isAnimating();

        }
        if(this.squareFar[2].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[2].position.y = this.squareFar[1].position.y + this.square_distance; 
          this.squareFar[2].position.x = this.randomPosition();
          this.squareFar[2].addChild(this.coin[2]);
          this.squareFarPosition[2] = this.squareFar[2].position.x;
          this.squareFarToAnimate[2] = this.isAnimating();
        }
        if(this.squareFar[3].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[3].position.y = this.squareFar[2].position.y + this.square_distance; 
          this.squareFar[3].position.x = this.randomPosition();
          this.squareFar[3].addChild(this.coin[3]);
          this.squareFarPosition[3] = this.squareFar[3].position.x;
          this.squareFarToAnimate[3] = this.isAnimating();
        }
        if(this.squareFar[4].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[4].position.y = this.squareFar[3].position.y + this.square_distance;
          this.squareFar[4].position.x = this.randomPosition();
          this.squareFar[4].addChild(this.coin[4]);
          this.squareFarPosition[4] = this.squareFar[4].position.x;
          this.squareFarToAnimate[4] = this.isAnimating();
        }
        if(this.squareFar[5].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[5].position.y = this.squareFar[4].position.y + this.square_distance;
          this.squareFar[5].position.x = this.randomPosition();
          this.squareFar[5].addChild(this.coin[5]);
          this.squareFarPosition[5] = this.squareFar[5].position.x;
          this.squareFarToAnimate[5] = this.isAnimating();
        }
        if(this.squareFar[6].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[6].position.y = this.squareFar[5].position.y + this.square_distance;
          this.squareFar[6].position.x = this.randomPosition();
          this.squareFar[6].addChild(this.coin[6]);
          this.squareFarPosition[6] = this.squareFar[6].position.x;
          this.squareFarToAnimate[6] = this.isAnimating();
        }
        if(this.squareFar[7].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[7].position.y = this.squareFar[6].position.y + this.square_distance; 
          this.squareFar[7].position.x = this.randomPosition();
          this.squareFar[7].addChild(this.coin[7]);
          this.squareFarPosition[7] = this.squareFar[7].position.x;
          this.squareFarToAnimate[7] = this.isAnimating();
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
          this.air_time -= 1;
        } else {

            let square = this.squareFar[this.bounce_count];
            let bouncePosition = this.circle.position.x;

            // IF BALL IS ON AIR
            if ( this.air_time <= -1 || this.air_time <= 1 ) {

              // IF BALL FAILED TO BOUNCE ON SQUARE
              if(this.isInSquare(square, bouncePosition) === true ) {
                // IF BALL FALL ON COIN
                if(this.isCoined(square, bouncePosition) && this.TOUCHEND == false){
                  this.app.getSoundPlayer().play('coin');
                  this.scoreText.text = `${this.score += 1}`;

                  // console.log("coin position: x", this.coin[this.bounce_count].x, "y", this.coin[this.bounce_count].y);
                  // console.log("score coin y", this.score_coin.getSprite().y)
                  
                  // remove coin
                  square.removeChildAt(1);
                  // this.animateCoin(this.squareFar[this.bounce_count]);

                  // animate square
                  if(this.score >= this.animateParam){
                    this.animate = true;
                  }

                  if(this.stageProgress == this.stageLimit){
                    this.stage += 1;
                    this.stageProgress = 1;
                    this.renderStage(this.stage);
                  }else{
                    this.stageProgress+=1;
                  }
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
    this.animate = false;
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
      this.app.goToScene(4, {score: this.score});

    // IF BALL OUT OF SCREEN, RESET GAME
      this.circle.position.y = 0; 
      this.circle.position.x = 0;
      this.container2d.position.x = this.deviceScreenSize;
      this.YVELOCITY = this.INITIAL_VELOCITY;
      this.GAME_RESET = true;
      this.TOUCHEND = false;
      this.bounce_count = 0;
      setTimeout(()=>{ this.scoreText.text = `${this.score = 0}`;},100);
      this.bg_img.getSprite().position.x = this.bg_initial_x;
      this.resetStage();
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
      this.GAME_RESET = false;
    }
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
  }

  stage2(){

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
  }

}