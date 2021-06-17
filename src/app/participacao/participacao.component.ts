import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ConvidadoDTO, Evento } from '../Entities';
import { EventoService } from '../evento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participacao',
  templateUrl: './participacao.component.html',
  styleUrls: ['./participacao.component.css']
})
export class ParticipacaoComponent implements OnInit {

  listaParticipacao: Evento[] = [];

  constructor(
    public auth: AuthenticationService,
    public eventoService: EventoService,
    private router: Router,
  ) {
    this.eventoService.getEventos();

    this.eventoService.eventos.forEach(evento => {
      evento.convidados.forEach(convidado => {
        if (convidado.cpf == this.auth.authInfo.usuario.cpf) {
          this.listaParticipacao.push(evento);
        }
      });
    });
  }

  abrirEvento(index: number) {
    this.eventoService.indiceEvento = index;
    this.router.navigate(['/evento']);
  }

  desistir(index: number) {
    let usuario: ConvidadoDTO;
    this.listaParticipacao[index].convidados.forEach(convidado => {
      if (convidado.cpf == this.auth.authInfo.usuario.cpf) {
        usuario = convidado;
      }
    });
    
    this.listaParticipacao[index].convidados.splice(this.listaParticipacao[index].convidados.indexOf(usuario), 1);

    const evento: Evento = new Evento(
      this.listaParticipacao[index].id,
      this.listaParticipacao[index].nome,
      this.listaParticipacao[index].endereco,
      this.listaParticipacao[index].descricao,
      this.listaParticipacao[index].data,
      this.listaParticipacao[index].convidados
    );

    this.eventoService.updateEvento(evento).then(
      suc => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Você desistiu do evento ' + this.listaParticipacao[index].nome + "!",
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/branco']);
      }, 
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops... algo deu errado na atualização do evento.',
          text: this.eventoService.statusText
        });
      }
    );
  }

  ngOnInit() {
    this.router.navigate(['/branco']);
    this.router.navigate(['/participacao']);
  }
}