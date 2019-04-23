
import { Scene } from '@src/core/scene';
import { IAppState } from '@src/app.state';
import { SpriteActor } from '@src/core/sprite.actor';

export class HowtowinScene extends Scene  {

  // bg overlay
  bg: SpriteActor;
  modalbg: PIXI.Graphics;

  // Texts
  copyText1: PIXI.Text;
  copyText1Style: PIXI.TextStyle;
  copyText2: PIXI.Text;
  copyText2Style: PIXI.TextStyle;

  // button
  closeBtn: SpriteActor;

  init(): void {

  }
  
  start(): void {
    let width = this.app.getScreenSize().w;
    let height = this.app.getScreenSize().h;
    let modalWidth = width * .8;
    let modalHeight = height * .8;

    // initialize and set bg
    this.bg = new SpriteActor('splash-bg', this.app, 'common', 'startscreen_bg.jpg');
    this.bg.setAnchor(0, 0);
    this.bg.setPosition(0,0);
    this.bg.setScaleUpToScreenPercWidth(1);
    this.bg.setScaleUpToScreenPercHeight(1);
    this.addChild(this.bg);

    // initialize and set modal
    let modal= new PIXI.Graphics();
    modal.beginFill(0xFFFFFF).drawRoundedRect(0, 0, modalWidth, modalHeight, 0);
    modal.position.x = width * .1;
    modal.position.y = height * .115;
    modal.alpha = .8;
    this.container.addChild(modal);

    // TEXTS 
    // initialize and set text copy 1
    this.copyText1Style = new PIXI.TextStyle({
        fontFamily: 'Chennai-Bold',
        fontSize: `${modal.height * .05}px`,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: ['#fe68a7'],
        wordWrap: true,
        wordWrapWidth: modal.width
    });
    this.copyText1 = new PIXI.Text(`HOW TO PLAY`, this.copyText1Style);
    this.copyText1.position.x = (modalWidth - this.copyText1.width) * .5;
    this.copyText1.position.y = modal.height * 0.1;
    modal.addChild(this.copyText1);
    
    // const howtoText = `Control the ball by dragging or swiping left and right

    // Land on platform and collect ImFree Coins to get score

    // Avoid falling down

    // Beat the highest score before the week ends and win prizes.

    // Weekly ranking will reset every 11:00 PM Saturday.

    // Next weekly ranking will start every 2:00 AM Monday.`;

    const howtoText = `Control the ball by dragging or swiping left and right

Land on platform and collect ImFree Coins to get score

avoid falling down

Beat the highest score`;

    // initialize and set text copy 2
    this.copyText2Style = new PIXI.TextStyle({
        fontFamily: 'Chennai',
        fontSize: `${modal.height * .03}px`,
        fontStyle: 'normal',
        fontWeight: 'normal',
        align: 'center',
        fill: ['#0285c6'],
        wordWrap: true,
        wordWrapWidth: this.app.getScreenSize().w * .7//modal.width * .8
    });
    this.copyText2 = new PIXI.Text(
        howtoText, 
        this.copyText2Style);
    this.copyText2.position.x = (modalWidth - this.copyText2.width) * .5;
    this.copyText2.position.y = this.copyText1.position.y + (this.copyText1.height * 2);
    modal.addChild(this.copyText2);

    this.closeBtn = new SpriteActor('close-btn', this.app, 'common', 'close_btn.png');
    this.closeBtn.setAnchor(0, 0);
    this.closeBtn.setPosition(modal.width - (this.closeBtn.getSprite().width/3), -(this.closeBtn.getSprite().height/3));
    this.closeBtn.setScaleUpToScreenPercWidth(.099);
    this.closeBtn.getSprite().interactive = true;
    this.closeBtn.getSprite().on('pointerup', () => { 
      console.log('back howtowin scene');
      setTimeout(() => { this.app.goToScene(0); }, 200);
    });
    modal.addChild(this.closeBtn.getSprite());

  }  

  update(_delta: number): void {

  }

  remove(): void {

  }

}