import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-a-to-z-list',
  templateUrl: './a-to-z-list.component.html',
  styleUrls: ['./a-to-z-list.component.css']
})
export class AToZListComponent implements OnInit {
  showRemove = false;
  constructor(public dataService: DataService) { }

  ngOnInit() {
  }

  setTarget(word) {

  }

  remove(item) {

  }

  isFirstWord(word, index) {
    if (index === 0) {
      return true;
    }
    if (this.dataService.allWords[index - 1]) {
      return word[0].toLowerCase() !== this.dataService.allWords[index - 1].word[0].toLowerCase();
    }
    return false;
  }

  count(letter) {
    let counter = 0;
    this.dataService.allWords.forEach(x => {
      if (x.word[0].toLowerCase() === letter.toLowerCase()) {
        counter++;
      }
    });
    return counter;
  }

  selectLetter(letter, checked) {
    this.dataService.allWords.forEach(x => {
      if (x.word[0].toLowerCase() === letter.toLowerCase()) {
        x.checked = checked;
      }
    });
  }
}
