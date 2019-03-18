import { Scene } from '@src/core/scene';
import { Text, Container, Graphics } from 'pixi.js';

export class GameScene extends Scene {

  // background
  bg: Graphics;
  circle: Graphics;

  // scrollable points
  initialPoint: any;
  finalPoint: any;

  init(): void {
    console.log('game scene');
    
  }

  start(): void {

    this.bg = new Graphics();
    this.bg.beginFill(0x000000, 1);
    this.bg.drawRect(0, 0, this.app.getScreenSize().w, this.app.getScreenSize().h);
    this.bg.endFill();
    this.bg.interactive = true;
    this.container.addChild(this.bg);

    const circleWidth = this.app.getScreenSize().h * .05;
    this.circle = new Graphics();
    this.circle.beginFill(0xFFFFFF);
    this.circle.drawCircle(this.app.getScreenSize().w * 0.5, this.app.getScreenSize().h - this.app.getScreenSize().h * 0.2, circleWidth);
    this.bg.addChild(this.circle);

    this.bg.on('touchstart', (interactionData: PIXI.interaction.InteractionEvent) => {
      
      const point = interactionData.data.getLocalPosition(this.bg);
      console.log('touchstart', point );
      this.initialPoint = point;
  });

    this.bg.on('touchmove', (interactionData: PIXI.interaction.InteractionEvent) => {
        const point = interactionData.data.getLocalPosition(this.circle);
        this.circle.position.x = Math.min(this.app.getScreenSize().w * 0.5 , this.circle.position.x + (point.x - this.initialPoint.x));
        this.circle.position.x = Math.max(this.circle.position.x , -(this.app.getScreenSize().w * 0.5));
        
        // this.bg.position.y =  Math.min(0, this.bg.position.y + point.y - this.initialPoint.y);
        // this.bg.position.y = Math.max(this.bg.position.y, -(this.bg.height - this.app.getScreenSize().h));
        

        console.log('screensize', this.app.getScreenSize().w);
        console.log('x', this.circle.position.x);
        // console.log('point', point);
    });

    
  }

  update(_delta: number): void {
    
  }

  remove(): void {

  }

}