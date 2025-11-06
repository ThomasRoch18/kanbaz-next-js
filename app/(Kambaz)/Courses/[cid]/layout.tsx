"use client";

import { ReactNode, useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";
export default function CoursesLayout({ children }: { children: ReactNode }) {
 const { cid }  = useParams();
 const { courses } = useSelector((state: RootState) => state.coursesReducer);
 const course = courses.find((course: any) => course._id === cid);

 const [showNav, setShowNav] = useState(true);

 return (
   <div id="wd-courses">
    <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" 
        role="button"
          onClick={() => setShowNav(!showNav)}/>
        {course?.name}</h2> <hr/>
    
    <div className="d-flex">
      <div className={showNav ? "d-block" : "d-none"}>
        <CourseNavigation params={{cid: Array.isArray(cid) ? cid[0] : cid ?? ""}} />
      
      </div>
      <div className="flex-fill">
        {children}
      </div></div>
  </div>

);}
