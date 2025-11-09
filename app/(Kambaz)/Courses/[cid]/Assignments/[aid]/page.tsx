"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { addAssignment, updateAssignment } from "../reducer";
import { Container, FormLabel, FormControl, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector((state: any) => state.assignmentReducer);
  const existingAssignment = assignments.find((a: any) => a._id === aid);

  const isEditing = aid && aid !== "new";

  const [form, setForm] = useState({
    title: "",
    description: "",
    points: "",
    due: "",
    availableFrom: "",
    availableUntil: "",
  });

  useEffect(() => {
    if (isEditing && existingAssignment) {
      setForm({
        title: existingAssignment.title || "",
        description: existingAssignment.description || "",
        points: existingAssignment.points || "",
        due: existingAssignment.due || "",
        availableFrom: existingAssignment.availableFrom || "",
        availableUntil: existingAssignment.availableUntil || "",
      });
    }
  }, [isEditing, existingAssignment]);

  const handleChange = (field: string, value: string) =>
    setForm({ ...form, [field]: value });

  const handleSave = () => {
    if (isEditing) {
      dispatch(updateAssignment({ _id: aid, ...form }));
    } else {
      dispatch(addAssignment({ ...form, course: cid }));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => router.push(`/Courses/${cid}/Assignments`);

  return (
    <Container>
      <h3>{isEditing ? "Edit Assignment" : "New Assignment"}</h3>

      <FormLabel>Assignment Name</FormLabel>
      <FormControl
        type="text"
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <FormLabel>Description</FormLabel>
      <FormControl
        as="textarea"
        rows={5}
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

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

      <Row className="mb-3">
        <FormLabel column sm={2}>Due</FormLabel>
        <Col sm={10}>
          <input
            type="date"
            value={form.due}
            onChange={(e) => handleChange("due", e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2}>Available From</FormLabel>
        <Col sm={10}>
          <input
            type="date"
            value={form.availableFrom}
            onChange={(e) => handleChange("availableFrom", e.target.value)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <FormLabel column sm={2}>Until</FormLabel>
        <Col sm={10}>
          <input
            type="date"
            value={form.availableUntil}
            onChange={(e) => handleChange("availableUntil", e.target.value)}
          />
        </Col>
      </Row>

      <Row>
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
      </Row>
    </Container>
  );
}
