"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../../../client";
import { Button, Container, Card } from "react-bootstrap";
import { FaCheckCircle, FaPencilAlt, FaPlay, FaEye } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { setQuizzes, setQuiz } from "../../reducer"; 

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isStudent = (currentUser as any)?.role === "STUDENT";

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  console.log(quizzes);
  const quiz = Array.isArray(quizzes)
  ? quizzes.find((q: any) => q._id === qid)
  : null;

  const [isPublished, setPublishedStatus] = useState(quiz.published); 
   useEffect(() => {
      setPublishedStatus(quiz.published);
  }, [quiz]);
  
  console.log(quiz);
  const [grade, setGrade] = useState<number | null>(null);


  const loadGrade = async () => {
    if (!isStudent) return;
    const attempt = await client.findAttemptForUser(
      (currentUser as any)._id,
      qid as string
    );
    setGrade(attempt?.grade ?? null);
  };

  useEffect(() => {
    loadGrade();
  }, [qid]);

  if (!quiz) return <Container>Loading...</Container>;

  // ---- Availability Status ----
  const now = new Date();
  const availableDate = quiz.available ? new Date(quiz.available) : null;
  const untilDate = quiz.until ? new Date(quiz.until) : null;

  let availabilityMessage = "Available";
  if (availableDate && now < availableDate) {
    availabilityMessage = `Not available until ${availableDate.toLocaleString()}`;
  } else if (untilDate && now > untilDate) {
    availabilityMessage = "Closed";
  }

  // ---- Publishing ----
  const togglePublish = async () => {
    let updated;
    if (isPublished) {
      updated = await client.unpublishQuiz(quiz._id);
      setPublishedStatus(false);
    } else {
      updated = await client.publishQuiz(quiz._id);
      setPublishedStatus(true);
    }
    

    setQuiz((prev: any) => ({
    ...prev,
    published: updated.published,
  }));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">{quiz.name}</h2>

      {/* Status + Publish Control */}
      {!isStudent && (
        <div className="mb-3">
          {isPublished ? (
            <Button variant="warning" onClick={togglePublish}>
              <FcCancel className="me-2" />
              Unpublish
            </Button>
          ) : (
            <Button variant="success" onClick={togglePublish}>
              <FaCheckCircle className="me-2" />
              Publish
            </Button>
          )}
        </div>
      )}

    <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>

      <div className="mt-3">
        <strong>Points:</strong> {quiz.points}<br/>
        <strong>Shuffle Answers:</strong> {quiz.shuffle ? "Yes" : "No"}<br/>
        <strong>Time Limit:</strong> {quiz.timeLimit ? quiz.timeLimit + " mins" : "None"}<br/>
        <strong>Due Date:</strong> {quiz.dueDate}<br/>
        <strong>Available From:</strong> {quiz.availableDate}<br/>
        <strong>Until:</strong> {quiz.untilDate}<br/>
        <strong>Published:</strong> {quiz.published ? "Yes" : "No"}
      </div>

      {/* Buttons */}
      <div className="d-flex gap-3">
        {isStudent ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)
            }
            disabled={!quiz.published}
          >
            <FaPlay className="me-2" />
            Take the Quiz
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={() =>
                router.push(`/Courses/${cid}/Quizzes/${qid}/QuizEditor`)
              }
            >
              <FaPencilAlt className="me-2" />
              Edit
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/Courses/${cid}/Quizzes/${qid}/QuizPreview`)
              }
            >
              <FaEye className="me-2" />
              Preview
            </Button>
          </>
        )}
      </div>
    </Container>
  );
}
