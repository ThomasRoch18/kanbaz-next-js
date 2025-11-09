"use client"
import { useRouter, useParams } from "next/navigation";
import * as db from "../../../Database";
import Link from "next/link";
import { Button, Col, Container, FormControl, FormLabel, InputGroup, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteAssignment } from "./reducer";
import { RootState } from "../../../store";
export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: any) => state.assignmentReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isStudent = (currentUser as any)?.role === "STUDENT";
  const [showModal, setShowModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowModal(false);
    setAssignmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setAssignmentToDelete(null);
  };
  return (
    <Container id="wd-assignments">
      <InputGroup size="lg" className="me-1 float-start" id="wd-search-assignment" style={{width: "300px"}}>
        <InputGroupText><FaMagnifyingGlass></FaMagnifyingGlass></InputGroupText>
        <FormControl type="text" placeholder="Search..." />
      </InputGroup>
      {!isStudent && (
        <>
        <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment" onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}>
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Assignment
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
            <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS <IoEllipsisVertical className="fs-4 float-end" /> 
            <BsPlus className="fs-4 float-end" /> 40% of Total
            </div>
          <ListGroup className="wd-lessons rounded-0">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (<ListGroupItem className="wd-lesson p-3 ps-1">
              <div className="wd-assignment-icon-left">
                <Col><BsGripVertical className="me-2 fs-3" /></Col>
                <Col><MdOutlineMapsHomeWork className="me-2 fs-3 wd-assignment-icon-left-right" /></Col>
                </div>
              <div className="wd-assignment-content"><Link href={`/Courses/${cid}/Assignments/${assignment._id}`} className="wd-assignment-link" >{assignment.title}</Link>
              <br />
              <p> Multiple Modules | Not Available until May 6 at 12:00am | <br /> Due May 13 at 11:59pm | 100 pts </p>
              </div>
              <div className="wd-assignment-icon-right">
                    <FaCheckCircle className="text-success me-1 fs-5" />
                    {!isStudent && (
                      <>
                        <FaTrash
                          role="button"
                          className="text-danger fs-5"
                          onClick={() => handleDeleteClick(assignment._id)}
                        />
                      </>
                    )}
                    <IoEllipsisVertical className="fs-5 float-end" />
                  </div>
              </ListGroupItem>))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
      <Modal show={showModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
);}

