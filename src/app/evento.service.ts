import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Acao, Convidado, ConvidadoDTO, Evento } from './Entities';

@Injectable()
export class EventoService {
  eventos: Array<Evento> = [];
  generalConvidados: Array<ConvidadoDTO> = [];

  acao: Acao;
  indiceEvento: number;

  status: number;
  statusText: string;
  error: string;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getData(data: string): string {
    return (
      data.substr(8, 2) + '/' + data.substr(5, 2) + '/' + data.substr(0, 4)
    );
  }

  getHorario(data: string): string {
    return data.substr(11, 5);
  }

  getEventos() {
    const promise = this.http.get<Array<Evento>>(
      this.auth.apiURL + '/evento',
      {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.eventos = suc.body;
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  createEvento(evento: Evento) {
    let nome = evento.nome;
    let endereco = evento.endereco;
    let descricao = evento.descricao;
    let data = evento.data;
    let convidados = evento.convidados;

    let reqBody: string = JSON.stringify({
      nome,
      endereco,
      descricao,
      data,
      convidados
    });

    const promise = this.http.post(
      this.auth.apiURL + '/evento', reqBody, 
      {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  updateEvento(evento: Evento) {
    let id = evento.id;
    let nome = evento.nome;
    let endereco = evento.endereco;
    let descricao = evento.descricao;
    let data = evento.data;
    let convidados = evento.convidados;

    let reqBody: string = JSON.stringify({
      id,
      nome,
      endereco,
      descricao,
      data,
      convidados
    });

    const promise = this.http.put(
      this.auth.apiURL + '/evento/' + id, reqBody, 
      {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  deleteEvento() {
    const promise = this.http.delete(
      this.auth.apiURL + '/evento/' + this.eventos[this.indiceEvento].id,
      {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  getConvidados() {
    const promise = this.http.get<Array<Convidado>>(
      this.auth.apiURL + '/convidado',
      {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.generalConvidados = suc.body;
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  createConvidado(convidado: Convidado) {
    let nome = convidado.nome;
    let cpf = convidado.cpf;
    let telefone = convidado.telefone;
    let login = convidado.login;
    let senha = convidado.senha;
    let perfis = [2];

    let reqBody: string = JSON.stringify({
      nome,
      cpf,
      telefone,
      login,
      senha,
      perfis
    });

    const myHeader = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const promise = this.http.post(
      this.auth.apiURL + '/convidado',
      reqBody,
      {
        observe: 'response',
        responseType: 'json',
        headers: myHeader
      }
    ).toPromise();

    promise.then(suc => {
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  createConvidadoDTO(convidado: ConvidadoDTO) {
    let nome = convidado.nome;
    let cpf = convidado.cpf;
    let telefone = convidado.telefone;
    let login = convidado.login;
    let senha = convidado.cpf;
    let perfis = [2];

    let reqBody: string = JSON.stringify({
      nome,
      cpf,
      telefone,
      login,
      senha,
      perfis
    });

    const promise = this.http.post(
      this.auth.apiURL + '/convidado',
      reqBody,
      {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }

  updateConvidado(convidado: ConvidadoDTO) {
    let id = convidado.id;
    let nome = convidado.nome;
    let cpf = convidado.cpf;
    let telefone = convidado.telefone;
    let login = convidado.login;
    let senha = convidado.cpf;
    let perfis = convidado.perfis;

    let reqBody: string = JSON.stringify({
      id,
      nome,
      cpf,
      telefone,
      login,
      senha,
      perfis
    });

    const promise = this.http
      .put(this.auth.apiURL + '/convidado/' + id, reqBody, {
        observe: 'response',
        responseType: 'json',
        headers: this.auth.myHeaders
      }
    ).toPromise();

    promise.then(suc => {
      this.status = suc.status;
    }).catch(err => {
      this.error = err.error.message;
      this.statusText = err.error.error;
    });
    return promise;
  }
}
