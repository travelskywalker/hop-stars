import { Subject } from 'rxjs/Subject';

interface JavaScriptInterface { 
  gameCancelled(): any; 
  gameStarted(): any;
}
declare var Android: JavaScriptInterface;

export class IAppState {

  explosionActive: boolean;
  volume: number = 0;
}

export class AppState extends Subject<IAppState> {

  public state: IAppState = new IAppState();

  public setExplosion(active: boolean): void {

    this.state.explosionActive = active;
    this.next(this.state);
  }

  public toggle_volume() {
    this.state.volume += 1;
    if (this.state.volume === 2) {
      this.state.volume = 0;
    }
    this.next(this.state);
  }

  public submitScore(score: number){
    console.log("submit score", score);
    if(this.getBestScore() < score){
      this.saveBestScore(score);
    }
  }

  public saveBestScore(score: number){
    let data = {"bestScore": score}
    localStorage.setItem('hopGameData', JSON.stringify(data));
  }

  public getBestScore(){
    let gamedata = JSON.parse(localStorage.getItem("hopGameData"));

    if(localStorage.getItem("hopGameData") == null || localStorage.getItem("hopGameData") == undefined){
      return 0;
    }else{
      return gamedata.bestScore;
    }
  }

  public gameCancelled(){
    try {
      Android.gameCancelled();
       console.log('call: Android.gameCancelled(); to return to mobile');
    } catch (err) {
      console.error("Android gameCancelled is not defined.", err);
    }
  }

}