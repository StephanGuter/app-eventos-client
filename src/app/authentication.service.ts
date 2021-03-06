import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthInfo, ConvidadoDTO } from './Entities';
import Swal from 'sweetalert2';

@Injectable()
export class AuthenticationService {
  readonly apiURL = 'https://fatec-api-eventos.herokuapp.com';
  //readonly apiURL = 'http://localhost:8090';

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

  private dateIsoToDate(date: string): Date {
    //2021-06-17T14:34:04.863Z
    //012345678901234567890123
    const dataRecuperada = new Date(
      parseInt(date.substr(0, 4)),
      parseInt(date.substr(5, 2)),
      parseInt(date.substr(8, 2)),
      parseInt(date.substr(11, 2)),
      parseInt(date.substr(14, 2)),
      parseInt(date.substr(17, 2)),
      parseInt(date.substr(20, 3))
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
          const dataAutenticacao: Date = this.dateIsoToDate(this.authInfo.data);
          //console.log("Autenticacao: " + dataAutenticacao);
          const dataAtual: Date = this.dateIsoToDate(new Date().toISOString());
          //console.log("Atual: " + dataAtual);
          const tempoDecorridoAutenticacao: number = dataAtual.getTime() - dataAutenticacao.getTime();
          
          console.log("Sinal: " + tempoDecorridoAutenticacao);
          
          if (tempoDecorridoAutenticacao > 240000) {
            this.stopTimer();
            if (tempoDecorridoAutenticacao > 290000) {
              Swal.fire({
                title: 'Sua sess??o expirou!',
                text: 'Fa??a login novamente.',
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
              console.log("Sess??o expirada para o usu??rio: " + this.authInfo.usuario.login);
              this.logout();
            } else {
              // this.refresh().then(next => {
              //   console.log("Sess??o renovada para o usu??rio: " + this.authInfo.usuario.login);
              //   this.startTimer();
              // })
              Swal.fire({
                title: 'Sua sess??o ir?? expirar!',
                text: 'Fa??a login novamente.',
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
            }
          }
        }, 1000);
      }
    } else {
      this.stopTimer();
      console.log("N??o h?? usu??rio autenticado.");
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
        console.log("Novo token: " + this.authInfo.token);
        this.authInfo.usuario = suc.body;
        this.authInfo.data = new Date().toISOString();

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
        console.log("Nova sess??o para o usu??rio: " + this.authInfo.usuario.login);
      }
    ).then(next => {
      this.startTimer();
    });

    this.router.navigate(['/']);
  }

  refresh() {
    console.log("Token token para renova????o: " + this.authInfo.token);
    let reqBody: string = JSON.stringify({});

    const myHeaders = new HttpHeaders()
      .set('Authorization', this.authInfo.token)
      .set('Content-Type', 'application/json');

    const promise = this.http.post(
      this.apiURL + '/auth/refresh_token',
      reqBody,
      {
        observe: 'response',
        responseType: 'json',
        headers: myHeaders
      }
    ).toPromise().then(
      suc => {
        console.log(suc);
        this.authInfo.token = suc.headers.get('Authentication');
        console.log("Token renovado: " + this.authInfo.token);
        this.authInfo.data = new Date().toISOString();

        localStorage.setItem('AuthInfo', JSON.stringify(this.authInfo));
        this.setHeaders();
      } 
    );

    return promise;
  }

  logout() {
    this.authInfo = new AuthInfo();
    localStorage.removeItem('AuthInfo');
    this.logged = false;
    this.stopTimer();
    this.router.navigate(['/']);
  }
}
