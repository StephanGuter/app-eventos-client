import { Injectable } from '@angular/core';
import { Timestamp } from 'rxjs/dist/types';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class TimerService {
  private timer: any;
  private sec: number;
  private authElaptsedTime: number;
  
  constructor(
    private auth: AuthenticationService
  ) {
    this.sec = 0;
  }

  start() {
        console.log("Momento autenticação: " + this.auth.authInfo.data);
        const dataAtual: Date = new Date();
        const dataAtualJson = JSON.stringify(dataAtual);
        const dataAtualData: Date = JSON.parse(dataAtualJson);

        console.log("Momento atual: " + dataAtualData.getFullYear);
        
        //console.log("Tempo atual: " + dataAtualData.getTime());

        // this.authElaptsedTime = dataAtualData.getTime() - this.auth.authInfo.data.getTime();
        // console.log("Tempo decorrido em s: " + this.authElaptsedTime / 1000);

    // if (!this.timer) {
    //   this.timer = setInterval(() => {

    //   }, 1000);
    // }
  }
}