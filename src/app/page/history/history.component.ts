import { Speaker } from './../../helper/speaker';
import { simplifiedToTaiwan } from './../../helper/opencc';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../service/data.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
  keyword: string;
  target = '';
  targetItem: any;
  historyList: any[] = [];
  showRemove = false;
  count = 0;
  translatedExplanation = '';
  originalExplanation = '';
  examples = '';
  note = '';
  when = '';
  who = '';
  where = '';
  what = '';
  why = '';
  how = '';
  saveStream = new Subject<string>();
  subscribers = [];

  constructor(
    public sanitizer: DomSanitizer,
    public dataService: DataService
  ) {
    document.body.addEventListener('keydown', (e) => {
      if (e.key === '1') {
        Speaker.voice = 'usenglishfemale';
        Speaker.say(this.target);
      }
      if (e.key === '2') {
        Speaker.voice = 'usenglishmale';
        Speaker.say(this.target);
      }
      if (e.key === '3') {
        Speaker.voice = 'ukenglishfemale';
        Speaker.say(this.target);
      }
      if (e.key === '4') {
        Speaker.voice = 'ukenglishmale';
        Speaker.say(this.target);
      }
      if (e.key === '5') {
        Speaker.voice = 'SSU';
        Speaker.say(this.target);
      }
      if (e.key === 'ArrowLeft') {
        const i = this.historyList.findIndex(x => x.word === this.target);
        if (i !== -1 && i !== 0) {
          const pre = this.historyList[i - 1].word;
          this.setTarget(pre);
        }
      }
      if (e.key === 'ArrowRight') {
        const i = this.historyList.findIndex(x => x.word === this.target);
        if (i !== -1 && i !== this.historyList.length - 1) {
          const next = this.historyList[i + 1].word;
          this.setTarget(next);
        }
      }
    });
  }

  ngOnInit() {
    this.subscribers.push(
      this.dataService.history.subscribe(x => {
        this.historyList = x;
      }));
    this.subscribers.push(
      this.saveStream
        .debounceTime(500)
        .subscribe(() => this.saveNote()));
  }

  ngOnDestroy() {
    this.subscribers.forEach(x => x.unsubscribe());
  }

  onKey(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.target = this.keyword.trim();
    if (this.historyList.find(x => x.word === this.target) === undefined) {
      this.dataService.history.push({
        word: this.target,
        time: 0 - new Date().getTime()
      });
    }
    this.setTarget(this.target);
  }

  setTarget(word) {
    this.target = word;
    this.targetItem = this.dataService.getWord(word);
    this.subscribers.push(
      this.targetItem.subscribe(x => {
        if (!x.word) {
          this.targetItem.set({ word: word, note: '', count: 1 });
        } else {
          this.count = x.count || 1;
          this.translatedExplanation = x.translatedExplanation || '';
          this.originalExplanation = x.originalExplanation || '';
          this.examples = x.examples || '';
          this.note = x.note || '';
          this.when = x.when || '';
          this.who = x.who || '';
          this.where = x.where || '';
          this.what = x.what || '';
          this.why = x.why || '';
          this.how = x.how || '';
        }
      }));
  }

  getSrc(path) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${path}${this.target}`);
  }

  remove(item) {
    this.dataService.history.remove(item);
  }

  saveNote() {
    if (this.targetItem) {
      const data = {
        translatedExplanation: simplifiedToTaiwan(this.translatedExplanation) || '',
        originalExplanation: simplifiedToTaiwan(this.originalExplanation) || '',
        examples: simplifiedToTaiwan(this.examples) || '',
        note: simplifiedToTaiwan(this.note) || '',
        when: this.when || '',
        who: this.who || '',
        where: this.where || '',
        what: this.what || '',
        why: this.why || '',
        how: this.how || ''
      };
      this.targetItem.update(data);
    }
  }

  setToday() {
    this.when = new Date().toLocaleDateString();
    this.saveNote();
  }

  appendTag(name, tag) {
    this[name] = this[name].length > 0 ? this[name] + ';' + tag : tag;
  }
}
