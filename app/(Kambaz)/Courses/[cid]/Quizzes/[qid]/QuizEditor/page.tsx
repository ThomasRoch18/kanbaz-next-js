"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  setQuizzes, setQuiz } from "../../reducer"; 
import {
  Container,
  FormLabel,
  FormControl,
  Row,
  Col,
  FormCheck,
  Button,
} from "react-bootstrap";
import * as client from "../../../../client";

export default function QuizEditorDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const quizzes = useSelector((state: any) => state.quizzesReducer);

  const existingQuiz = Array.isArray(quizzes)
  ? quizzes.find((q: any) => q._id === qid)
  : null;

  const isEditing = qid && qid !== "new";

  const [form, setForm] = useState({
    _id: "",
    title: "",
    description: "",
    points: "",
    shuffleAnswers: false,
    hasTimeLimit: false,
    timeLimit: "",
    dueDate: "",
    availableDate: "",
    untilDate: "",
  });

  // Load existing quiz form data
  useEffect(() => {
    //console.log(quizzes)
      const load = async () => { 
        const quiz = await client.findQuizById(qid as string);
        if (isEditing) {
        setForm({
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        points: quiz.points,
        shuffleAnswers: quiz.shuffleAnswers,
        hasTimeLimit: quiz.hasTimeLimit,
        timeLimit: quiz.timeLimit,
        dueDate: quiz.dueDate,
        availableDate: quiz.availableDate,
        untilDate: quiz.untilDate,
      });
      }
    }; load();
  }, [isEditing, existingQuiz]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
};

  const handleSave = async () => {
  if (isEditing) {
    await onUpdateQuiz({ ...form, _id: qid });
    router.push(`/Courses/${cid}/Quizzes/${qid}/QuizDetails`);
  } else {
    const created = await onCreateQuiz(false);
    router.push(`/Courses/${cid}/Quizzes/${created._id}/QuizDetails`);
  }
};

const handleSaveAndPublish = async () => {
  if (isEditing) {
    await onUpdateQuiz({ ...form, _id: qid, published: true });
  } else {
    await onCreateQuiz(true);
  }
  await client.publishQuiz(qid as string);
  router.push(`/Courses/${cid}/Quizzes`);
};

const onCreateQuiz = async (publish = false) => {
  const newQuiz = {
    _id: cid + '-' + form.title,
  course: cid,
  published: publish,
  questions: existingQuiz?.questions || [],

  // fields from form or defaults
  title: form.title,
  description: form.description,
  points: form.points ?? 0,
  shuffleAnswers: form.shuffleAnswers ?? false,
  hasTimeLimit: form.hasTimeLimit ?? false,
  timeLimit: form.timeLimit ?? null,
  dueDate: form.dueDate ?? null,
  availableDate: form.availableDate ?? null,
  untilDate: form.untilDate ?? null,
  };

  const created = await client.createQuiz(newQuiz);
  
  dispatch(setQuiz(created));

  return created; // so caller knows new quiz id
};

const onUpdateQuiz = async (quiz: any) => {
  await client.updateQuiz(quiz._id, quiz);
  dispatch(setQuiz(quiz));
};

  const handleCancel = async () => {
    if (!isEditing) {
    await client.deleteQuiz(qid as string);
  }
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleQuestionEditor = async () => {
    if (qid === "new") {
      const created = await onCreateQuiz(false);
      router.push(`/Courses/${cid}/Quizzes/${created._id}/QuizEditor/QuestionEditor`)
    } else {
      await onUpdateQuiz({ ...form, _id: qid });
      router.push(`/Courses/${cid}/Quizzes/${qid}/QuizEditor/QuestionEditor`)
    }
  }

  return (
    <Container>
      <h3>{isEditing ? "Edit Quiz Details" : "New Quiz"}</h3>

      {/* TITLE */}
      <FormLabel>Quiz Title</FormLabel>
      <Button
        variant="primary"
        className="float-end"
        onClick={handleQuestionEditor}
      >
        Edit Questions →
      </Button>
      <FormControl
        type="text"
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      {/* DESCRIPTION */}
      <FormLabel>Description</FormLabel>
      <FormControl
        as="textarea"
        rows={5}
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      {/* POINTS */}
      <Row className="mb-3">
        <FormLabel column sm={2}>Points</FormLabel>
        <Col sm={10}>
          <FormControl
            type="number"
            value={form.points}
            onChange={(e) => handleChange("points", e.target.value)}
          />
        </Col>
      </Row>

      {/* SHUFFLE ANSWERS */}
      <Row className="mb-3">
        <Col>
          <FormCheck
            type="checkbox"
            label="Shuffle Answers"
            checked={form.shuffleAnswers}
            onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
          />
        </Col>
      </Row>

      {/* TIME LIMIT */}
      <Row className="mb-3">
        <Col>
          <FormCheck
            type="checkbox"
            label="Time Limit"
            checked={form.hasTimeLimit}
            onChange={(e) => handleChange("hasTimeLimit", e.target.checked)}
          />
        </Col>
      </Row>

      {form.hasTimeLimit && (
        <Row className="mb-3">
          <FormLabel column sm={2}>Minutes</FormLabel>
          <Col sm={10}>
            <FormControl
              type="number"
              value={form.timeLimit}
              onChange={(e) => handleChange("timeLimit", e.target.value)}
            />
          </Col>
        </Row>
      )}

      {/* DATES */}
      <Row className="mb-3">
        <FormLabel column sm={2}>Due Date</FormLabel>
        <Col sm={10}>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2}>Available</FormLabel>
        <Col sm={10}>
          <input
            type="date"
            value={form.availableDate}
            onChange={(e) => handleChange("availableDate", e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2}>Until</FormLabel>
        <Col sm={10}>
          <input
            type="date"
            value={form.untilDate}
            onChange={(e) => handleChange("untilDate", e.target.value)}
          />
        </Col>
      </Row>

      {/* BUTTONS */}
      <Row className="mt-4">
        <Col>
          <button className="btn btn-secondary w-100" onClick={handleCancel}>
            Cancel
          </button>
        </Col>

        <Col>
          <button className="btn btn-danger w-100" onClick={handleSave}>
            Save
          </button>
        </Col>

        <Col>
          <button className="btn btn-success w-100" onClick={handleSaveAndPublish}>
            Save & Publish
          </button>
        </Col>
      </Row>
    </Container>
  );
}