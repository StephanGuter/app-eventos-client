import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInfo, ConvidadoDTO } from './Entities';
import Swal from 'sweetalert2';

@Injectable()
export class AuthenticationService {
  //readonly apiURL = 'https://fatec-api-eventos.herokuapp.com';
  readonly apiURL = 'http://localhost:8090';

  private timer: any;

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

  private dataJsonToDate(dataJson: Date): Date {
    //2021-06-17T14:34:04.863Z
    //012345678901234567890123
    const dataRecuperada = new Date(
      parseInt(dataJson.toString().substr(0, 4)),
      parseInt(dataJson.toString().substr(5, 2)),
      parseInt(dataJson.toString().substr(8, 2)),
      parseInt(dataJson.toString().substr(11, 2)),
      parseInt(dataJson.toString().substr(14, 2)),
      parseInt(dataJson.toString().substr(17, 2)),
      parseInt(dataJson.toString().substr(20, 3))
    );
    return dataRecuperada;
  }

  private stopTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  startTimer() {
    if (this.logged) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          const dataAutenticacao: Date = this.dataJsonToDate(this.authInfo.data);
          console.log("Autenticacao: " + dataAutenticacao);
          const dataAtual: Date = this.dataJsonToDate(JSON.parse(JSON.stringify(new Date())));
          console.log("Atual: " + dataAtual);
          const tempoDecorridoAutenticacao: number = dataAtual.getTime() - dataAutenticacao.getTime();
          
          console.log("Sinal: " + tempoDecorridoAutenticacao);
          
          if (tempoDecorridoAutenticacao > 240000/10) {
            this.stopTimer();
            if (tempoDecorridoAutenticacao > 290000/10) {
              Swal.fire({
                title: 'Sua sessão expirou!',
                text: 'Faça login novamente.',
                icon: 'error',
                iconColor: 'orange',
                confirmButtonColor: '#3085d6',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              });
              console.log("Sessão expirada para o usuário: " + this.authInfo.usuario.login);
              this.logout();
              this.router.navigate(['/login']);
            } else {
              this.refresh().then(next => {
                console.log("Sessão renovada para o usuário: " + this.authInfo.usuario.login);
                this.startTimer();
              })
            }
          }
        }, 1000);
      }
    } else {
      this.stopTimer();
      console.log("Não há usuário autenticado.");
    }
  }

  login(login: string, senha: string) {
    let reqBody: string = JSON.stringify({ login, senha });

    const promise = this.http.post<ConvidadoDTO>(
      this.apiURL + '/login',
      reqBody, 
      {
        observe: 'response',
        responseType: 'json'
      }
    ).toPromise();

    promise.then(
      suc => {
        this.authInfo.token = suc.headers.get('Authentication');
        this.authInfo.usuario = suc.body;
        this.authInfo.data = this.dataJsonToDate(JSON.parse(JSON.stringify(new Date())));

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
        console.log("Nova sessão para o usuário: " + this.authInfo.usuario.login);
      },
      err => {
        this.error = err.error.message;
      }
    ).then(next => {
      this.startTimer();
    });

    this.router.navigate(['/']);
  }

  refresh() {
    let reqBody: string = JSON.stringify({});

    const promise = this.http.post(
      this.apiURL + '/auth/refresh_token',
      reqBody,
      {
        observe: 'response',
        responseType: 'json',
        headers: this.myHeaders
      }
    ).toPromise();

    const promise2 = promise.then(
      suc => {
        this.authInfo.token = suc.headers.get('Authorization');
        this.authInfo.data = new Date();

        localStorage.removeItem('AuthInfo');
        localStorage.setItem('AuthInfo', JSON.stringify(this.authInfo));
        this.setHeaders();
      }, 
      err => {
        this.error = err.error.message;
      }).toPromise();

    return promise2;
  }

  logout() {
    this.authInfo = new AuthInfo();
    localStorage.removeItem('AuthInfo');
    this.logged = false;
    this.stopTimer();
    this.router.navigate(['/']);
  }
}
