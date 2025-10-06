import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <FormControl id="wd-username"
             defaultValue="alice"
             placeholder="Username"
             className="mb-2 wd-account-width"/>
      <FormControl id="wd-password"
             defaultValue="123"
             placeholder="password"
             type="password"
             className="mb-2 wd-account-width"/>
      <FormControl id="wd-firstname"
             defaultValue="Alice"
             placeholder="First Name"
             className="mb-2 wd-account-width"/>
      <FormControl id="wd-lastname"
             defaultValue="Wonderland"
             placeholder="Last Name"
             className="mb-2 wd-account-width"/>
      <FormControl id="wd-dob"
             defaultValue="2000-01-01"
             type="date"
             className="mb-2 wd-account-width"/>
      <FormControl id="wd-email"
             defaultValue="alice@wonderland"
             type="email"
             className="mb-2 wd-account-width"/>
      <FormSelect id="wd-role" className="mb-2 wd-account-width">
                <option value="0" defaultChecked>User</option>
                <option value="1">Admin</option>
                <option value="2">Faculty</option>
                <option value="3">Student</option>
            </FormSelect>
      <div className="wd-account-width">
      <Link href="Signin" className="btn btn-danger w-100 mb-2"> Sign out </Link>
      </div>
    </div>
);}
