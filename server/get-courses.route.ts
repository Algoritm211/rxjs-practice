import {Request, Response} from 'express';
import {COURSES} from './db-data';


export function getAllCourses(req: Request, res: Response) {


  // const error = (Math.random() >= 0.5);

  const error = false;

  if (error) {
    console.log('ERROR loading courses!');
    res.status(500).json({message: 'random error occurred.'});
  } else {
    setTimeout(() => {
      res.status(200).json({payload: Object.values(COURSES)});
    }, 200);
  }
}


export function getCourseById(req: Request, res: Response) {

  const courseId = req.params['id'];

  const courses: any = Object.values(COURSES);

  const course = courses.find((c) => c.id.toString() === courseId);

  res.status(200).json(course);
}
