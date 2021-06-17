import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { EventoService } from '../evento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchText;

  constructor(
    public auth: AuthenticationService, 
    public eventoService: EventoService, 
    private router: Router)
  {
    this.eventoService.getEventos();
  }

  ngOnInit() {}

  abrirEvento(index: number) {
    this.eventoService.indiceEvento = index;
    this.router.navigate(['evento']);
  }
}