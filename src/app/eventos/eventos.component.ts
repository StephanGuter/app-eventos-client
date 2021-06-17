import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../evento.service';
import Swal from 'sweetalert2';
import { Acao } from '../Entities';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  constructor(
    public auth: AuthenticationService,
    public eventoService: EventoService,
    private router: Router,
  ) {
    this.eventoService.getEventos();
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  abrirEvento(index: number) {
    this.eventoService.indiceEvento = index;
    this.router.navigate(['/evento']);
  }

  abrirFormularioEvento(acao: string, index?: number) {
    let _acao: Acao = null;
    if (acao == 'criar') _acao = Acao.criar;
    if (acao == 'editar') {
      _acao = Acao.editar;
      this.eventoService.indiceEvento = index;
    }
    this.eventoService.acao = _acao;
    this.router.navigate(['/form-evento']);
  }

  deletar(index: number) {
    this.eventoService.indiceEvento = index;

    if (this.eventoService.eventos[index])

      if(this.eventoService.eventos[index].convidados.length > 0) {
        Swal.fire({
          icon: 'info',
          title: 'Este evento possui convidados!',
          text: "Remova-os e tente novamente.",
          confirmButtonColor: '#3085d6'
        });
      } else {
        Swal.fire({
          title: 'Tem certeza?',
          text: 'Você não será capaz de reverter isso!',
          icon: 'warning',
          iconColor: 'orange',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, delete o evento!'
        }).then(result => {
          if (result.isConfirmed) {
            this.eventoService.deleteEvento().then(
              suc => {
                Swal.fire({
                  title: 'Deletado!',
                  text: 'O evento foi deletado.',
                  icon: 'success',
                  confirmButtonColor: '#3085d6'
                });
              }, 
              err => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops... algo deu errado na deleção do evento',
                  text: this.eventoService.statusText
                });
              }
            );
          }
          this.router.navigate(['/branco']);
          this.redirectTo('/eventos');
        });
        this.router.navigate(['/evento']);
      }
  }

  ngOnInit() {
    this.router.navigate(['/branco']);
    this.router.navigate(['/eventos']);
  }
}
