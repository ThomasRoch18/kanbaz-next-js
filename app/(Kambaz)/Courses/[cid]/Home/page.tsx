import Modules from "../Modules/page";
import CourseStatus from "./tatus";
export default function Home() {
 return (
   <div id="wd-home">
     <table>
       <tbody>
         <tr>
           <td valign="top" width="70%"> <Modules /> </td>
           <td valign="top"> <CourseStatus /> </td>
         </tr>
       </tbody>
     </table>
   </div>
);}
