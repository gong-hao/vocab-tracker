import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/first';

@Injectable()
export class DataService {
  target: string;
  historyList = [];
  allWords = [];
  allTags = [];

  words: FirebaseObjectObservable<any>;
  tags: FirebaseObjectObservable<any[]>;

  history: FirebaseListObservable<any[]>;
  dictList: FirebaseListObservable<any[]>;
  whereTags: FirebaseListObservable<any[]>;
  whatTags: FirebaseListObservable<any[]>;
  whoTags: FirebaseListObservable<any[]>;
  whyTags: FirebaseListObservable<any[]>;
  howTags: FirebaseListObservable<any[]>;

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.history = af.list('/history', {
      query: {
        orderByChild: 'time'
      }
    });
    this.dictList = af.list('/dictList', {
      query: {
        orderByChild: 'sort'
      }
    });
    this.whereTags = af.list('/whereTags', {
      query: {
        orderByChild: 'sort'
      }
    });
    this.whatTags = af.list('/whatTags', {
      query: {
        orderByChild: 'sort'
      }
    });
    this.whoTags = af.list('/whoTags', {
      query: {
        orderByChild: 'sort'
      }
    });
    this.whyTags = af.list('whyTags', {
      query: {
        orderByChild: 'sort'
      }
    });
    this.howTags = af.list('/howTags', {
      query: {
        orderByChild: 'sort'
      }
    });
    this.tags = af.object('/tags');
    this.words = af.object('/words');

    this.history.subscribe(x => {
      this.historyList = x;
    });
    this.words.subscribe(x => {
      this.allWords = [];
      Object
        .keys(x)
        .sort((a, b) => a.localeCompare(b))
        .forEach(name => {
          this.allWords.push(x[name]);
        });
    });
    this.tags.subscribe(x => {
      this.allTags = [];
      Object
        .keys(x)
        .sort((a, b) => a.localeCompare(b))
        .forEach(name => {
          this.allTags.push(x[name]);
        });
    });
  }

  initTags() {
    [
      'internet',
      'book',
      'menu'
    ].forEach((x, i) => this.whereTags.push({ sort: i + 1, tag: x }));
    [
      'in class',
      'studying',
      'reading',
      'watching',
      'surfing'
    ].forEach((x, i) => this.whatTags.push({ sort: i + 1, tag: x }));
    [
      'teacher',
      'student',
      'friend',
      'stranger'
    ].forEach((x, i) => this.whoTags.push({ sort: i + 1, tag: x }));
    [
      'unknown',
      'unfamiliar',
      'forgotten',
      'for fun'
    ].forEach((x, i) => this.whyTags.push({ sort: i + 1, tag: x }));
    [
      'daily use',
      'academic',
      'writing',
      'oral',
      'good to know',
      'dispensable'
    ].forEach((x, i) => this.howTags.push({ sort: i + 1, tag: x }));
  }

  initDictList() {
    const list = [
      { sort: 1, name: '海詞', url: 'http://dict.cn/big5/' },
      { sort: 2, name: '劍橋', url: 'http://dictionary.cambridge.org/zht/詞典/英語-漢語-繁體/' },
      { sort: 3, name: '雅虎', url: 'https://tw.dictionary.yahoo.com/dictionary?p=' },
      { sort: 4, name: '爱词霸', url: 'http://www.iciba.com/' },
      { sort: 5, name: 'longman', url: 'http://www.ldoceonline.com/dictionary/' },
      { sort: 6, name: 'cambridge', url: 'http://dictionary.cambridge.org/dictionary/english/' },
      { sort: 7, name: 'dictionary', url: 'http://www.dictionary.com/browse/' },
      { sort: 8, name: 'oxford', url: 'http://www.oxforddictionaries.com/definition/american_english/' },
      { sort: 9, name: 'oxford learner\'s', url: 'http://www.oxfordlearnersdictionaries.com/us/definition/american_english/' },
      { sort: 10, name: 'merriam-webster', url: 'http://www.merriam-webster.com/dictionary/' },
      { sort: 11, name: 'macmillan', url: 'http://www.macmillandictionary.com/dictionary/british/' },
      { sort: 12, name: 'learner\'s dictionary', url: 'http://learnersdictionary.com/definition/' },
      { sort: 13, name: 'collins', url: 'http://www.collinsdictionary.com/dictionary/english/' },
      { sort: 14, name: 'the free dictionary', url: 'http://www.thefreedictionary.com/' },
      { sort: 15, name: 'vocabulary', url: 'https://www.vocabulary.com/dictionary/' },
      { sort: 16, name: 'synonyms', url: ' http://www.thesaurus.com/browse/' },
      { sort: 17, name: 'google image', url: 'https://www.google.com/search?tbm=isch&q=' }
    ];
    list.forEach(x => this.dictList.push(x));
  }

  getWord(word) {
    const obj = this.af.object('words/' + word);
    obj.first().subscribe(x => {
      const count = x.count ? x.count + 1 : 1;
      obj.update({ count: count });
    });
    return obj;
  }

  getTag(tag) {
    const obj = this.af.object('tags/' + tag);
    return obj;
  }

  setTarget() {

  }
}
