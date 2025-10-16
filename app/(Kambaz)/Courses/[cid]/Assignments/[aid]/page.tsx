"use client"
import { useParams } from "next/navigation";
import * as db from "../../../../Database";
import { Card, CardBody, CardText, CardTitle, Col, Container, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import Link from "next/link";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const assignments = db.assignments;
    const currentAssignment = assignments.find((assignment: any) => assignment._id === aid);
  return (
    <Container id="wd-assignments-editor">
      <FormLabel>Assignment Name</FormLabel>
        <FormControl type="text" placeholder={`${currentAssignment?.title}`} className="wd-assignment-width"/> <br />
      <FormControl as="textarea" rows={10} className="wd-assignment-width" defaultValue={`${currentAssignment?.description}`}/> <br />
      <Row className="mb-3" id="wd-points">
            <FormLabel column sm={2} className="float-end"> Points </FormLabel>
            <Col sm={10}>
                <FormControl type="text" defaultValue={`${currentAssignment?.points}`} />
            </Col>
      </Row> <br />
      <Row className="mb-3" id="wd-group">
            <FormLabel column sm={2} className="float-end"> Assignment Group </FormLabel>
            <Col sm={10}>
                <FormSelect>
                    <option value="0" defaultChecked>ASSIGNMENTS</option>
                    <option value="1">QUIZZES</option>
                    <option value="2">EXAMS</option>
                    <option value="3">PROJECTS</option>
                </FormSelect>
            </Col>
      </Row> <br />
      <Row className="mb-3" id="wd-display-grade-as">
            <FormLabel column sm={2} className="float-end"> Display Grade As </FormLabel>
            <Col sm={10}>
                <FormSelect>
                    <option value="0" defaultChecked>Percentage</option>
                    <option value="1">Points</option>
                </FormSelect>
            </Col>
      </Row> <br />
      <Row className="mb-3" id="wd-group">
            <FormLabel column sm={2} className="float-end"> Submission Type </FormLabel>
            <Col sm={10}>
                <Card className="wd-assignment-width">
                    <CardBody>
                        <FormSelect>
                            <option value="0" defaultChecked>Online</option>
                        </FormSelect>
                        <br />
                        <label htmlFor="wd-entry-options">Online Entry Options</label><br />
                            <input type="checkbox" name="check-entry" id="wd-text-entry"/>
                            <label htmlFor="wd-text-entry">Text Entry</label><br/>

                            <input type="checkbox" name="check-entry" id="wd-website-url"/>
                            <label htmlFor="wd-website-url">Website URL</label><br/>

                            <input type="checkbox" name="check-entry" id="wd-media-recordings"/>
                            <label htmlFor="wd-media-recordings">Media Recordings</label><br/>

                            <input type="checkbox" name="check-entry" id="wd-student-annotation"/>
                            <label htmlFor="wd-student-annotation">Student Annotations</label><br />

                            <input type="checkbox" name="check-entry" id="wd-file-upload"/>
                            <label htmlFor="wd-file-upload">File Uploads</label>
                    </CardBody>
                </Card>
            </Col>
      </Row> <br />
      <Row className="mb-3" id="wd-assign-to">
            <FormLabel column sm={2} className="float-end"> Assign </FormLabel>
            <Card className="wd-assignment-width">
                <h6>Assign To</h6>
                <FormControl type="text" placeholder="Everyone" /> <br />
                <label htmlFor="wd-due-date">Due</label>
                <input type="date" defaultValue={`${currentAssignment?.due}`} id="wd-due-date"/>
                <Row>
                    <Col className="wd-assignment-calendar-width">
                        <label htmlFor="wd-available-from">Available From</label><br />
                        <input type="date" defaultValue={`${currentAssignment?.available}`} id="wd-available-from"/>
                    </Col>
                    <Col className="wd-assignment-calendar-width">
                        <label htmlFor="wd-available-to">Until</label><br />
                        <input type="date" defaultValue={`${currentAssignment?.due}`} id="wd-available-to"/>
                    </Col>
                </Row>
            </Card>
      </Row>
      <Row className="mb-3">
        <Col>
            <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary w-100 mb-2"> Cancel </Link>
        </Col>
        <Col>
            <Link href={`/Courses/${cid}/Assignments`} className="btn btn-danger w-100 mb-2"> Save </Link>
        </Col>
      </Row>
    </Container>
);}
