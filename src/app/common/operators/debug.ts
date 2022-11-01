import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum LoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxJSLoggingLevel = LoggingLevel.INFO;

export const setRxJSLoggingLevel = (level: LoggingLevel) => {
  rxJSLoggingLevel = level;
};

export const debug = <T>(loggingLevel: LoggingLevel, message: string) =>
  (source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap((val) => {
        if (loggingLevel >= rxJSLoggingLevel) {
          console.log(`${message}:`, val);
        }
      }),
    );
  };
