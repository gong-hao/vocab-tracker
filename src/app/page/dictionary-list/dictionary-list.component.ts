import { DataService } from './../../service/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.css']
})
export class DictionaryListComponent implements OnInit {
  dictList: any[] = [];

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.dictList.subscribe(x => {
      if (x.length === 0) {
        this.dataService.initDictList();
      }
      this.dictList = x;
    });
  }

  save(item) {
    return this.dataService.dictList.update(item, {
      sort: item.sort,
      name: item.name,
      url: item.url
    });
  }

  up(index) {
    if (index > 0) {
      this.dictList[index].sort = 0;
      this.save(this.dictList[index])
        .then(() => {
          this.dictList[index].sort += 1;
          this.save(this.dictList[index])
            .then(() => {
              this.dictList[0].sort = index;
              this.save(this.dictList[0]);
            });
        });
    }
  }

  down(index) {

  }

  remove(index) {

  }
}
