import { Subject } from 'rxjs/Subject';

interface JavaScriptInterface { 
  gameCancelled(): any; 
  gameStarted(): any;
  gameEnded(): any;
  sendScore(): any;
  eventStarted(data:any): any;
  timeSpent(data: any): any;
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

  public sendScore(score: number){
    let payload = {
      'score': score,
      'bestscore': this.getBestScore()
    }

    // save best score
    this.submitScore(score);
    
    try {
      Android.sendScore()
    } catch (error) {
      console.error("Android.sendScore is not defined", payload);
    }
  }

  // Game Event:
  public eventStarted(data: any) {
    try {
      // Android.gameStarted();
      Android.eventStarted(data);
    } catch (err) {
      console.error("Android gameStarted is not defined.", data);
    }
  }

  public eventCancelled() {
    try {
      Android.gameCancelled();
    } catch (err) {
      console.error("Android gameCancelled is not defined.");
    }
  }

  public eventEnded() {
    try {
      Android.gameEnded();
    } catch (err) {
      console.error("Android gameEnded is not defined.");
    }
  }

  public timeSpent(data: any){
    try {
      Android.timeSpent(data);
    } catch (err) {
      console.error("Android timeSpent is not defined.", data);
    }
  }

  public generateSessionId(){
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

}