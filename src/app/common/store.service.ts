import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
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

  saveCourse(courseId: number, changes) {
    const courses = this.courses.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);

    const updatedCourses = courses.slice(0);
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      ...changes
    };

    this.courses.next(updatedCourses);

    return from(fetch(`api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  getBeginnerCourses() {
    return this.getCoursesByType('BEGINNER');
  }

  getAdvancedCourses() {
    return this.getCoursesByType('ADVANCED');
  }

  selectCourseById(id: number) {
    return this.courses$.pipe(
      map(val => {
        return val.find(val => val.id === id);
      })
    );
  }

  getCoursesByType(courseType: string) {
    return this.courses$.pipe(
      map(val => val.filter(val => val.category === courseType))
    );
  }
}
