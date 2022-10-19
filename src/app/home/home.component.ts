import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, filter, map, pluck, retryWhen, share, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancesCourses$: Observable<Course[]>;

  constructor() {

  }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      pluck('payload'),
      share()
    ) as Observable<Course[]>;

    this.beginnerCourses$ = courses$.pipe(
      map(val => val.filter(val => val.category === 'BEGINNER'))
    );

    this.advancesCourses$ = courses$.pipe(
      map(val => val.filter(val => val.category === 'ADVANCED'))
    );
  }

}
