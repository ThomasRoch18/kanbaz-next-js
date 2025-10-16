"use client"
import { useParams } from "next/navigation";
import * as db from "../../../Database";
import Link from "next/link";
import { Button, Col, Container, FormControl, FormLabel, InputGroup, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineMapsHomeWork } from "react-icons/md";
export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments;
  return (
    <Container id="wd-assignments">
      <InputGroup size="lg" className="me-1 float-start" id="wd-search-assignment" style={{width: "300px"}}>
        <InputGroupText><FaMagnifyingGlass></FaMagnifyingGlass></InputGroupText>
        <FormControl type="text" placeholder="Search..." />
      </InputGroup>
      <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment">
             <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
             Assignment
           </Button>
      <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-assignment-group">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Group
            </Button>
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
                    <FaCheckCircle className="text-success me-1 position-absolute fs-5" />
                    <IoEllipsisVertical className="fs-4 float-end" />
                  </div>
              </ListGroupItem>))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </Container>
);}
