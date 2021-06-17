export class Convidado {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  login: string;
  senha: string;
  perfis: number[];

  constructor(
    id: number,
    nome: string,
    cpf: string,
    telefone: string,
    login: string,
    senha: string,
    perfis: number[]
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.telefone = telefone;
    this.login = login;
    this.senha = senha;
    this.perfis = perfis;
  }
}

export class ConvidadoDTO {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  login: string;
  perfis: number[];

  constructor(
    id: number,
    nome: string,
    cpf: string,
    telefone: string,
    login: string,
    perfis: number[]
    
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.telefone = telefone;
    this.login = login;
    this.perfis = perfis;
  }
}

export class Evento {
  id: number;
  nome: string;
  endereco: string;
  descricao: string;
  data: string;
  convidados: ConvidadoDTO[];

  constructor(
    id: number,
    nome: string,
    endereco: string,
    descricao: string,
    data: string,
    convidados: ConvidadoDTO[]
  ) {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
    this.descricao = descricao;
    this.data = data;
    this.convidados = convidados;
  }
}

export class AuthInfo {
  usuario: ConvidadoDTO;
  token: string;
  isAdmin: Boolean;
  data: Date;

  constructor() {}
}

export enum Acao {
  criar,
  editar
}

export interface ConfirmDialogData {
  title: string,
  message: string,
  actions: {
    confirm: string,
    cancel: string
  }
}