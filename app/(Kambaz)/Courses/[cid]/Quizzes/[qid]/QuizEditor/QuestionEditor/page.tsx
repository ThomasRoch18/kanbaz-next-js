"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import * as client from "../../../../../client";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import {
  setQuizzes, setQuiz } from "../../../reducer"; 

export default function QuestionsTab() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const existingQuiz = Array.isArray(quizzes)
    ? quizzes.find((q: any) => q._id === qid)
    : null;

  const [questions, setQuestions] = useState(existingQuiz?.questions || []);

  //console.log(quizzes);
  //console.log(existingQuiz);
  //console.log(questions);

  useEffect(() => {
  if (existingQuiz && existingQuiz.questions) {
    setQuestions(existingQuiz.questions);
  }
}, [existingQuiz]);

  // --- Editing state functions ---
  const startEdit = (idx: number) => {
    setQuestions((prev: any[]) =>
      prev.map((q, i) => i === idx ? { ...q, _editing: true } : q)
    );
  };

  const cancelEdit = (idx: number) => {
    setQuestions((prev: any[]) =>
      prev.map((q, i) => i === idx ? { ...q, _editing: false } : q)
    );
  };

  const updateQuestionField = (idx: number, field: string, value: any) => {
  setQuestions((prev: any[]) =>
    prev.map((q, i) => {
      if (i !== idx) return q;

      // Always keep all fields
      let updated = { ...q, [field]: value };

      // Handle type change (replace answers)
      if (field === "type") {
        if (value === "mc") {
          updated = {
            ...updated,
            answers: [
              { _id: uuidv4(), description: "Option 1", correct: false, _editing: false },
              { _id: uuidv4(), description: "Option 2", correct: false, _editing: false }
            ]
          };
        }
        else if (value === "tf") {
          updated = {
            ...updated,
            answers: [
              { _id: uuidv4(), description: "True", correct: false, _editing: false },
              { _id: uuidv4(), description: "False", correct: false, _editing: false }
            ]
          };
        }
        else if (value === "fitb") {
          updated = {
            ...updated,
            answers: [
              { _id: uuidv4(), description: "", correct: true, _editing: true }
            ]
          };
        }
      }

      return updated;
    })
  );
};

  // --- Question CRUD ---
  const handleAddQuestion = async () => {
    const newQuestion = {
      _id: "temp-",
      title: "",
      descritpion: "",
      type: "mc",
      points: 1,
      answers: [
        { _id: uuidv4(), description: "Option 1", correct: false, _editing: false },
        { _id: uuidv4(), description: "Option 2", correct: false, _editing: false }
      ]
    };
    // const saved = await client.createQuizQuestion(qid as string, newQuestion);
    setQuestions((prev: any) => [...prev, { ...newQuestion, _editing: true }]);
  };

  const handleSaveQuestion = async (idx: number) => {
  const q = questions[idx];

  const isNew = !q._id || q._id.startsWith("temp-");

  const payload = {
    _id: isNew? uuidv4() : q._id,
    title: q.title,
    description: q.description,
    type: q.type,
    points: q.points,
    answers: q.answers.map((a: { _id: any; description: any; correct: any; }) => ({
      _id: a._id || uuidv4(),
      description: a.description,
      correct: a.correct })),
  };
  console.log(payload);
  if (isNew) {
    // CREATE new question
    await client.createQuizQuestion(qid as string, payload);
  } else {
    // UPDATE existing question
    await client.updateQuizQuestion(qid as string, q._id, payload);
  }

  setQuestions((prev: any[]) =>
    prev.map((item, i) => (i === idx ? payload : item))
  );
};


  const handleDeleteQuestion = async (questionId: string) => {
    await client.deleteQuizQuestion(qid as string, questionId);
    setQuestions((prev: any[]) => prev.filter(q => q._id !== questionId));
  };

  // --- Answer CRUD ---
  const editAnswer = (qIdx: number, aIdx: number) => {
  setQuestions((prev: any[]) =>
    prev.map((q, qi) =>
      qi === qIdx
        ? {
            ...q,
            answers: q.answers.map((a: any, ai: number) =>
              ai === aIdx ? { ...a, _editing: true } : a
            ),
          }
        : q
    )
  );
};

  const updateLocalAnswerField = (qIdx: number, aIdx: number, field: string, value: any) => {
  setQuestions((prev: any[]) =>
    prev.map((q, qi) =>
      qi === qIdx
        ? {
            ...q,
            answers: q.answers.map((a: any, ai: number) =>
              ai === aIdx ? { ...a, [field]: value } : a
            ),
          }
        : q
    )
  );
};

  const saveLocalAnswer = (qIdx: number, aIdx: number) => {
  setQuestions((prev: any[]) =>
    prev.map((q, qi) =>
      qi === qIdx
        ? {
            ...q,
            answers: q.answers.map((a: any, ai: number) =>
              ai === aIdx ? { ...a, _editing: false } : a
            ),
          }
        : q
    )
  );
};


  const handleAddAnswer = (qIdx: number) => {
  setQuestions((prev: any[]) =>
    prev.map((q, qi) =>
      qi === qIdx
        ? {
            ...q,
            answers: [
              ...q.answers,
              { _id: uuidv4(), description: "", correct: false, _editing: true }
            ],
          }
        : q
    )
  );
};

  const handleDeleteAnswer = (qIdx: number, answerId: string) => {
  setQuestions((prev: any[]) =>
    prev.map((q, qi) =>
      qi === qIdx
        ? {
            ...q,
            answers: q.answers.filter((a: { _id: string; }) => a._id !== answerId)
          }
        : q
    )
  );
};

  const handleSave = async () => {
    
      dispatch(setQuiz(existingQuiz));
      router.push(`/Courses/${cid}/Quizzes/${qid}/QuizDetails`);
    
  };
  
  const handleSaveAndPublish = async () => {
    
    await client.publishQuiz(qid as string);
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleCancel = async () => {
      router.push(`/Courses/${cid}/Quizzes`);
    };

  // --- Total points ---
  const totalPoints = questions.reduce((sum: any, q: { points: any; }) => sum + (q.points || 0), 0);

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4>Questions</h4>
        </Col>
        <Col className="text-end">
          <strong>Total Points: {totalPoints}</strong>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={handleAddQuestion}>+ New Question</Button>{" "}
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/QuizEditor`)}>
            ← Back to Quiz Details
          </Button>
        </Col>
      </Row>

      <ListGroup>
        {questions.map((q: any, idx: number) => (
          <ListGroup.Item key={q._id} className="mb-3">
            <Row>
              <Col md={8}>
                {!q._editing ? (
                  <>
                    <h5>{q.title}</h5>
                    <p><strong>Type:</strong> {q.type === "mc" ? "Multiple Choice" : q.type === "tf" ? "True / False" : "Fill in the blank"}</p>
                    <p><strong>Points:</strong> {q.points}</p>
                    <div>
                      <strong>Prompt:</strong>
                      <div dangerouslySetInnerHTML={{ __html: q.description || "" }} />
                    </div>
                    {q.type === "mc" && (
                      <div className="mt-2">
                        <strong>Options:</strong>
                        <ListGroup variant="flush">
                          {(q.answers || []).map((a: any, i: number) => (
                            <ListGroup.Item key={a._id}>
                              {a.correct ? <strong>(Correct)</strong> : null} {a.description}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                    {q.type === "tf" && <p><strong>Correct:</strong> {q.answers?.find((a:any)=>a.correct)?.description}</p>}
                    {q.type === "fitb" && (
                      <ul>{(q.answers || []).map((a: any) => <li key={a._id}>{a.description}</li>)}</ul>
                    )}
                  </>
                ) : (
                  <Form>
                    <Form.Group className="mb-2">
                      <Form.Label>Question Title</Form.Label>
                      <Form.Control type="text" value={q.title} onChange={(e) => updateQuestionField(idx, "title", e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Prompt (HTML allowed)</Form.Label>
                      <Form.Control as="textarea" rows={3} value={q.description} onChange={(e) => updateQuestionField(idx, "description", e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Type</Form.Label>
                      <Form.Select value={q.type} onChange={(e) => updateQuestionField(idx, "type", e.target.value)}>
                        <option value="mc">Multiple Choice</option>
                        <option value="tf">True / False</option>
                        <option value="fitb">Fill in the blank</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Points</Form.Label>
                      <Form.Control type="number" value={q.points} onChange={(e) => updateQuestionField(idx, "points", Number(e.target.value))} />
                    </Form.Group>
                    {/* --- True / False --- */}
                    {q.answers && q.type === "tf" && (
                      <>
                        <Form.Label>Correct Answer</Form.Label>
                        {q.answers.map((a: any, aIdx: number) => (
                          <div key={a._id} className="mb-2">
                            {!a._editing ? (
                              <InputGroup>
                                <InputGroup.Text>
                                  <Form.Check
                                    type="radio"
                                    name={`tf-${q._id}`}
                                    checked={a.correct}
                                    onChange={() => {
                                      setQuestions((prev: any[]) =>
                                        prev.map((qq, qi) =>
                                          qi === idx
                                            ? {
                                                ...qq,
                                                answers: qq.answers.map((ans: any, ii: number) => ({
                                                  ...ans,
                                                  correct: ii === aIdx,
                                                })),
                                              }
                                            : qq
                                        )
                                      );
                                    }}
                                  />
                                </InputGroup.Text>
                                <InputGroup.Text>{a.description}</InputGroup.Text>
                                <Button variant="outline-primary" onClick={() => editAnswer(idx, aIdx)}>Edit</Button>
                              </InputGroup>
                            ) : (
                              <InputGroup>
                                <InputGroup.Text>
                                  <Form.Check
                                    type="radio"
                                    name={`tf-${q._id}`}
                                    checked={a.correct}
                                    onChange={() => {
                                      setQuestions((prev: any[]) =>
                                        prev.map((qq, qi) =>
                                          qi === idx
                                            ? {
                                                ...qq,
                                                answers: qq.answers.map((ans: any, ii: number) => ({
                                                  ...ans,
                                                  correct: ii === aIdx,
                                                })),
                                              }
                                            : qq
                                        )
                                      );
                                    }}
                                  />
                                </InputGroup.Text>
                                <Form.Control
                                  value={a.description}
                                  onChange={(e) =>
                                    updateLocalAnswerField(idx, aIdx, "description", e.target.value)
                                  }
                                />
                                <Button variant="success" onClick={() => saveLocalAnswer(idx, aIdx)}>Save</Button>
                              </InputGroup>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* --- Fill in the Blank --- */}
                    {q.answers && q.type === "fitb" && (
                      <>
                        <Form.Label>Accepted Answers</Form.Label>
                        {q.answers.map((a: any, aIdx: number) => (
                          <div key={a._id} className="mb-2">
                            {!a._editing ? (
                              <InputGroup>
                                <Form.Control value={a.description} readOnly />
                                <Button variant="outline-primary" onClick={() => editAnswer(idx, aIdx)}>Edit</Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteAnswer(idx, a._id)}>Delete</Button>
                              </InputGroup>
                            ) : (
                              <InputGroup>
                                <Form.Control
                                  value={a.description}
                                  onChange={(e) =>
                                    updateLocalAnswerField(idx, aIdx, "description", e.target.value)
                                  }
                                />
                                <Button variant="success" onClick={() => saveLocalAnswer(idx, aIdx)}>Save</Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteAnswer(idx, a._id)}>Delete</Button>
                              </InputGroup>
                            )}
                            
                          </div>
                          
                        ))}
                        <Button variant="outline-primary" onClick={() => handleAddAnswer(idx)}>Add Answer</Button>
                      </>
                    )}
                    {q.answers && q.type === "mc" && (
                      <>
                        <Form.Label>Options</Form.Label>

                        {q.answers.map((a: any, aIdx: number) => (
                          <div key={a._id} className="mb-2">
                            {!a._editing ? (
                              <InputGroup>
                                <InputGroup.Text>
                                  <Form.Check
                                    type="radio"
                                    checked={a.correct}
                                    onChange={() => {
                                      setQuestions((prev: any[]) =>
                                        prev.map((qq, qi) =>
                                          qi === idx
                                            ? {
                                                ...qq,
                                                answers: qq.answers.map((ans: any, ii: number) => ({
                                                  ...ans,
                                                  correct: ii === aIdx,
                                                }))
                                              }
                                            : qq
                                        )
                                      );
                                    }}
                                  />
                                </InputGroup.Text>

                                <InputGroup.Text>{a.description}</InputGroup.Text>

                                <Button variant="outline-primary" onClick={() => editAnswer(idx, aIdx)}>Edit</Button>
                                <Button variant="outline-danger" onClick={() => handleDeleteAnswer(idx, a._id)}>Delete</Button>
                              </InputGroup>
                            ) : (
                              <InputGroup>
                                <InputGroup.Text>
                                  <Form.Check
                                    type="radio"
                                    checked={a.correct}
                                    onChange={() => {
                                      setQuestions((prev: any[]) =>
                                        prev.map((qq, qi) =>
                                          qi === idx
                                            ? {
                                                ...qq,
                                                answers: qq.answers.map((ans: any, ii: number) => ({
                                                  ...ans,
                                                  correct: ii === aIdx,
                                                }))
                                              }
                                            : qq
                                        )
                                      );
                                    }}
                                  />
                                </InputGroup.Text>

                                <Form.Control
                                  value={a.description}
                                  onChange={(e) =>
                                    updateLocalAnswerField(idx, aIdx, "description", e.target.value)
                                  }
                                />

                                <Button variant="success" onClick={() => saveLocalAnswer(idx, aIdx)}>Save</Button>
                              </InputGroup>
                            )}
                          </div>
                        ))}

                        <Button variant="outline-primary" onClick={() => handleAddAnswer(idx)}>
                          Add Option
                        </Button>
                      </>
                    )}

                  </Form>
                )}
              </Col>
              <Col md={4} className="text-end">
                {!q._editing ? (
                  <>
                    <Button variant="outline-primary" onClick={() => startEdit(idx)} className="me-2">Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteQuestion(q._id)}>Delete</Button>
                  </>
                ) : (
                  <>
                    <Button variant="success" onClick={() => handleSaveQuestion(idx)} className="me-2">Save</Button>
                    <Button variant="secondary" onClick={() => cancelEdit(idx)}>Cancel</Button>
                  </>
                )}
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
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

