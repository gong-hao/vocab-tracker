import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  showRemove = false;
  display = 'a-to-z';
  tagName = '';
  subscribers = [];
  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  setTag() {
    if (this.tagName.length > 0) {
      const checkedWords = this.dataService.allWords.filter(x => x.checked).map(x => x.word);
      if (checkedWords.length > 0) {
        const tagTarget = this.dataService.getTag(this.tagName);
        tagTarget.subscribe(tag => {
          if (tag) {
            const words = Array.from(new Set(tag.words.concat(checkedWords)));
            tag.words = words;
            tagTarget.update(tag)
              .then(() => this.updateWordTags(this.tagName, words));
          } else {
            const newTag = {
              name: this.tagName,
              words: checkedWords
            };
            tagTarget.set(newTag)
              .then(() => this.updateWordTags(this.tagName, checkedWords));
          }
        });
      }
    }
  }

  updateWordTags(tag, words) {
    words.forEach(w => {
      const wordTarget: any = this.dataService.getWord(w);
      wordTarget.subscribe(word => {
        if (!word.tags) {
          word.tags = [];
        }
        word.tags.push(tag);
        const tags = Array.from(new Set(word.tags));
        word.tags = tags;
        wordTarget.update(word);
      });
    });
  }
}
