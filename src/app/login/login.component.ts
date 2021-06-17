import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: string;
  senha: string;

  constructor(public auth: AuthenticationService) { }

  ngOnInit() { }

  authenticar() {
    this.auth.login(this.login, this.senha);
    this.login = "";
    this.senha = "";
  }
}