import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInfo, ConvidadoDTO } from './Entities';

@Injectable()
export class AuthenticationService {
  //readonly apiURL = 'https://fatec-api-eventos.herokuapp.com';
  readonly apiURL = 'http://localhost:8090';

  private timer: any;

  authInfo: AuthInfo;
  myHeaders: HttpHeaders;
  logged: Boolean = false;
  error: string = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
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

  private dataJsonToDate(dataJson: Date): Date {
   //2021-06-17T14:34:04.863Z
   //012345678901234567890123
   const dataRecuperada = new Date(
     parseInt(dataJson.toString().substr(0,4)),
     parseInt(dataJson.toString().substr(5,2)),
     parseInt(dataJson.toString().substr(8,2)),
     parseInt(dataJson.toString().substr(11,2)),
     parseInt(dataJson.toString().substr(14,2)),
     parseInt(dataJson.toString().substr(17,2)),
     parseInt(dataJson.toString().substr(20,3))
   );
   return dataRecuperada;
  }

  startTimer() {
    const dataAutenticacao = this.authInfo.data
    const dataAtual: Date = JSON.parse(JSON.stringify(new Date()));

        
        //console.log("Tempo atual: " + dataAtualData.getTime());

        // this.authElaptsedTime = dataAtualData.getTime() - this.auth.authInfo.data.getTime();
        // console.log("Tempo decorrido em s: " + this.authElaptsedTime / 1000);

    // if (!this.timer) {
    //   this.timer = setInterval(() => {

    //   }, 1000);
    // }
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
        this.authInfo.token = suc.headers.get('Authentication');
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
        this.authInfo.token = suc.headers.get('Authorization');
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
