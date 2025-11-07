"use client";

import { useState } from "react";
import Link from "next/link";
import * as db from "../Database";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/Reducer";
import { RootState } from "../store";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>(db.courses);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = db;
  
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={() => dispatch(addNewCourse(course))} > Add </button>
          <button className="btn btn-warning float-end me-2"
                onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
          Update </button>

      </h5><br />
      <FormControl value={course.name} className="mb-2" 
                  onChange={(e) => setCourses({ ...course, name: e.target.value }) }/>
      <FormControl as="textarea" value={course.description} rows={3}
                  onChange={(e) => setCourses({ ...course, description: e.target.value }) }/>
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.filter((course) =>
          enrollments.some(
          (enrollment) =>
          enrollment.user === (currentUser as any)?._id &&
          enrollment.course === course._id
         ))
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

                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>);}