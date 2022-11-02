import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Course} from '../model/course';
import {createHttpObservable} from './util';
import {delay, map, pluck, retryWhen, share, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private courses = new BehaviorSubject<Course[]>([]);

  courses$ = this.courses.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$.pipe(
      pluck('payload'),
      retryWhen(error => error.pipe(delay(1000), take(10)))
    ).subscribe(courses => this.courses.next(courses as Course[]));
  }

  getBeginnerCourses() {
    return this.getCoursesByType('BEGINNER');
  }

  getAdvancedCourses() {
    return this.getCoursesByType('ADVANCED');
  }

  getCoursesByType(courseType: string) {
    return this.courses$.pipe(
      map(val => val.filter(val => val.category === courseType))
    );
  }
}
