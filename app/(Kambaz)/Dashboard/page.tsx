"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/Reducer";
import { enrollInCourse, unenrollFromCourse, setEnrollments } from "./reducer";
import { RootState } from "../store";
import * as client from "../Courses/client"

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>(
    {_id: "",
    name: "",
    number: "",
    startDate: "",
    endDate: "",
    department: "",
    credits: 0,
    description: "",
    author: "",}
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isStudent = (currentUser as any)?.role === "STUDENT";

  const enrollments = useSelector((state: RootState) => state.enrollmentsReducer.enrollments);

  const userId = (currentUser as any)?._id;

  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => setShowAll(prev => !prev);

  const filteredCourses = showAll
    ? courses
    : courses.filter(course => enrollments.some(e => e.user === userId && e.course === course._id));

  const handleEnroll = (courseId: string) => enrollUser(userId, courseId);
  const handleUnenroll = (courseId: string) => unEnrollUser(userId, courseId);

const fetchEnrollments = async () => {
      try {
        const myEnrollments = await client.fetchAllEnrollments();
        dispatch(setEnrollments(myEnrollments));
      } catch (e) {
        console.error("Error fetching courses", e);
      }
    };
  
    useEffect(() => {
      if (currentUser) fetchEnrollments();
    }, [currentUser]);

  const fetchCourses = async () => {
      try {
        const myCourses = await client.fetchAllCourses();
        dispatch(setCourses(myCourses));
      } catch (e) {
        console.error("Error fetching courses", e);
      }
    };
  
    useEffect(() => {
      if (currentUser) fetchCourses();
    }, [currentUser]);
  
    const onAddNewCourse = async () => {
      const newCourse = await client.createCourse(course);
      dispatch(setCourses([ ...courses, newCourse ]));
    };
  const onDeleteCourse = async (courseId: string) => {
      const status = await client.deleteCourse(courseId);
      dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
    };
    const onUpdateCourse = async () => {
      await client.updateCourse(course);
      dispatch(setCourses(courses.map((c) => {
          if (c._id === course._id) { return course; }
          else { return c; }
      })));};

    const enrollUser = async (userId: string, courseId: string) => {
      await client.enrollUser(userId, courseId);
      const updatedEnrollments = await client.fetchAllEnrollments();
      dispatch(setEnrollments(updatedEnrollments));
    };

    const unEnrollUser = async (userId: string, courseId: string) => {
      await client.unEnrollUser(userId, courseId);
      const updatedEnrollments = await client.fetchAllEnrollments();
      dispatch(setEnrollments(updatedEnrollments));
    }
  
  
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {!isStudent && (
        <>
          <h5>New Course
              <button className="btn btn-primary float-end"
                      id="wd-add-new-course-click"
                      onClick={onAddNewCourse} > Add </button>
              <button className="btn btn-warning float-end me-2"
                    onClick={onUpdateCourse} id="wd-update-course-click">
              Update </button>
              
        </h5>
        <br />
      <FormControl value={course.name} className="mb-2" 
                  onChange={(e) => setCourse({ ...course, name: e.target.value }) }/>
      <FormControl as="textarea" value={course.description} rows={3}
                  onChange={(e) => setCourse({ ...course, description: e.target.value }) }/>
        </>
        )}
      
        <Button className="mb-3" onClick={toggleShowAll}>
          {showAll ? "Show My Courses" : "Show All Courses"}
        </Button>
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
                          onDeleteCourse(course._id);
                            }} className="btn btn-danger float-end"
                            id="wd-delete-course-click">
                          Delete
                        </Button>
                        <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end" >
                          Edit
                        </button>
                      </>)}
                    {
                     enrollments.some(e => e.user === userId && e.course === course._id) ? (
                        <Button variant="danger" onClick={(e) => {e.preventDefault(); handleUnenroll(course._id);}}>
                          Unenroll
                        </Button>
                      ) : (
                        <Button variant="success" onClick={(e) => {e.preventDefault(); handleEnroll(course._id);}}>
                          Enroll
                        </Button>
                      )
                    }
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>);}