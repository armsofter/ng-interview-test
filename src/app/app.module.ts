import { Component, NgModule, Input, OnInit, OnChanges } from '@angular/core';
import * as Rx from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from './ApiService';
import { FormsModule } from '@angular/forms';

@Component({
  // tslint:disable-next-line
  selector: '[header]',
  template: `
    <th>№</th>
    <th>Name</th>
    <th>Score</th>
    <th>Note</th>
  `
})
export class HeaderComponent {}

@Component({
  // tslint:disable-next-line
  selector: '[item-detail]',
  template: `
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.score }}</td>
    <td><input [(ngModel)]="item.note" size="7" /></td>
  `
})
export class RowComponent implements OnChanges {
  @Input() item;
  ngOnChanges() {
    console.log('inputs changes');
  }
}

@Component({
  selector: 'app-component',
  providers: [ApiService],
  template: `
    <table border="2" cellpadding="5">
      <thead>
        <tr header></tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of items" item-detail [item]="item"></tr>
      </tbody>
    </table>
  `
})
export class AppComponent implements OnInit {
  items: {
    id: number;
    name: string;
    score: number;
    note: '';
  }[];
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.apiService.handleChanges(changes => {
      // console.log('items : ', this.calcScore(changes));
      this.items = this.calcScore(changes);
    });
  }

  mergeNotes(id) {
    if (this.items) {
      return this.items.filter(item => {
        return item.id === id;
      })[0].note;
    } else {
      return '';
    }
  }

  calcScore(items) {
    return items.map(item => ({
      ...item,
      note: this.mergeNotes(item.id),
      score: Math.round((item.rate / 100) * 5)
    }));
  }
}

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, RowComponent, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
