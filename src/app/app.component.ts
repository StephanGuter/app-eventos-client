import { Component, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { TimerService } from './timer.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  constructor(
    public router: Router,
    public auth: AuthenticationService,
    private timer: TimerService
  ) { 
    this.timer.start();
  }
}
