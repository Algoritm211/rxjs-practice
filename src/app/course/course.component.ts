import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {debounceTime, distinctUntilChanged, map, pluck, startWith, switchMap, tap} from 'rxjs/operators';
import {fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debug, LoggingLevel, setRxJSLoggingLevel} from '../common/operators/debug';
import {StoreService} from '../common/store.service';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: number;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(
    private store: StoreService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.courseId = +this.route.snapshot.params['id'];
    this.course$ = this.store.selectCourseById(+this.route.snapshot.params['id']);
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
        startWith(''),
        debug(LoggingLevel.TRACE, 'search value'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchStr) => {
          return this.loadLessons(searchStr);
        }),
        debug(LoggingLevel.INFO, 'lessons value'),
      );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        tap(console.log),
        pluck('payload'),
      );
  }
}
