"use client";

import { useState } from "react";
import Link from "next/link";
import * as db from "../Database";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/Reducer";
import { enrollInCourse, unenrollFromCourse } from "./reducer";
import { RootState } from "../store";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>(db.courses);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isStudent = (currentUser as any)?.role === "STUDENT";

  const enrollments = useSelector((state: RootState) => state.enrollmentsReducer.enrollments);

  const userId = (currentUser as any)?._id;

  const [showAll, setShowAll] = useState(false);
  const [courseForm, setCourseForm] = useState<any>(db.courses[0] || {}); // Form for Faculty add/update

  const toggleShowAll = () => setShowAll(prev => !prev);

  const filteredCourses = showAll
    ? courses
    : courses.filter(course => enrollments.some(e => e.user === userId && e.course === course._id));

  const handleEnroll = (courseId: string) => dispatch(enrollInCourse({ userId, courseId }));
  const handleUnenroll = (courseId: string) => dispatch(unenrollFromCourse({ userId, courseId }));
  
  
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {!isStudent && (
        <>
          <h5>New Course
              <button className="btn btn-primary float-end"
                      id="wd-add-new-course-click"
                      onClick={() => dispatch(addNewCourse(course))} > Add </button>
              <button className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
              Update </button>
              
        </h5>
        <br />
      <FormControl value={course.name} className="mb-2" 
                  onChange={(e) => setCourses({ ...course, name: e.target.value }) }/>
      <FormControl as="textarea" value={course.description} rows={3}
                  onChange={(e) => setCourses({ ...course, description: e.target.value }) }/>
        </>
        )}
      {isStudent && (
        <Button className="mb-3" onClick={toggleShowAll}>
          {showAll ? "Show My Courses" : "Show All Courses"}
        </Button>
      )}
      <h2 id="wd-dashboard-published">Published Courses ({filteredCourses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses
          .map((course) => (
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${course._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name} </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description} </CardText>
                    <Button variant="primary"> Go </Button>
                    {!isStudent && (
                      <>
                        <Button onClick={(event) => {
                          event.preventDefault();
                          dispatch(deleteCourse(course._id));
                            }} className="btn btn-danger float-end"
                            id="wd-delete-course-click">
                          Delete
                        </Button>
                        <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourses(course);
                          }}
                          className="btn btn-warning me-2 float-end" >
                          Edit
                        </button>
                      </>)}
                    {isStudent && (
                     enrollments.some(e => e.user === userId && e.course === course._id) ? (
                        <Button variant="danger" onClick={(e) => {e.preventDefault(); handleUnenroll(course._id);}}>
                          Unenroll
                        </Button>
                      ) : (
                        <Button variant="success" onClick={(e) => {e.preventDefault(); handleEnroll(course._id);}}>
                          Enroll
                        </Button>
                      )
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>);}