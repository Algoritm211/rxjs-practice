import {Observable} from 'rxjs';

export const createHttpObservable = <T>(url: string): Observable<T> => {
  return new Observable((observer) => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(url, {signal})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          observer.error(`Request failed with error ${res.status}`);
        }
      })
      .then(data => {
        observer.next(data);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      });

    return () => controller.abort();
  });
};

