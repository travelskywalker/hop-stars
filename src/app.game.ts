import { App } from '@src/app';

interface Window {
    Game: any;
    lmodal: any;
}

// expose global Game object for Android
window.Game = {

    //   setConfig: (data: string) => {
    //     this.setConfig(data);
    //   },
    //   showExitConfirmation: () => {
    //     this.app.getState().gameCancelled();
    //   },
    //   setLeaderboardData: (data: any) => {
    //     console.log("set leaderboard data in splash scene")
    //     try {
    //       console.log('splash lmodal');
    //       this.lmodal.setLeaderboardData(JSON.parse(data));
    //     } catch (error) {
    //       console.log(this.app.getCurrentScene());
    //       // GameOverScene.lmodal.setLeaderboardData(JSON.parse(data));
    //     }
    //   }  
}