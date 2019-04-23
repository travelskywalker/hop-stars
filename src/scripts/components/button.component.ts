import { App } from '@src/app';
import { Text } from 'pixi.js';
import { ButtonConfig, fontFamily } from '@src/app.config';

export interface buttonData {
  app: App;
  text: string;
  height: number;
  y: number;
  align: string;
  type: ButtonTypes;
  icon: string;
  details: string;
}

export type ButtonTypes =
  'default' |
  'selected' |
  'correct' |
  'wrong' |
  'wrong_selected' |
  'disabled' ;

export class Button extends PIXI.Container {

  private _cb: Function;
  buttonText: Text;
  button: PIXI.Graphics;
  app: App;

  // Style
  buttonWidth: number;
  buttonHeight: number;
  buttonRadius: number;
  borderColor: number;
  bgColor: number;
  fontColor: number;
  align: string;

  constructor(btn: buttonData) {
      super();

      // Button size
      this.buttonWidth = btn.app.getScreenSize().w * 0.73;
      this.buttonHeight = btn.height ? btn.height : btn.app.getScreenSize().h * 0.08;
      this.buttonRadius = this.buttonHeight * 0.55;

      this.createButton(btn.app, btn.text, btn.height, btn.y, btn.align, btn.type, btn.icon, btn.details);
  }

  createButton( 
    app:any, 
    text: string,
    height: number,
    y: number,
    align: string,
    type: ButtonTypes, 
    icon: string, 
    details: string
  ) {
    
    

    //  button text
    this.buttonText = new Text(`${text}`, { fontFamily: fontFamily, fontSize: `${this.buttonHeight * 0.3}px`, fill: this.fontColor, align: 'left',
      wordWrap: false, wordWrapWidth: this.buttonWidth - (app.getScreenSize().w * 0.15),
    });

    // check button width
    // check button text width if > 70% of button width
    // if greater than, reduce font size
    let buttonThreshold = this.buttonWidth * .5;
    let fontSize = 0;
    if(this.buttonText.width > buttonThreshold){
      // reduce font size
      fontSize = this.buttonHeight * 0.23;
    } else {
      fontSize = this.buttonHeight * 0.3;
    }
    
    this.buttonText = new Text(`${text}`, { fontFamily: fontFamily, fontSize: `${fontSize}px`, fill: this.fontColor, align: 'left',
      wordWrap: true, wordWrapWidth: this.buttonWidth - (app.getScreenSize().w * 0.15),
    });

    // console.log(app.getScreenSize().w,this.buttonWidth, this.buttonText.width, text, text.length);
    //  button text postion
    this.buttonText.position.y = this.buttonHeight * 0.5 - this.buttonText.height * 0.5;

    // draw a rounded rectangle
    this.button = new PIXI.Graphics();
    this.drawBackground(type);
  
    // button position
     this.position.x = this.buttonWidth - app.getScreenSize().w * 0.6;
     this.position.y = y;

     this.align = align;
     if(this.align === "center") {
      this.buttonText.position.x = this.button.width * 0.5 - this.buttonText.width * 0.5;
     } else {
      this.buttonText.position.x = this.button.width * 0.05;
     }

     this.addChild(this.button);
     this.addChild(this.buttonText);
     this.buttonMode = true;
    
      this.on("pointerdown", () => {
          this.onDown();
      }, this);

      this.on("pointerup", () => {
          this.onUp();
      }, this);
  }

  public drawText(text: string): void {

    this.buttonText.text = text;
    if (this.align === "center") {
      this.buttonText.position.x = this.button.width * 0.5 - this.buttonText.width * 0.5;
    } else {
      this.buttonText.position.x = this.button.width * 0.05;
    }
  }

  public drawBackground(type: ButtonTypes): void {
    
    this.interactive = true;
     switch(type) {
      case "default":
        this.borderColor = ButtonConfig.NORMAL.borderColor;
        this.bgColor = ButtonConfig.NORMAL.bgColor;
        this.fontColor = ButtonConfig.NORMAL.textColor;
      break;
      case "selected":
        this.borderColor= ButtonConfig.SELECTED.borderColor;
        this.bgColor = ButtonConfig.SELECTED.bgColor;
        this.fontColor = ButtonConfig.SELECTED.textColor;
      break;
      case "correct":
        this.borderColor= ButtonConfig.CORRECT.borderColor;
        this.bgColor = ButtonConfig.CORRECT.bgColor;
        this.fontColor = ButtonConfig.CORRECT.textColor;
      break;
      case "wrong":
        this.borderColor= ButtonConfig.WRONG.borderColor;
        this.bgColor = ButtonConfig.WRONG.bgColor;
        this.fontColor = ButtonConfig.WRONG.textColor;
      break;
      case "wrong_selected":
        this.borderColor= ButtonConfig.WRONG_SELECTED.borderColor;
        this.bgColor = ButtonConfig.WRONG_SELECTED.bgColor;
        this.fontColor = ButtonConfig.WRONG_SELECTED.textColor;
      break;
      case "disabled":
        this.borderColor = ButtonConfig.DISABLED.borderColor;
        this.bgColor = ButtonConfig.DISABLED.bgColor;
        this.fontColor = ButtonConfig.DISABLED.textColor;
        this.interactive = false;
      break;
    }

    this.button.lineStyle(this.buttonHeight * 0.05, this.borderColor, 1);
    this.button.beginFill(this.bgColor, 1);
    this.button.drawRoundedRect(0, 0, this.buttonWidth, this.buttonHeight, this.buttonRadius);
    this.button.endFill();
    this.buttonText.style.fill = this.fontColor;
  }

  private onDown() {
      this.y += 2;
      // this.tint = 0x949aa5;
      // this.buttonText.style.fill = 0xffffff;
  }

  private onUp() {
      if(typeof(this._cb) === 'function') {
          this._cb();
      }
      this.y -= 2;
  }

  public set clicked(cb: Function) {
      this._cb = cb;
  }


}