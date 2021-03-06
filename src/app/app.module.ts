import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AuthenticationService } from './authentication.service';
import { EventoService } from './evento.service';

import { AppComponent } from './app.component';
import { BrancoComponent } from './branco/branco.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { SobreComponent } from './sobre/sobre.component';
import { LoginComponent } from './login/login.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoComponent } from './evento/evento.component';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ParticipacaoComponent } from './participacao/participacao.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot([
      { path: 'branco', component: BrancoComponent },
      { path: '', component: HomeComponent },
      { path: 'participacao', component: ParticipacaoComponent },
      { path: 'eventos', component: EventosComponent },
      { path: 'evento', component: EventoComponent },
      { path: 'form-evento', component: FormEventoComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: CadastroComponent }
    ])
  ],
  entryComponents: [ ],
  declarations: [ AppComponent, BrancoComponent, HomeComponent, MenuComponent, SobreComponent, EventosComponent, LoginComponent, EventoComponent, FormEventoComponent, CadastroComponent, ParticipacaoComponent ],
  bootstrap: [ AppComponent ],
  providers: [ EventoService, AuthenticationService ]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));