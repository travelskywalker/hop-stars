import { Scene } from '@src/core/scene';
import { Text, Container, Graphics } from 'pixi.js';
import 'pixi-projection';
import { App } from '@src/app';

export class GameScene extends Scene {


  // objects
  bg: Graphics;
  circle: Graphics;
  circleYPosition: number;
  square_bg: Graphics;
  circle_bg: Graphics;
  CIRCLEWIDTH = this.app.getScreenSize().w * .08;

  // scrollable points
  initialPoint: any;
  finalPoint: any;

  // bounce speed
  INITIAL_VELOCITY = this.app.getScreenSize().h * 0.02;
  YVELOCITY: number;
  GRAVITY: number = this.INITIAL_VELOCITY * .05;

  // squares
  SQUARE_HOP_POSITION = this.app.getScreenSize().h * 0.15;

  // flag
  GAME_RESET: boolean = false;
  TOUCHEND: boolean = false;
  TICKSTARTED: boolean = false;

  // camera projection
  container2d: PIXI.projection.Container2d;
  squareY: PIXI.Sprite;

  init(): void {
    console.log('game scene');
    // this.INITIAL_VELOCITY = this.INITIAL_VELOCITY * 2;
    // this.GRAVITY = this.GRAVITY * 4;
    console.log('velocity', this.INITIAL_VELOCITY);
    console.log('gravity', this.GRAVITY);
  }

  start(): void {

    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 1);
    // this.bg.beginFill(0x000000, 1);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.container.addChild(this.bg);
    
  /////////// PROJECTION
    
    var bigWhiteTexture = new PIXI.Texture(PIXI.Texture.WHITE.baseTexture);
    bigWhiteTexture.orig.width = this.CIRCLEWIDTH * 6;
    bigWhiteTexture.orig.height = this.CIRCLEWIDTH * 4;

    var initial_square = new PIXI.projection.Sprite2d(bigWhiteTexture);
    initial_square.tint = 0X70DFC8;
    initial_square.anchor.set(0.5);
    initial_square.position.set(0, this.app.getScreenSize().h * 0.18);

    var squareFar0 = new PIXI.projection.Sprite2d(bigWhiteTexture);
    squareFar0.tint = 0X70DFC8;
    squareFar0.anchor.set(0.5);
    squareFar0.position.set(this.app.getScreenSize().w * 0.4, this.app.getScreenSize().h * 0.98);
    
    var squareFar1 = new PIXI.projection.Sprite2d(bigWhiteTexture);
    squareFar1.tint = 0X70DFC8;
    squareFar1.anchor.set(0.5);
    squareFar1.position.set(-(this.app.getScreenSize().w * 0.2), this.app.getScreenSize().h * 1.86);

    var squareFar2 = new PIXI.projection.Sprite2d(bigWhiteTexture);
    squareFar2.tint = 0X70DFC8;
    squareFar2.anchor.set(0.5);
    squareFar2.position.set(this.app.getScreenSize().w * 0.6, this.app.getScreenSize().h * 2.70);

    var squareFar3 = new PIXI.projection.Sprite2d(bigWhiteTexture);
    squareFar3.tint = 0X70DFC8;
    squareFar3.anchor.set(0.5);
    squareFar3.position.set(this.app.getScreenSize().w * 0.4, this.app.getScreenSize().h * 3.58);

    var squareFar4 = new PIXI.projection.Sprite2d(bigWhiteTexture);
    squareFar4.tint = 0X70DFC8;
    squareFar4.anchor.set(0.5);
    squareFar4.position.set(-(this.app.getScreenSize().w * 0.4), this.app.getScreenSize().h * 4.46);
    
    var squareFar5 = new PIXI.projection.Sprite2d(bigWhiteTexture);
    squareFar5.tint = 0X70DFC8;
    squareFar5.anchor.set(0.5);
    squareFar5.position.set(-(this.app.getScreenSize().w * 0.4), this.app.getScreenSize().h * 5.30);
    

    this.squareY = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.squareY.tint = 0x000000;
    this.squareY.anchor.set(0.5);
    this.squareY.position.set(this.app.getScreenSize().w / 2, 0);

    // create a new Sprite from an image path
    this.container2d = new PIXI.projection.Container2d();
    this.container2d.position.set(this.app.getScreenSize().w / 2, this.app.getScreenSize().h);
    
    this.container.addChild(this.container2d);
    this.container.addChild(this.squareY);

    // bunny hops
    // var bunny = new PIXI.projection.Sprite2d( PIXI.Texture.fromImage('/assets/box.png'));
    // bunny.anchor.set(0.5, 0);
    // bunny.position.x = 0;
    // bunny.position.y = this.container.height * 2;
    // bunny.scale.set(this.app.getScreenSize().h * 0.001);
    
    this.container2d.addChild(initial_square);
    this.container2d.addChild(squareFar0);
    this.container2d.addChild(squareFar1);
    this.container2d.addChild(squareFar2);
    this.container2d.addChild(squareFar3);
    this.container2d.addChild(squareFar4);
    this.container2d.addChild(squareFar5);

    //illuminate the sprite from two points!
    var lightY = new PIXI.projection.Sprite2d(PIXI.Texture.WHITE);
    lightY.anchor.set(0.5, 0);
    lightY.scale.set(this.app.getScreenSize().w * 0.1, this.app.getScreenSize().h);
    lightY.alpha = 0;
    this.container2d.addChildAt(lightY, 0);

    // this.container.addChild(this.container2d);


  //////////////////////////////


    this.GAME_RESET = true;

    this.square_bg = new Graphics();
    this.square_bg.beginFill(0x000000, 0);
    this.square_bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.square_bg.endFill();
    this.container.addChild(this.square_bg);
    
    // CIRCLE BACKGROUND
    this.circle_bg = new Graphics();
    this.circle_bg.beginFill(0xF2F2F2, 0);
    this.circle_bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.circle_bg.endFill();
    this.circle_bg.interactive = true;
    this.container.addChild(this.circle_bg);

    // CIRCLE
    this.circleYPosition = this.app.getScreenSize().h - this.app.getScreenSize().h * 0.2;
    this.circle = new Graphics();
    this.circle.beginFill(0X942363);
    this.circle.drawCircle(this.app.getScreenSize().w * 0.5, this.circleYPosition, this.CIRCLEWIDTH);
    this.circle_bg.addChild(this.circle);

    this.circle_bg.on('touchstart', (interactionData: PIXI.interaction.InteractionEvent) => {      
      
      this.TOUCHEND = false;
      this.ball_click();
      
      // get initial tapped postion
      const point = interactionData.data.getLocalPosition(this.circle_bg);
      this.initialPoint = point;
  });

    this.circle_bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
      const point = interactionData.data.getLocalPosition(this.circle);
      // horizontal position
      this.circle.position.x = Math.min(this.app.getScreenSize().w * 0.5 , this.circle.position.x + (point.x - this.initialPoint.x));
      this.circle.position.x = Math.max(this.circle.position.x , -(this.app.getScreenSize().w * 0.5));
    });
    this.circle_bg.on('touchend', () => {
      this.TOUCHEND = true;
    });


    console.log(squareFar0.position.y);
    console.log(squareFar1.position.y);
    console.log(squareFar2.position.y);
    console.log(squareFar3.position.y);


    this.YVELOCITY = this.INITIAL_VELOCITY;
    const fall_position = this.app.getScreenSize().h - this.circleYPosition;
    this.app._app.ticker.add(() => {
      
      
      let posY = this.container2d.toLocal(this.squareY.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
      this.container2d.proj.setAxisY(posY, 1);

      if(this.GAME_RESET != true) {

        // if(bunny.position.y <= 0 ) {
        //   bunny.position.y = 0;
        //   bunny.position.y = this.container.height * 2;
        // } else {
        //   bunny.position.y -= this.INITIAL_VELOCITY * 2;
        // }


        squareFar0.position.y -= this.INITIAL_VELOCITY;
        squareFar1.position.y -= this.INITIAL_VELOCITY;
        squareFar2.position.y -= this.INITIAL_VELOCITY;
        squareFar3.position.y -= this.INITIAL_VELOCITY;
        squareFar4.position.y -= this.INITIAL_VELOCITY;
        squareFar5.position.y -= this.INITIAL_VELOCITY;
        initial_square.position.y -= this.INITIAL_VELOCITY;
        
        if( this.circle.position.y <= 0 ) {
          
          // IF BALL IS BOUNCING
          console.log('bouncing');
          this.circle.position.y -= this.YVELOCITY;
          this.YVELOCITY -= this.GRAVITY;

        } else {

          // IF BALL FAILED TO BOUNCE
          if(this.TOUCHEND == true) {

            // PLAYER STOP ON TOUCHING
            if(fall_position < this.circle.position.y) {

              // IF BALL OUT OF SCREEN, RESET GAME
              console.log('reset game')
              this.circle.position.y = 0;
              this.circle.position.x = 0;
              this.YVELOCITY = this.INITIAL_VELOCITY;
              this.GAME_RESET = true;
            } else {

              // BALL FALLING
              console.log('ballmove');
              this.circle.position.y -= this.YVELOCITY;
              this.YVELOCITY -= this.GRAVITY;
            }
          } else {
            
            // SCREEN STILL ON TOUCH
            this.YVELOCITY = this.INITIAL_VELOCITY
            this.circle.position.y -= this.YVELOCITY;
          }
        }
      }
      
    });




  }

  update(_delta: number): void {
    // console.log(_delta);
  }

  remove(): void {
  }

  ball_click(): void {
    // bounce ball when tapped
    if(this.GAME_RESET == false) {
      if(this.TICKSTARTED == false) {
        this.TICKSTARTED = true;
      }
    } else {
      this.GAME_RESET = false;
    }
  }

}