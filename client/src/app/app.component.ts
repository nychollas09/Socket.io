import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { SocketIoService } from './services/socket-io.service';
import { Mensagem } from './shared/domain/mensagem';
import { Subscription } from 'rxjs';
import { MatList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit{
 
  public formulario: FormGroup;
  public listaMensagem: Array<Mensagem> = new Array<Mensagem>();
  private subscriptionSockeIo: Subscription;
  private subscriptionItensLista: Subscription;

  @ViewChild(MatList, {read: ElementRef, static: true}) lista: ElementRef;
  @ViewChildren(MatListItem) itensLista: QueryList<MatListItem>;

  constructor(private formBuilder: FormBuilder,
    private socketIoService: SocketIoService){
    this._construirFormulario();
  }

  ngOnInit(): void {
    this.subscriptionSockeIo = this.socketIoService.verificarMensagens()
      .subscribe((mensagem: Mensagem) => {
        this.listaMensagem.push(mensagem);
      });
  }

  ngAfterViewInit(): void {
    this.subscriptionItensLista = this.itensLista.changes.subscribe(
      () => {
        this.lista.nativeElement.scrollTop = this.lista.nativeElement.scrollHeight;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionSockeIo.unsubscribe();
    this.subscriptionItensLista.unsubscribe();
  }

  enviar(){
    this.socketIoService.enviarMensagem(this.formulario.getRawValue());
    this.getControl('remetente').disable();
    this._redefinirFormulario();
  }

  getControl(campo: string): AbstractControl{
    return this.formulario.get(`${campo}`);
  }

  get verificarRequiredRemetente(): boolean{
    return this.formulario.get('remetente').invalid;
  }

  get verificarMinLenghtMensagem(): boolean{
    return this.getControl('mensagem').hasError('minlength');
  }

  get validarControlMensagem(): boolean{
    return this.getControl('mensagem').value !== null && this.getControl('mensagem').value !== '' && !this.verificarMinLenghtMensagem;
  }
  
  get verificarCondicaoFormulario(): boolean{
    return !(this.formulario.valid && this.validarControlMensagem);
  }

  getverificarMensagemCoincideComUsuarioRemetente(mensagem: Mensagem): boolean{
    return mensagem.remetente === this.getControl('remetente').value;
  }

  private _redefinirFormulario(){
    this.formulario.reset({remetente: this.getControl('remetente').value});
  }

  private _construirFormulario(){
    this.formulario = this.formBuilder.group({
      remetente: [null, [Validators.required]],
      mensagem: [null, [Validators.minLength(5)]]
    });
  }
}
