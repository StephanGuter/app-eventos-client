import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInfo, ConvidadoDTO } from './Entities';

@Injectable()
export class AuthenticationService {
  //readonly apiURL = 'https://fatec-api-eventos.herokuapp.com';
  readonly apiURL = 'http://localhost:8090';

  authInfo: AuthInfo;
  myHeaders: HttpHeaders;
  logged: Boolean = false;
  error: string = null;

  constructor(private http: HttpClient, private router: Router) {
    this.authInfo = new AuthInfo();
    if (localStorage.getItem('AuthInfo')) {
      this.authInfo = JSON.parse(localStorage.getItem('AuthInfo'));
      this.setHeaders();
      this.logged = true;
    }
  }

  private setHeaders() {
    this.myHeaders = new HttpHeaders()
      .set('Authorization', this.authInfo.token)
      .set('Content-Type', 'application/json');
  }

  login(login: string, senha: string) {
    let reqBody: string = JSON.stringify({ login, senha });

    const promise = this.http
      .post<ConvidadoDTO>(this.apiURL + '/login', reqBody, {
        observe: 'response',
        responseType: 'json'
      })
      .toPromise();

    promise.then(
      suc => {
        this.authInfo.token = suc.headers.get('authentication');
        this.authInfo.usuario = suc.body;
        this.authInfo.data = new Date();

        let isAdmin: Boolean = false;
        suc.body.perfis.forEach(perfil => {
          if (perfil == 1) {
            isAdmin = true;
          }
        });
        this.authInfo.isAdmin = isAdmin;

        localStorage.setItem('AuthInfo', JSON.stringify(this.authInfo));
        this.setHeaders();
        this.logged = true;
      },
      err => {
        this.error = err.error.message;
      }
    );

    this.router.navigate(['/']);
  }

  refresh() {
    const promise = this.http
      .post(this.apiURL + '/auth/refresh_token', {
        observe: 'response',
        responseType: 'json',
        headers: this.myHeaders
      })
      .toPromise();

    promise
      .then(suc => {
        this.authInfo.token = suc.headers.get('authentication');
        this.authInfo.data = new Date();

        localStorage.removeItem('AuthInfo');
        localStorage.setItem('AuthInfo', JSON.stringify(this.authInfo));
        this.setHeaders();
      })
      .catch(err => {
        this.error = err.error.message;
      });
  }

  logout() {
    this.authInfo = new AuthInfo();
    localStorage.removeItem('AuthInfo');
    this.logged = false;
    this.router.navigate(['/']);
  }
}
