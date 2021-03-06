import { Component, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  constructor(
    public router: Router,
    public auth: AuthenticationService
  ) { 
    this.auth.startTimer();
  }
}
