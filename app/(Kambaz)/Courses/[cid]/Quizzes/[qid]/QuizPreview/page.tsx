"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Container, Button, Card, Form } from "react-bootstrap";
import * as client from "../../../../client";
import { v4 as uuidv4 } from 'uuid';

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isStudent = currentUser?.role === "STUDENT";

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submittedAttempt, setSubmittedAttempt] = useState<any>(null);

  const [index, setIndex] = useState(0);   // <-- CURRENT QUESTION INDEX

  // console.log(currentUser._id);
  // console.log(qid);
  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      const data = await client.findQuizById(qid as string);
      setQuiz(data);

      if (isStudent) {

        const existingAttempt = await client.findAttemptForUser(
          currentUser._id,
          qid as string
        );
        if (existingAttempt) {
          setSubmittedAttempt(existingAttempt);
          setAnswers(existingAttempt.answers || {});
        }
      }
    };

    loadQuiz();
  }, [qid, isStudent]);

  if (!quiz) return <Container>Loading...</Container>;

  const q = quiz.questions[index]; // <-- CURRENT QUESTION

  // Student chooses an answer (faculty cannot)
  const selectAnswer = (questionId: string, choiceIndex: any) => {
    if (!isStudent || submittedAttempt) return;
    setAnswers({ ...answers, [questionId]: choiceIndex });
  };

  // Submit for students
  const submit = async () => {
    const attempt = {
      _id: uuidv4(),
      quiz: quiz._id,
      user: currentUser._id,
      answers,
    };
    const saved = await client.createAttempt(attempt);
    setSubmittedAttempt(saved);
  };

  // Navigation
  const previous = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () =>
    setIndex((i) => Math.min(i + 1, quiz.questions.length - 1));

  return (
    <Container className="my-4">
      <h2 className="mb-3">
        {isStudent ? "Take Quiz" : "Quiz Preview"}: {quiz.name}
      </h2>

      <p className="text-muted">{quiz.description}</p>

      {submittedAttempt && (
        <Card className="p-3 mb-4 bg-light border-success">
          <h4>Your Score: {submittedAttempt.grade}%</h4>
        </Card>
      )}

      {/* ---------------------------- QUESTION CARD ---------------------------- */}
      <Card className="p-4 mb-4">
        <h4>
          Question {index + 1} of {quiz.questions.length}
        </h4>

        <p className="fw-bold mt-3">{q.title}</p>
        <p>{q.description}</p>

        {/* -------- Multiple Choice -------- */}
        {q.type === "mc" &&
          q.answers.map((a: any, aIdx: number) => (
            <Form.Check
              key={a._id}
              type="radio"
              disabled={!!submittedAttempt || !isStudent}
              name={`q-${q._id}`}
              label={a.description}
              checked={answers[q._id] === aIdx}
              onChange={() => selectAnswer(q._id, aIdx)}
            />
          ))}

        {/* -------- True / False -------- */}
        {q.type === "tf" &&
          q.answers.map((a: any, aIdx: number) => (
            <Form.Check
              key={a._id}
              type="radio"
              disabled={!!submittedAttempt || !isStudent}
              name={`q-${q._id}`}
              label={a.description}
              checked={answers[q._id] === aIdx}
              onChange={() => selectAnswer(q._id, aIdx)}
            />
          ))}

        {/* -------- Fill In The Blank -------- */}
        {q.type === "fitb" && (
          <Form.Control
            className="mt-2"
            type="text"
            disabled={!!submittedAttempt || !isStudent}
            value={answers[q._id] || ""}
            placeholder="Your answer"
            onChange={(e) => selectAnswer(q._id, e.target.value)}
          />
        )}

        {/* If submitted, show correct answers */}
        {submittedAttempt && (
          <div className="mt-3">
            <div className="fw-bold">Correct Answer:</div>
            {q.type === "fitb" ? (
              <div className="text-success">{q.answers[0]?.description}</div>
            ) : (
              <div className="text-success">
                {q.answers[q.answers.findIndex((a:any) => a.correct)]?.description}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ---------------------------- NAV BUTTONS ---------------------------- */}
      <div className="d-flex justify-content-between mb-4">
        <Button disabled={index === 0} onClick={previous}>
          Previous
        </Button>

        <Button
          disabled={index === quiz.questions.length - 1}
          onClick={next}
        >
          Next
        </Button>
      </div>

      {/* ---------------------------- FOOTER BUTTONS ---------------------------- */}
      <div className="mt-2 d-flex gap-3">
        {/* Edit button for Faculty */}
        {!isStudent && (
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/QuizEditor`)
            }
          >
            Edit Quiz
          </Button>
        )}

        {/* Submit for students */}
        {isStudent && !submittedAttempt && (
          <Button variant="success" onClick={submit}>
            Submit Quiz
          </Button>
        )}

        {/* Back */}
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>
    </Container>
  );
}