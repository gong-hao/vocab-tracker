import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { LoginAuth } from './login.auth';
import { BaseService } from './service/base.service';
import { DataService } from './service/data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RepositoryComponent } from './page/repository/repository.component';
import { HistoryComponent } from './page/history/history.component';
import { DictionaryListComponent } from './page/dictionary-list/dictionary-list.component';
import { AToZListComponent } from './component/a-to-z-list/a-to-z-list.component';
import { VerticalListComponent } from './component/vertical-list/vertical-list.component';
import { BlockListComponent } from './component/block-list/block-list.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyCZj7kJYwFKQ4S5t9EzZdTt-SFPri2uiQc',
  authDomain: 'vocab-tracker.firebaseapp.com',
  databaseURL: 'https://vocab-tracker.firebaseio.com',
  projectId: 'vocab-tracker',
  storageBucket: 'vocab-tracker.appspot.com',
  messagingSenderId: '316507472609'
};

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    AToZListComponent,
    VerticalListComponent,
    BlockListComponent,
    DictionaryListComponent,
    RepositoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    LoginAuth,
    BaseService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
