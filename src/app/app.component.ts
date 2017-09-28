import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
    <button class="navbar-toggler navbar-toggler-right" type="button"
      data-toggle="collapse" data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="#">VocabTracker</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" routerLinkActive="active" [routerLink]="['repository']">Repository</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLinkActive="active" [routerLink]="['history']">History</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLinkActive="active" [routerLink]="['dict-list']">Dictionary List</a>
        </li>
      </ul>
      <form class="form-inline">
        <div class="input-group">
          <input class="form-control" type="text" placeholder="Search" [(ngModel)]="keyword" name="keyword">
          <span class="input-group-btn">
            <button class="btn btn-danger" type="button" (click)="keyword = ''">x</button>
          </span>
          <span class="input-group-btn">
            <button class="btn btn-success" type="submit" (click)="search()">Go!</button>
          </span>
        </div>
      </form>
    </div>
  </nav>
  <router-outlet></router-outlet>
  <audio id="tts"></audio>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  keyword: string;
  subscribers = [];

  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribers.forEach(x => x.unsubscribe());
  }

  search() {
    this.dataService.target = this.keyword.trim();
    if (this.dataService.historyList.find(x => x.word === this.dataService.target) === undefined) {
      this.dataService.history.push({
        word: this.dataService.target,
        time: 0 - new Date().getTime()
      });
    }
    this.dataService.setTarget();
  }
}
