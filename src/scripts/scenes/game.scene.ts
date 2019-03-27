import { Scene } from '@src/core/scene';
import { Text, Container, Graphics, Texture, projection } from 'pixi.js';
import 'pixi-projection';
import { App } from '@src/app';

export class GameScene extends Scene {

  // objects
  bg: Graphics;
  circle: Graphics;
  square_bg: Graphics;
  circle_bg: Graphics;
  
  // scrollable points
  initialPoint: any;
  finalPoint: any;
  
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
  squareFar0: projection.Sprite2d;
  squareFar1: projection.Sprite2d;
  squareFar2: projection.Sprite2d;
  squareFar3: projection.Sprite2d;
  squareFar4: projection.Sprite2d;
  squareFar5: projection.Sprite2d;
  squareFar6: projection.Sprite2d;
  squareFar7: projection.Sprite2d;

  init(): void {
    
    this.bigWhiteTexture = new PIXI.Texture(PIXI.Texture.WHITE.baseTexture);
    this.bigWhiteTexture.orig.width = this.CIRCLEWIDTH * 6;
    this.bigWhiteTexture.orig.height = this.CIRCLEWIDTH * 4;
    this.last_square_position = this.initial_square_distance + (this.initial_square_distance - this.initial_square_y) * 8;
  }

  start(): void {

    this.bg = new Graphics();
    this.bg.beginFill(0xF2F2F2, 1);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.container.addChild(this.bg);
    
  /////////// SQUARES
    
    this.initial_square = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.initial_square.tint = 0X70DFC8;
    this.initial_square.anchor.set(0.5);
    this.initial_square.position.set(0, this.initial_square_y);

    this.squareFar0 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar0.tint = 0X70DFC8;
    this.squareFar0.anchor.set(0.5);
    this.squareFar0.position.set(0, this.initial_square_distance);
    
    this.squareFar1 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar1.tint = 0X70DFC8;
    this.squareFar1.anchor.set(0.5);
    this.squareFar1.position.set(0, (this.initial_square_distance + this.square_distance));

    this.squareFar2 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar2.tint = 0X70DFC8;
    this.squareFar2.anchor.set(0.5);
    this.squareFar2.position.set(0, (this.initial_square_distance + this.square_distance * 2));

    this.squareFar3 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar3.tint = 0X70DFC8;
    this.squareFar3.anchor.set(0.5);
    this.squareFar3.position.set(0, (this.initial_square_distance + this.square_distance * 3));

    this.squareFar4 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar4.tint = 0X70DFC8;
    this.squareFar4.anchor.set(0.5);
    this.squareFar4.position.set(0, (this.initial_square_distance + this.square_distance * 4));
    
    this.squareFar5 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar5.tint = 0X70DFC8;
    this.squareFar5.anchor.set(0.5);
    this.squareFar5.position.set(0, (this.initial_square_distance + this.square_distance * 5));

    this.squareFar6 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar6.tint = 0X70DFC8;
    this.squareFar6.anchor.set(0.5);
    this.squareFar6.position.set(0, (this.initial_square_distance + this.square_distance * 6));

    this.squareFar7 = new PIXI.projection.Sprite2d(this.bigWhiteTexture);
    this.squareFar7.tint = 0X70DFC8;
    this.squareFar7.anchor.set(0.5);
    this.squareFar7.position.set(0, (this.initial_square_distance + this.square_distance * 7));

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
    lightY.alpha = 0.03;
    this.container2d.addChildAt(lightY, 0);


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
    
    this.circle = new Graphics();
    this.circle.beginFill(0X942363);
    this.circle.drawCircle(this.deviceScreenSize, this.circleYPosition, this.CIRCLEWIDTH);
    this.circle_bg.addChild(this.circle);

    this.circle_bg.on('touchstart', (interactionData: PIXI.interaction.InteractionEvent) => {      
         
      this.TOUCHEND = false;
      this.ball_click();
      
      // get initial tapped postion
      const point = interactionData.data.getLocalPosition(this.circle_bg);
      console.log('point', point);
      this.initialPoint = point;
  });

    this.circle_bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
      const point = interactionData.data.getLocalPosition(this.circle);
      const point2 = interactionData.data.getLocalPosition(this.container2d);

      
      
      // horizontal position
      this.circle.position.x = Math.min(this.app.getScreenSize().w * 0.5 , this.circle.position.x + (point.x - this.initialPoint.x));
      this.circle.position.x = Math.max(this.circle.position.x , -(this.deviceScreenSize));
      
      this.container2d.position.x = -((this.circle.position.x + (point.x - this.initialPoint.x)) - this.deviceScreenSize);

    });
    this.circle_bg.on('touchend', () => {
      this.TOUCHEND = true;
    });


    this.YVELOCITY = this.INITIAL_VELOCITY;

    this.container2d.addChild(this.initial_square);
    this.container2d.addChild(this.squareFar0);
    this.container2d.addChild(this.squareFar1);
    this.container2d.addChild(this.squareFar2);
    this.container2d.addChild(this.squareFar3);
    this.container2d.addChild(this.squareFar4);
    this.container2d.addChild(this.squareFar5);
    this.container2d.addChild(this.squareFar6);
    this.container2d.addChild(this.squareFar7);

  }

  update(_delta: number): void {
    
      let posY = this.container2d.toLocal(this.squareY.position, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
      this.container2d.proj.setAxisY(posY, 1);

      if(this.GAME_RESET != true) {       

        if(this.squareFar0.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
          this.squareFar0.position.y = this.squareFar0.position.y + this.square_distance; }
        // if(this.squareFar1.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar1.position.y = this.squareFar0.position.y + this.square_distance; }
        // if(this.squareFar2.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar2.position.y = this.squareFar1.position.y + this.square_distance; }
        // if(this.squareFar3.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar3.position.y = this.squareFar2.position.y + this.square_distance; }
        // if(this.squareFar4.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar4.position.y = this.squareFar3.position.y + this.square_distance; }
        // if(this.squareFar5.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar5.position.y = this.squareFar4.position.y + this.square_distance; }
        // if(this.squareFar6.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar6.position.y = this.squareFar5.position.y + this.square_distance; }
        // if(this.squareFar7.position.y <= -(this.bigWhiteTexture.height * 0.5)) {
        //   this.squareFar7.position.y = this.squareFar6.position.y + this.square_distance; }

        this.squareFar0.position.y -= this.INITIAL_VELOCITY;
        this.squareFar1.position.y -= this.INITIAL_VELOCITY;
        this.squareFar2.position.y -= this.INITIAL_VELOCITY;
        this.squareFar3.position.y -= this.INITIAL_VELOCITY;
        this.squareFar4.position.y -= this.INITIAL_VELOCITY;
        this.squareFar5.position.y -= this.INITIAL_VELOCITY;
        this.squareFar6.position.y -= this.INITIAL_VELOCITY;
        this.squareFar7.position.y -= this.INITIAL_VELOCITY;
        this.initial_square.position.y -= this.INITIAL_VELOCITY;
        
        if(this.circle.position.y <= 0 ) {
          
          // IF BALL IS BOUNCING
          this.YVELOCITY -= this.GRAVITY;
          this.circle.position.y -= this.YVELOCITY;
          
        } else {

          // IF BALL FAILED TO BOUNCE
          if(this.TOUCHEND == true) {

            // PLAYER STOP ON TOUCHING
            if(this.fall_position < this.circle.position.y) {

              // IF BALL OUT OF SCREEN, RESET GAME
              console.log('reset game')
              // this.circle.position.y = 0;
              this.circle.position.y = 0; 
              this.circle.position.x = 0;
              this.container2d.position.x = this.deviceScreenSize;
              this.YVELOCITY = this.INITIAL_VELOCITY;
              this.GAME_RESET = true;
            } else {

              // BALL FALLING
              console.log('ballmove');
              this.YVELOCITY -= this.GRAVITY;
              this.circle.position.y -= this.YVELOCITY;
              
            }
          } else {
            console.log('stilltouched');
            // SCREEN STILL ON TOUCH


            console.log('circle x position', this.circle.position.x);
            // console.log('square1', this.squareFar1.position.x);
            console.log('square width', this.squareFar0.width);
            console.log('square0', this.squareFar0.position.x);
            console.log('square_local_1', this.squareFar0.transform.worldTransform.tx);



            this.YVELOCITY = this.INITIAL_VELOCITY;
            this.YVELOCITY -= this.GRAVITY;
            this.circle.position.y -= this.YVELOCITY;
          }
        }
      }
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