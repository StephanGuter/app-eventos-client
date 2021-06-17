import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Acao, ConvidadoDTO, Evento } from '../Entities';
import { EventoService } from '../evento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-evento',
  templateUrl: './form-evento.component.html',
  styleUrls: ['./form-evento.component.css']
})
export class FormEventoComponent implements OnInit {
  // EVENTO

  evento: Evento;

  idEvento: number = 0;
  nomeEvento: string = "";
  endereco: string = "";
  descricao: string = "";
  data: string = "";
  listaConvidados: ConvidadoDTO[] = [];
  d: string = this.getDataAtual();
  h: string = this.getHoraAtual();

  // CONVIDADO

  idConvidado: number = 0;
  nomeConvidado: string = "";
  cpf: string = "";
  telefone: string = "";
  login: string = "";
  senha: string = "";
  perfis: number[] = [];

  // CONTROLE

  ignorados: string[] = [];
  gerenciandoConvidado: boolean = false;
  acaoConvidado: Acao = null;
  currentIndex: number = 0;

  constructor(public eventoService: EventoService, private router: Router) {

    this.listaConvidados = [];

    if (this.eventoService.acao == Acao.editar) {
      this.evento = eventoService.eventos[eventoService.indiceEvento];

      this.idEvento = this.evento.id;
      this.nomeEvento = this.evento.nome;
      this.endereco = this.evento.endereco;
      this.descricao = this.evento.descricao;
      this.d = this.evento.data.substr(0, 10);
      this.h = this.evento.data.substr(11, 5);

      this.getConvidados();
    }
  }

  private getConvidados() {
    this.eventoService.getConvidados().then(
      suc => {
        this.eventoService.eventos[this.eventoService.indiceEvento].convidados.forEach(
          convidado => {
            this.listaConvidados.push(convidado);
          }
        );
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops... algo deu errado no carregamento dos convidados.',
          text: this.eventoService.statusText
        });
      }
    );
  }

  adicionarConvidado() {
    this.gerenciandoConvidado = true;
    this.acaoConvidado = Acao.criar;
  }

  gravarConvidado() {
    if (this.acaoConvidado == Acao.criar) {
      let perfis: number[] = [2];
      let convidadoNovo = new ConvidadoDTO(
        0, 
        this.nomeConvidado,
        this.cpf,
        this.telefone,
        this.login,
        perfis
      );
      
      this.eventoService.createConvidado(convidadoNovo).then(
        suc => {
          this.listaConvidados.push(convidadoNovo);
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

    if (this.acaoConvidado == Acao.editar) {
      let convidadoAtualizado = new ConvidadoDTO(
        this.idConvidado,
        this.nomeConvidado,
        this.cpf,
        this.telefone,
        this.login,
        this.perfis
      );
      
      this.eventoService.updateConvidado(convidadoAtualizado).then(
        suc => {
          this.listaConvidados.splice(this.currentIndex, 1, convidadoAtualizado);
        }, 
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops... algo deu errado na atualização do convidado.',
            text: this.eventoService.statusText
          });
        }
      );
    }
        
    this.limparFormularioConvidado();
    this.gerenciandoConvidado = false;
  }

  cancelar() {
    this.limparFormularioConvidado();
    this.gerenciandoConvidado = false;
  }

  editarConvidado(index: number) {
    this.gerenciandoConvidado = true;
    this.acaoConvidado = Acao.editar;
    this.currentIndex = index;

    this.idConvidado = this.listaConvidados[index].id
    this.nomeConvidado = this.listaConvidados[index].nome;
    this.cpf = this.listaConvidados[index].cpf;
    this.telefone = this.listaConvidados[index].telefone;
    this.login = this.listaConvidados[index].login;
    this.perfis = this.listaConvidados[index].perfis;
  }

  removerConvidado(index: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não será capaz de reverter isso!',
      icon: 'warning',
      iconColor: 'orange',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, delete o convidado!'
    }).then(result => {
      if (result.isConfirmed) {
        this.listaConvidados.splice(index, 1);

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Deletado!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  private gerarEvento() {
    this.evento = new Evento(
      this.idEvento,
      this.nomeEvento,
      this.endereco,
      this.descricao,
      this.d.toString() + " " + this.h.toString(),
      this.listaConvidados
    )
  }

  private async verificarConvidados() {  
    const lcAux: ConvidadoDTO[] = this.listaConvidados;
    this.listaConvidados = [];
  
    await this.eventoService.getConvidados().then(
      suc => {
        lcAux.forEach(convidadoLista => {
          this.eventoService.generalConvidados.forEach(convidado => {
            if (convidado.cpf == convidadoLista.cpf) {
              this.listaConvidados.push(convidado);
            }
          });
        });
      }, 
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops... algo deu errado no carregamento dos convidados.',
          text: this.eventoService.statusText
        });
      }
    );
  }

  private async criar() {
    await this.verificarConvidados().then(
      suc => {
        this.gerarEvento();
        
        this.eventoService.createEvento(this.evento).then(
          suc => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Evento criado',
              showConfirmButton: false,
              timer: 1500
            });
            this.voltar();
          }, 
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops... algo deu errado na criação do evento.',
              text: this.eventoService.statusText
            });
          }
        );
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops... algo deu errado ao verificar convidados.',
          text: this.eventoService.statusText
        });
      }
    )
  }

  criarEvento() {
    if (this.gerenciandoConvidado) {
      Swal.fire({
        title: 'Tem certeza?',
        text: "Há um convidado não gravado!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Descartar e continuar',
        cancelButtonText: "Verificar..."
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelar();
          this.criar();
        }
      });
    } else {
      Swal.fire({
        title: this.nomeEvento,
        text: 'Deseja criar o evento agora?',
        icon: 'question',
        iconColor: 'orange',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, crie o evento!',
        cancelButtonText: 'Antes, deixe-me verificar...'
      }).then(result => {
        if (result.isConfirmed) { 
          this.criar();
        }
      });
    }
  }

  atualizarEvento() {
    Swal.fire({
      title: this.nomeEvento,
      text: 'Deseja atualizar o evento agora?',
      icon: 'question',
      iconColor: 'orange',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, atualize o evento!',
      cancelButtonText: 'Antes, deixe-me verificar...'
    }).then(async result => {
      if (result.isConfirmed) {
        await this.verificarConvidados().then(
          suc => {
            this.gerarEvento();
            
            this.eventoService.updateEvento(this.evento).then(
              suc => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Evento atualizado',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.voltar();
              }, 
              err => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops... algo deu errado na atualização do evento.',
                  text: this.eventoService.statusText
                });
              }
            );
          },
          err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops... algo deu errado ao verificar convidados.',
              text: this.eventoService.statusText
            });
          }
        );
      }
    });
  }

  voltar() {
    this.limparFormularioEvento();
    this.router.navigate(['/eventos']);
  }

  private limparFormularioEvento() {
    this.nomeEvento = '';
    this.endereco = '';
    this.descricao = '';
    this.data = '';

    this.d;
    this.h;

    this.limparFormularioConvidado();
  }

  private limparFormularioConvidado() {
    this.nomeConvidado = '';
    this.cpf = '';
    this.telefone = '';
    this.login = '';
    this.senha = '';
    this.perfis = [];
  }

  criando(): boolean { return (this.eventoService.acao == Acao.criar)? true : false }

  atualizando(): boolean { return (this.eventoService.acao == Acao.editar)? true : false }

  getDataAtual(): string {
    let agora = new Date();
    return agora.getFullYear().toString().padStart(4, '0') + "-" + (agora.getMonth() + 1).toString().padStart(2, '0') + "-" + agora.getDate().toString().padStart(2, '0');
  }

  getHoraAtual(): string {
    let agora = new Date();
    return agora.getHours().toString().padStart(2, '0') + ":" + agora.getMinutes().toString().padStart(2, '0');
  }

  ngOnInit() {}
}
