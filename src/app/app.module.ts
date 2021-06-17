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
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { SobreComponent } from './sobre/sobre.component';
import { LoginComponent } from './login/login.component';
import { EventosComponent } from './eventos/eventos.component';
import { EventoComponent } from './evento/evento.component';
import { FormEventoComponent } from './form-evento/form-evento.component';
import { TimerService } from './timer.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'eventos', component: EventosComponent },
      { path: 'evento', component: EventoComponent },
      { path: 'form-evento', component: FormEventoComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'login', component: LoginComponent }
    ])
  ],
  entryComponents: [ ],
  declarations: [ AppComponent, HomeComponent, MenuComponent, SobreComponent, EventosComponent, LoginComponent, EventoComponent, FormEventoComponent ],
  bootstrap: [ AppComponent ],
  providers: [ EventoService, AuthenticationService, TimerService ]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));