import { Component, OnInit } from '@angular/core';
import { EventoService } from '../evento.service';
import { ConvidadoDTO, Evento } from '../Entities';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  
  evento: Evento;
  listaConvidados: ConvidadoDTO[] = [];
  participando: boolean = false;

  constructor(
    public eventoService: EventoService,
    private auth: AuthenticationService,
    private router: Router
  ) { 
    this.evento = eventoService.eventos[eventoService.indiceEvento];
    eventoService.eventos[eventoService.indiceEvento].convidados.forEach(convidado => {
      this.listaConvidados.push(convidado);
    });

    this.listaConvidados.forEach(convidado => {
      if (convidado.cpf == this.auth.authInfo.usuario.cpf) {
        this.participando = true;
      }
    })
  }

  participar() {
    const usuario: ConvidadoDTO = new ConvidadoDTO(
      this.auth.authInfo.usuario.id,
      this.auth.authInfo.usuario.nome,
      this.auth.authInfo.usuario.cpf,
      this.auth.authInfo.usuario.telefone,
      this.auth.authInfo.usuario.login,
      this.auth.authInfo.usuario.perfis
    );
    this.listaConvidados.push(usuario);

    const evento: Evento = new Evento(
      this.evento.id,
      this.evento.nome,
      this.evento.endereco,
      this.evento.descricao,
      this.evento.data,
      this.listaConvidados
    );

    this.eventoService.updateEvento(evento).then(
      suc => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Você é convidado para o evento ' + this.evento.nome + "!",
          showConfirmButton: false,
          timer: 2000
        });
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

  voltar() {
    this.router.navigate(['/eventos']);
  }

  ngOnInit() { }
}