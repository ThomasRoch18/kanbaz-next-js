export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label><br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
          </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
                <select id="wd-group">
                    <option>ASSIGNMENTS</option>
                    <option>QUIZZES</option>
                    <option>EXAMS</option>
                    <option>PROJECTS</option>
                </select>
            </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="wd-display-grade-as">Display Grade As</label>
            </td>
            <td>
                <select id="wd-display-grade-as">
                    <option>Percentage</option>
                    <option>Points</option>
                </select>
            </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
                <select id="wd-submission-type">
                    <option>Online</option>
                </select>
            </td>
        </tr><br />
        <tr>
            <td></td>
            <td align="left" valign="top">
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
            </td>
        </tr><br />
        <tr>
            <td></td>
            <td align="left" valign="top">
                <label htmlFor="wd-assign-to">Assign to</label><br />
                <input id="wd-assign-to" defaultValue={"Everyone"} />
            </td>
        </tr>
        <tr>
            <td></td>
            <td align="left" valign="top">
                <label htmlFor="wd-due-date">Due</label><br />
                <input type="date" defaultValue="2025-05-13" id="wd-due-date"/>
            </td>
        </tr><br />
        <tr>
            <td></td>
            <td align="left" valign="top">
                <label htmlFor="wd-available-from">Available From</label>
            </td>
            <td>
                <label htmlFor="wd-available-to">Until</label>
            </td>
        </tr>
        <tr>
            <td></td>
            <td align="left" valign="top">
                <input type="date" defaultValue="2025-05-06" id="wd-available-from"/>
            </td>
            <td>
                <input type="date" defaultValue="2025-05-13" id="wd-available-to"/>
            </td>
        </tr>
      </table>
    </div>
);}
