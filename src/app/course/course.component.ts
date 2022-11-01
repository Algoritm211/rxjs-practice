import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {debounceTime, distinctUntilChanged, map, pluck, startWith, switchMap} from 'rxjs/operators';
import {fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debug, LoggingLevel, setRxJSLoggingLevel} from '../common/operators/debug';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', {static: true}) input: ElementRef;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    this.course$ = createHttpObservable<Course>(`/api/courses/${this.courseId}`).pipe(
      debug(LoggingLevel.INFO, 'course value'),
    );
    setRxJSLoggingLevel(LoggingLevel.TRACE);
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
        pluck('payload'),
      );
  }
}
