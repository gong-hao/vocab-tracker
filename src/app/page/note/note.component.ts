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
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, OnDestroy {
  keyword: string;
  target = '';
  targetItem: any;
  wordList: any[] = [];
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
  spellingTest = '';
  spellingLog = [];
  spellingStart;
  spellingEnd;

  constructor(
    public sanitizer: DomSanitizer,
    public dataService: DataService
  ) {
    document.body.addEventListener('keydown', (e) => {
      if (e.key === '1') {
        this.speak('usenglishfemale');
      }
      if (e.key === '2') {
        this.speak('usenglishmale');
      }
      if (e.key === '3') {
        this.speak('ukenglishfemale');
      }
      if (e.key === '4') {
        this.speak('ukenglishmale');
      }
      if (e.key === '5') {
        this.speak('SSU');
      }
      // if (e.key === 'ArrowLeft') {
      //   const i = this.wordList.findIndex(x => x.word === this.target);
      //   if (i !== -1 && i !== 0) {
      //     const pre = this.wordList[i - 1].word;
      //     this.setTarget(pre);
      //   }
      // }
      // if (e.key === 'ArrowRight') {
      //   const i = this.wordList.findIndex(x => x.word === this.target);
      //   if (i !== -1 && i !== this.wordList.length - 1) {
      //     const next = this.wordList[i + 1].word;
      //     this.setTarget(next);
      //   }
      // }
    });
  }

  checkSpelling(event) {
    if (!this.spellingStart && this.spellingTest.length > 0) {
      this.spellingStart = new Date();
    }
    if (event.key !== 'Enter') {
      return false;
    }
    if (this.spellingTest.length > 0) {
      this.spellingEnd = new Date();
    }
    const seconds = (this.spellingEnd.getTime() - this.spellingStart.getTime()) / 1000;
    const item = {
      spelling: this.spellingTest,
      correct: this.spellingTest === this.target,
      seconds: seconds
    };
    this.spellingStart = null;
    this.spellingEnd = null;
    this.spellingLog.unshift(item);
    const data = {
      spellingLog: this.spellingLog
    };
    this.targetItem.update(data);
  }

  speak(name) {
    Speaker.voice = name;
    Speaker.say(this.target);
  }

  ngOnInit() {
    this.subscribers.push(
      this.dataService.history.subscribe(x => {
        this.wordList = x;
      }));
    this.subscribers.push(
      this.saveStream
        .debounceTime(500)
        .subscribe(() => this.saveNote()));
  }

  ngOnDestroy() {
    this.subscribers.forEach(x => x.unsubscribe());
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
          this.spellingLog = x.spellingLog || [];
          this.spellingTest = '';
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
