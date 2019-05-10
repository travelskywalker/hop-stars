import { Subject } from 'rxjs/Subject';

interface JavaScriptInterface { 
  // events
  gameCancelled(): any; 
  gameStarted(data: any): any;
  gameEnded(data: any): any;
  sessionEnded(data: any): any;
  sendScore(): any;
  eventStarted(data:any): any;
  // timespent
  timeSpent(data: any): any;  
}

declare global { interface Window { Game: any; } }

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
    
    let data = {"best_score": score}
   
    localStorage.setItem('hopGameData', JSON.stringify(data));

  }

  public getBestScore(){
    
    let gamedata = JSON.parse(localStorage.getItem("hopGameData"));

    if(localStorage.getItem("hopGameData") == null || localStorage.getItem("hopGameData") == undefined){
      return 0;
    }else{
      return gamedata.best_score;
    }
  }

  gameCancelled(){
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
    let stringData = JSON.stringify(data);
    switch (data.event) {
      case 'start':
        this.gameStarted(stringData);
        break;
      
      case 'end':
        this.gameEnded(stringData);
        break;
    
      default:
        this.gameCancelled();
        break;
    }

  }

  gameStarted(data: any){
    try {
      Android.gameStarted(data);
    } catch (err) {
      console.error("Android gameStarted is not defined.", data);
    }
  }

  gameEnded(data: any){
    try {
      Android.sessionEnded(data);
    } catch (err) {
      console.error("Android gameEnded is not defined.", data);
    }
  }

  public timeSpent(data: any){
    return;
    try {
      Android.timeSpent(data);
    } catch (err) {
      console.error("Android timeSpent is not defined.", data);
    }
  }

  public generateSessionId(){
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // HELPERS

  // check if online
  public isOnline(){
    return (navigator.onLine) ? true : false;
  }

}