import { Scene } from '@src/core/scene';
import { Text, Container, Graphics, Texture, projection } from 'pixi.js';
import 'pixi-projection';
import { App } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';

export class GameScene extends Scene {

  // objects
  bg: Graphics;
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
  YVELOCITY: number;
  INITIAL_VELOCITY = this.app.getScreenSize().h * 0.02;
  GRAVITY: number = this.INITIAL_VELOCITY * .05;

  // squares position
  SQUARE_HOP_POSITION = this.app.getScreenSize().h * 0.15;
  last_square_position: number;
  initial_square_y: number = this.app.getScreenSize().h * 0.18;
  initial_square_distance: number = this.app.getScreenSize().h * 0.960;
  square_distance: number = this.initial_square_distance - this.initial_square_y;

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

  // score
  scoreText: Text;
  score: number = 0;

  init(): void {
    
    this.bigWhiteTexture = new PIXI.Texture(PIXI.Texture.WHITE.baseTexture);
    this.bigWhiteTexture.orig.width = this.CIRCLEWIDTH * 6;
    this.bigWhiteTexture.orig.height = this.CIRCLEWIDTH * 4;
    this.last_square_position = this.initial_square_distance + (this.initial_square_distance - this.initial_square_y) * 8;
  }

  start(): void {

  ///// BACKGROUND IMAGE

    
    this.bg_img = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.png');
    this.bg_img.setScaleUpToScreenPercWidth(1.2);

    const bg_initial_x = -((this.bg_img.getSprite().width - this.app.getScreenSize().w) / 2);

    this.bg_img.getSprite().position.x = bg_initial_x;
    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 0);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.addChild(this.bg_img);
    this.container.addChild(this.bg);


  /////////// SQUARES
    
    this.initial_square = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.initial_square.tint = 0xF37DAE;
    this.initial_square.anchor.set(0.5);
    this.initial_square.position.set(0, this.initial_square_y);

    const square_coin = new SpriteActor('ball', this.app, 'common', 'coin.png');
    square_coin.setAnchor(0.5, 0);
    square_coin.setScaleUpToScreenPercWidth(0.15);

    console.log(square_coin);

    // const square_coin_container = new PIXI.projection.Sprite2d(square_coin.getDisplayObject()));
    // square_coin_container.anchor.set(0.5, 1.0);
    

    this.squareFar[0] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[0].tint = 0xF37DAE;
    this.squareFar[0].anchor.set(0.5);
    this.squareFar[0].position.set(0, this.initial_square_distance);
    this.squareFar[0].addChild(square_coin.getSprite());
    
    this.squareFar[1] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[1].tint = 0xF37DAE;
    this.squareFar[1].anchor.set(0.5);
    this.squareFar[1].position.set(this.app.getScreenSize().w * 0.5, (this.initial_square_distance + this.square_distance));

    this.squareFar[2] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[2].tint = 0xF37DAE;
    this.squareFar[2].anchor.set(0.5);
    this.squareFar[2].position.set(-(this.app.getScreenSize().w * 0.5), (this.initial_square_distance + this.square_distance * 2));

    this.squareFar[3] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[3].tint = 0xF37DAE;
    this.squareFar[3].anchor.set(0.5);
    this.squareFar[3].position.set(this.app.getScreenSize().w * 0.5, (this.initial_square_distance + this.square_distance * 3));

    this.squareFar[4] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[4].tint = 0xF37DAE;
    this.squareFar[4].anchor.set(0.5);
    this.squareFar[4].position.set(this.app.getScreenSize().w * 0.25, (this.initial_square_distance + this.square_distance * 4));
    
    this.squareFar[5] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[5].tint = 0xF37DAE;
    this.squareFar[5].anchor.set(0.5);
    this.squareFar[5].position.set(0, (this.initial_square_distance + this.square_distance * 5));

    this.squareFar[6] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[6].tint = 0xF37DAE;
    this.squareFar[6].anchor.set(0.5);
    this.squareFar[6].position.set(-(this.app.getScreenSize().w * 0.25), (this.initial_square_distance + this.square_distance * 6));

    this.squareFar[7] = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar[7].tint = 0xF37DAE;
    this.squareFar[7].anchor.set(0.5);
    this.squareFar[7].position.set(0, (this.initial_square_distance + this.square_distance * 7));

    this.squareY = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.squareY.anchor.set(0.5);
    this.squareY.position.set(this.app.getScreenSize().w / 2, 0);

  // PROJECTION CONTAINER
    this.container2d = new PIXI.projection.Container2d();
    this.container2d.position.set(this.app.getScreenSize().w / 2, this.app.getScreenSize().h);
    this.container.addChild(this.container2d);

    //illuminate the sprite from two points!
    var lightY = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
    lightY.tint = 0x000000;
    lightY.anchor.set(0.5, 0);
    lightY.scale.set(this.app.getScreenSize().w * 0.2, this.app.getScreenSize().h);
    lightY.alpha = 0;
    this.container2d.addChildAt(lightY, 0);

  // Gradient Overlay --- > from top screen to make fading squares effect
    this.gradient_bg = new SpriteActor('splash-bg', this.app, 'lvl1', 'lv1_mountainbg_gradientoverlay.png');
    this.gradient_bg.getSprite().alpha = 0.9;
    this.gradient_bg.setScaleUpToScreenPercWidth(1);
    this.container.addChild(this.gradient_bg.getSprite());
    
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

  update(_delta: number): void {
    
      // Project camera angle
      let posY = this.container2d.toLocal(this.squareY.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
      this.container2d.proj.setAxisY(posY, 1);

      if(this.GAME_RESET != true) {       
        if(this.squareFar[0].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[0].position.y = this.squareFar[7].position.y + this.square_distance; }
        if(this.squareFar[1].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[1].position.y = this.squareFar[0].position.y + this.square_distance; }
        if(this.squareFar[2].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[2].position.y = this.squareFar[1].position.y + this.square_distance; }
        if(this.squareFar[3].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[3].position.y = this.squareFar[2].position.y + this.square_distance; }
        if(this.squareFar[4].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[4].position.y = this.squareFar[3].position.y + this.square_distance; }
        if(this.squareFar[5].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[5].position.y = this.squareFar[4].position.y + this.square_distance; }
        if(this.squareFar[6].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[6].position.y = this.squareFar[5].position.y + this.square_distance; }
        if(this.squareFar[7].position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar[7].position.y = this.squareFar[6].position.y + this.square_distance; }

        this.squareFar[0].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[1].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[2].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[3].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[4].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[5].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[6].position.y -= this.INITIAL_VELOCITY;
        this.squareFar[7].position.y -= this.INITIAL_VELOCITY;
        this.initial_square.position.y -= this.INITIAL_VELOCITY;
        
        if(this.circle.position.y <= 0 && this.TOUCHEND == false) {
          console.log('ball bouncing');
          // IF BALL IS BOUNCING
          this.YVELOCITY -= this.GRAVITY;
          this.circle.position.y -= this.YVELOCITY;
          
        } else {

          
          // IF BALL FAILED TO BOUNCE
          // if(this.TOUCHEND == true) {
          //   console.log('ball failed to bounce');
          //   this.reset_game();
          // } else {

            console.log('stilltouched');
            // SCREEN STILL ON TOUCH
         
            // // SCREEN STILL ON TOUCH

            console.log('stilltouched');
            let square = this.squareFar[this.bounce_count];
            let bouncePosition = this.circle.position.x;
            if(this.isInSquare(square,bouncePosition)) {

              if(this.isCoined(square, bouncePosition) && this.TOUCHEND == false){
                this.scoreText.text = `${this.score+=1}`;
              }
              
              // console.log("in square");
            } else {
              this.TOUCHEND = true;

              console.log("outside of square");
            }

            // detect current falling square
            this.bounce_count += 1;
            if (this.bounce_count > this.squareFar.length - 1) {
              this.bounce_count = 0;
            }

            if(this.TOUCHEND == true) {
              if(this.fall_position < this.circle.position.y) {
                console.log(this.fall_position);
                this.reset_game();
              } else {
                console.log('continous falling');
                this.YVELOCITY -= this.GRAVITY;
                this.circle.position.y -= this.YVELOCITY;
              }
              

            } else {
              this.YVELOCITY = this.INITIAL_VELOCITY;
              this.YVELOCITY -= this.GRAVITY;
              this.circle.position.y -= this.YVELOCITY;
            }
            
          // }
        
      }
  }
}

  isCoined(square: projection.Sprite2d, bouncePosition: number){
    // square coordinates
    let square_start = (square.position.x/2.1) - (square.width/4);
    let square_end = (square.position.x/2.1) + (square.width/4);

    // coin width
    let coinWidth = (square.width/2)*.30;

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

    // PLAYER STOP ON TOUCHING
    // if(this.fall_position < this.circle.position.y) {

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

      this.initial_square.position.y = this.initial_square_y;
      this.squareFar[0].position.y = this.initial_square_distance;
      this.squareFar[1].position.y = this.initial_square_distance + this.square_distance;
      this.squareFar[2].position.y = this.initial_square_distance + this.square_distance * 2;
      this.squareFar[3].position.y = this.initial_square_distance + this.square_distance * 3;
      this.squareFar[4].position.y = this.initial_square_distance + this.square_distance * 4;
      this.squareFar[5].position.y = this.initial_square_distance + this.square_distance * 5;
      this.squareFar[6].position.y = this.initial_square_distance + this.square_distance * 6;
      this.squareFar[7].position.y = this.initial_square_distance + this.square_distance * 7;
    // } else {

      // BALL FALLING
      // console.log('ballmove');
      // this.YVELOCITY -= this.GRAVITY;
      // this.circle.position.y -= this.YVELOCITY;
      
    // }

  }

  isInSquare(square:projection.Sprite2d, ball_bounce: number){
    // if ball bounce at the center and square is in the center
    let square_position = square.position.x;
    let ball_position = ball_bounce;


    // for center square || square0
    // let square_start = square.position.x - (square.width/4);
    // let square_end = square.position.x + (square.width/4);

    // for right square || square1
    let square_start = (square.position.x/2.1) - (square.width/4);
    let square_end = (square.position.x/2.1) + (square.width/4);
    
    // width of square
    // console.log(this.squareFar[0].width);
    // console.log("square position", this.squareFar[0].position.x)
    // console.log("square start coordinate", (this.squareFar[0].width/2) - this.squareFar[0].position.x )  
    // if ball bounced in center of square
    if(ball_position > square_start && ball_position < square_end){
      return true;
    }else{
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