"use client";

import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { usePathname } from "next/navigation";
import { courses } from "../../Database";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  params: { cid: string };
}

export default function CourseNavigation({ children, params }: Props) {
  const pathname = usePathname();
  const { cid } = params;

  const course = courses.find((c) => c._id === cid);

  const links = [
    { label: "Home", path: `/Courses/${cid}/Home` },
    { label: "Modules", path: `/Courses/${cid}/Modules` },
    { label: "Piazza", path: `/Courses/${cid}/Piazza` },
    { label: "Zoom", path: `/Courses/${cid}/Zoom` },
    { label: "Assignments", path: `/Courses/${cid}/Assignments` },
    { label: "Quizzes", path: `/Courses/${cid}/Quizzes` },
    { label: "Grades", path: `/Courses/${cid}/Grades` },
    { label: "People", path: `/Courses/${cid}/People` },
  ];

  return (
    <ListGroup id="wd-courses-navigation" className="list-group wd fs-5 rounded-0">
      {links.map((link) => (
        <ListGroupItem
          key={link.label}
          as={Link}
          href={link.path}
          className={`list-group-item border-0 ${
            pathname.includes(link.label)
              ? "active"
              : "text-danger"
          }`}
        >
          {link.label}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}

