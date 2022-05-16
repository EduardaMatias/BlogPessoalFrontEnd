import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../model/Usuario';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})

export class CadastrarComponent implements OnInit {

  usuario: Usuario = new Usuario
  confirmSenha: string
  tipoUser: string

  nomeOk: boolean = false
  emailOk: boolean = false
  senhaOk: boolean = false
  confirmSenhaOk: boolean = false
  selectOk: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: AlertasService
  ) { }

  ngOnInit() {
    window.scroll(0, 0)
  }

  confirmarSenha(event: any) {
    this.confirmSenha = event.target.value
  }

  tipoUsuario(event: any) {
    this.tipoUser = event.target.value
  }

  cadastrar() {
    this.usuario.tipo = this.tipoUser

    if (this.usuario.senha != this.confirmSenha) {
      this.alert.showAlertDanger('As senhas não coincidem!')
    } else if(this.nomeOk != true || 
      this.emailOk != true || 
      this.senhaOk != true || 
      this.confirmSenhaOk != true || 
      this.selectOk != true){
      this.alert.showAlertDanger('Prencha todos os campos corretamente!')
    } else {
      this.authService.cadastrar(this.usuario).subscribe((resp: Usuario) => {
        this.usuario = resp
        this.router.navigate(['/entrar'])
        this.alert.showAlertSuccess('Usuário cadastrado com sucesso!')
      }, erro => {
        if (erro.status == 400) {
          this.alert.showAlertDanger('Usuário já cadastrado! Insira outro email ou faça login.')
        }
      })
    }
  }

  validaNome() {
    let nome = <HTMLInputElement>document.querySelector('#nome')
    let txtNome = <HTMLLabelElement>document.querySelector('#txtNome')
    if (this.usuario.nome.length <= 3) {
      nome.style.border = 'solid 1px red'
      txtNome.innerHTML = 'Digite mais de 3 caracteres'
      txtNome.style.color = 'red'
      this.nomeOk = false
    } else if (this.usuario.nome.length > 50) {
      nome.style.border = 'solid 1px red'
      txtNome.innerHTML = 'Digite menos de 100 caracteres'
      txtNome.style.color = 'red'
      this.nomeOk = false
    } else {
      nome.style.border = 'solid 1px green'
      txtNome.innerHTML = 'Nome'
      txtNome.style.color = 'green'
      this.nomeOk = true
    }
  }

  validaEmail() {
    let regex = '[a-z0-9]+@[a-z]+.[a-z]{2,3}'
    let txtEmail = <HTMLLabelElement>document.querySelector('#txtEmail')
    let email = <HTMLInputElement>document.querySelector('#email')
    if (this.usuario.usuario.match(regex)) {
      txtEmail.innerHTML = 'Email'
      email.style.border = 'solid 1px green'
      txtEmail.style.color = 'green'
      this.emailOk = true
    } else {
      txtEmail.innerHTML = 'Digite um email válido'
      email.style.border = 'solid 1px red'
      txtEmail.style.color = 'red'
      this.emailOk = false
    }
  }

  validaSenha() {
    let senha = <HTMLInputElement>document.querySelector('#senha')
    let txtSenha = <HTMLLabelElement>document.querySelector('#txtSenha')
    if (senha.value.length < 8) {
      senha.style.border = 'solid 1px red'
      txtSenha.innerHTML = 'Digite pelo menos 8 caracteres'
      txtSenha.style.color = 'red'
      this.senhaOk = false
    } else if (senha.value.length > 15) {
      senha.style.border = 'solid 1px red'
      txtSenha.innerHTML = 'Digite menos de 15 caracteres'
      txtSenha.style.color = 'red'
      this.senhaOk = false
    } else {
      senha.style.border = 'solid 1px green'
      txtSenha.innerHTML = 'Senha'
      txtSenha.style.color = 'green'
      this.senhaOk = true
    }
  }

  validaConfirmSenha() {
    let senha = <HTMLInputElement>document.querySelector('#senha')
    let confirmSenha = <HTMLInputElement>document.querySelector('#confirmSenha')
    let txtConfirmSenha = <HTMLLabelElement>document.querySelector('#txtConfirmSenha')
    if (senha.value == this.usuario.senha) {
      confirmSenha.style.border = 'solid 1px green'
      txtConfirmSenha.innerHTML = 'Confirmar senha'
      txtConfirmSenha.style.color = 'green'
      this.confirmSenhaOk = true
    } else {
      confirmSenha.style.border = 'solid 1px red'
      txtConfirmSenha.innerHTML = 'As senhas não coincidem'
      txtConfirmSenha.style.color = 'red'
      this.confirmSenhaOk = false
    }
  }

  validaSelect() {
    let select = <HTMLSelectElement>document.querySelector('#select')
    if (select.value == 'Selecione um tipo de usuário') {
      this.selectOk = false
    } else {
      this.selectOk = true
    }
  }
}
