import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Postagem } from 'src/app/model/Postagem';
import { Tema } from 'src/app/model/Tema';
import { AlertasService } from 'src/app/service/alertas.service';
import { PostagemService } from 'src/app/service/postagem.service';
import { TemaService } from 'src/app/service/tema.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-postagem-edit',
  templateUrl: './postagem-edit.component.html',
  styleUrls: ['./postagem-edit.component.css']
})
export class PostagemEditComponent implements OnInit {

  postagem: Postagem = new Postagem()
  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private alert: AlertasService
  ) { }

  ngOnInit() {
    window.scroll(0,0)
    if (environment.token == '') {
      this.alert.showAlertDanger('Sessão expirada, faça login para continuar')
      this.router.navigate(['/entrar'])
    }

    let id = this.route.snapshot.params['id']
    this.findByIdPostagem(id)
    this.findAllTema()
  }

  findByIdPostagem(id: number) {
    this.postagemService.getByIdPostagem(id).subscribe((resp: Postagem) => {
      this.postagem = resp
    })
  }

  findAllTema() {
    this.temaService.getAllTema().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
      this.tema = resp
    })
  }

  atualizar(){
    this.tema.id = this.idTema
    this.postagem.tema = this.tema
    console.log(this.postagem)
    this.postagemService.putPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      this.alert.showAlertSuccess('Postagem atualizada com sucesso!')
      this.router.navigate(['/inicio'])     
    }, erro => {
      if (erro.status == 500) {
        this.alert.showAlertDanger('Preencha todos os campos corretamente')
      } if (erro.status == 400) {
        this.alert.showAlertDanger('Selecione um tema válido')
      }
    })
  }
}
