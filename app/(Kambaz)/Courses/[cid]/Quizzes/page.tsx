"use client";

import { RootState } from "../../../store";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setQuizzes } from "./reducer";
import * as client from "../../client"
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, InputGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaMagnifyingGlass, FaPencil, FaPlus, FaTrash } from "react-icons/fa6";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { FcCancel } from "react-icons/fc";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function Quizzes() {
  const { cid } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const isStudent = (currentUser as any)?.role === "STUDENT";
    const [grades, setGrades] = useState<any>({});
    const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

    console.log(quizzes);

    const toggleMenu = (qid: string) => {
      setOpenMenuFor(openMenuFor === qid ? null : qid);
    };
    const fetchQuizzes = async () => {
          const quizzes = await client.findQuizzesForCourse(cid as string);
          dispatch(setQuizzes(quizzes));
        };
        useEffect(() => {
          fetchQuizzes();
        }, []);

        console.log(quizzes);
    const togglePublish = async (quiz: any) => {
        let updated;
        if (quiz.published) {
          updated = await client.unpublishQuiz(quiz._id);
        } else {
          updated = await client.publishQuiz(quiz._id);
        }

        dispatch(
          setQuizzes(quizzes.map((q: any) => q._id === quiz._id ? updated : q))
        );
      };
  useEffect(() => {
  if (!isStudent || quizzes.length === 0) return;

  const loadGrades = async () => {
    const result: any = {};
    for (const q of quizzes) {
      const attempt = await client.findAttemptForUser((currentUser as any)._id, q._id);
      result[q._id] = attempt?.grade ?? null;
    }
    setGrades(result);
  };
  loadGrades();
}, [quizzes]);

const visibleQuizzes = isStudent
  ? quizzes.filter((q: any) => q.published)
  : quizzes;

  return (
    <Container id="wd-quizzes">
      <InputGroup size="lg" className="me-1 float-start" id="wd-search-assignment" style={{width: "300px"}}>
        <InputGroupText><FaMagnifyingGlass></FaMagnifyingGlass></InputGroupText>
        <FormControl type="text" placeholder="Search..." />
      </InputGroup>
      {!isStudent && (
        <>
        <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment" onClick={() => router.push(`/Courses/${cid}/Quizzes/new/QuizEditor`)}>
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Quiz
            </Button>
        <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-assignment-group">
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Group
              </Button>
        </>
      )}
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> QUIZZES <IoEllipsisVertical className="fs-4 float-end" /> 
            <BsPlus className="fs-4 float-end" /> 10% of Total
            </div>
          <ListGroup className="wd-lessons rounded-0">
            {quizzes.length === 0 ? (
              <div className="text-center my-5 fs-4 text-muted">
                No quizzes yet. Click <strong>+ Quiz</strong> to create one.
              </div>
            ) :
            (visibleQuizzes
              .map((quiz: any) => (<ListGroupItem className="wd-lesson p-3 ps-1">
              <div className="wd-assignment-icon-left">
                <Col><BsGripVertical className="me-2 fs-3" /></Col>
                <Col><MdOutlineMapsHomeWork className="me-2 fs-3 wd-assignment-icon-left-right" /></Col>
                </div>
              <div className="wd-assignment-content">
                <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/QuizDetails`} className="wd-assignment-link" >{quiz.title}</Link>
                <p>Questions: {quiz.questions?.length ?? 0} | {isStudent && <p>Score: {grades[quiz._id] ?? "—"}</p>}</p>
              
              <p> Due: {quiz.dueDate} | Points: {quiz.points} | <br /> Available: {quiz.availableDate} | Until: {quiz.untilDate} </p>
              </div>
              <div className="wd-assignment-icon-right">
                {!isStudent && openMenuFor === quiz._id && (
                  <>
                    {quiz.published ? (
                  <FaCheckCircle onClick={() => togglePublish(quiz)}
                  className="text-success me-1 fs-5" />
                  ) : (
                  <FcCancel onClick={() => togglePublish(quiz)}
                  className="me-1 fs-5" />
                  ) }
                    <FaPencil
                      role="button"
                      onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/QuizEditor`)}
                      className="text-primary me-3"
                    />

                    <FaTrash
                      role="button"
                      className="text-danger fs-5"
                      onClick={async () => {
                        await client.deleteQuiz(quiz._id);
                        dispatch(setQuizzes(quizzes.filter((q: any) => q._id !== quiz._id)));
                      }}
                    />

                  </>
                  
                )}
                <IoEllipsisVertical
                  role="button"
                  className="fs-5 float-end"
                  onClick={() =>
                    toggleMenu(openMenuFor === quiz._id ? null : quiz._id)
                  }
                />
              </div>
              </ListGroupItem>)))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </Container>
);}