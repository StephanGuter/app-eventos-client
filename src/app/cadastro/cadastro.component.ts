import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Convidado } from '../Entities';
import { EventoService } from '../evento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  nome: string;
  cpf: string;
  telefone: string;
  login: string;
  senha: string;
  rSenha: string;

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) { }

  cadastrar() {
    const usuario = new Convidado(
      0,
      this.nome,
      this.cpf,
      this.telefone,
      this.login,
      this.senha,
      [2]
    );
    
    this.eventoService.createConvidado(usuario).then(
      suc => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/login']);
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops... algo deu errado na criação do convidado.',
          text: this.eventoService.statusText
        });
      }
    );
  }

  ngOnInit() { }
}