import {Observable} from 'rxjs';

export const createHttpObservable = <T>(url: string): Observable<T> => {
  return new Observable((observer) => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        observer.next(data);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      });
  });
};

