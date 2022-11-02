import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, map, pluck, retry, retryWhen, share, shareReplay, take, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {StoreService} from '../common/store.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancesCourses$: Observable<Course[]>;

  constructor(private store: StoreService) {

  }

  ngOnInit() {
    this.beginnerCourses$ = this.store.getBeginnerCourses();

    this.advancesCourses$ = this.store.getAdvancedCourses();
  }

}
