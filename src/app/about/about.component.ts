import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {createHttpObservable} from '../common/util';
import {map, pluck} from 'rxjs/operators';
import {AsyncSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    const subject = new AsyncSubject();

    const subject$ = subject.asObservable();

    subject$.subscribe((val) => console.log('First', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    subject.complete();

    setTimeout(() => {
      subject$.subscribe(val => console.log('Late', val));
      subject.next(4);

    }, 2000);
  }

}
