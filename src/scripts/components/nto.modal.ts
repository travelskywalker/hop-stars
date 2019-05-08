import { App, app } from '@src/app';
import { SpriteActor } from '@src/core/sprite.actor';
import { Button } from '@src/scripts/components/button.component';

export interface ntoData {
  app: App;
  var: any;
}

export class NetworkTimeoutModal extends PIXI.Container {

  // Nto 
  ntoContainer: PIXI.Graphics;
  ntoStyle: PIXI.TextStyle;
  ntoText: PIXI.Text;
  retry: Button;
  cancel: Button;  

  constructor(data: ntoData) {
    super();

    this.render_nto(data);

  }

  private render_nto(dataApp:any) {
    // NTO BG
    this.ntoContainer = new PIXI.Graphics();
    this.ntoContainer.beginFill(0x000).drawRoundedRect(0, 0, dataApp.app.getScreenSize().w, dataApp.app.getScreenSize().h, 0);
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
      dropShadowBlur: 6,
      dropShadowColor: 0x6e706f,
      dropShadowDistance: 0,
      padding: 15
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
    this.addChild(this.ntoContainer);
    this.addChild(this.ntoText);

    // NTO BUTTON
     this.retry = new Button({
      app: dataApp.app,
      text: 'Retry',
      height: null,
      y: dataApp.app.getScreenSize().h - dataApp.app.getScreenSize().h * 0.275,
      align: 'center',
      type: 'selected',
      icon: '',
      details: '',
    });
    this.addChild(this.retry);

    this.cancel = new Button({
      app: dataApp.app,
      text: 'Cancel',
      height: null,
      y: this.retry.position.y + (this.retry.height * 1.2),
      align: 'center',
      type: 'selected',
      icon: '',
      details: '',
    });
    this.addChild(this.cancel);

    this.retry.clicked = () => { 
      if(dataApp.app.getState().isOnline() == true){
        // check if game start or game end using session ID
        // session id is being set on game start
        if(dataApp.var.sessionId != null){
            dataApp.app.goToScene(4, {score: dataApp.var.score, session_id: dataApp.var.sessionId, timeStart: dataApp.var.timeStart});
        }else{
          // reload instruction screen
          // remove NTO modal
          // this.showInstructionScreen();
          this.removeNTOModal();
        }
      }
    };
    this.cancel.clicked = () => { 
      dataApp.app.getState().eventStarted({event:'cancel'});
    };
  }
  private removeNTOModal(){
    this.removeChild(this.ntoContainer);
    this.removeChild(this.ntoText);
    this.removeChild(this.retry);
    this.removeChild(this.cancel);
  }

}