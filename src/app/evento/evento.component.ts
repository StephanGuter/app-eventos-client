import { Component, OnInit } from '@angular/core';
import { EventoService } from '../evento.service';
import { ConvidadoDTO, Evento } from '../Entities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  
  evento: Evento;
  listaConvidados: ConvidadoDTO[] = [];

  constructor(
    public eventoService: EventoService,
    private router: Router
  ) { 
    this.evento = eventoService.eventos[eventoService.indiceEvento];
    eventoService.eventos[eventoService.indiceEvento].convidados.forEach(convidado => {
      this.listaConvidados.push(convidado);
    }); 
  }

  voltar() {
    this.router.navigate(['/eventos']);
  }

  ngOnInit() { }
}