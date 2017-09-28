import { RepositoryComponent } from './page/repository/repository.component';
import { NoteComponent } from './page/note/note.component';
import { DictionaryListComponent } from './page/dictionary-list/dictionary-list.component';
import { LoginAuth } from './login.auth';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'repository',
    component: RepositoryComponent,
    canActivate: [LoginAuth]
  },
  {
    path: 'history',
    component: NoteComponent,
    canActivate: [LoginAuth]
  },
  {
    path: 'dict-list',
    component: DictionaryListComponent,
    canActivate: [LoginAuth]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
