"use client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
 const dispatch = useDispatch();
 const signin = () => {
   const user = db.users.find(
     (u: any) =>
       u.username === credentials.username &&
       u.password === credentials.password
   );
   if (!user) return;
   dispatch(setCurrentUser(user));
   redirect("/Dashboard");
 };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl defaultValue={credentials.username}
             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            id="wd-username"
             placeholder="username"
             className="mb-2 wd-account-width"/>
      <FormControl defaultValue={credentials.password}
             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            id="wd-password"
             placeholder="password" type="password"
             className="mb-2 wd-account-width"/>
      <div className="wd-account-width">
      <Button onClick={signin}
            id="wd-signin-btn"
            className="btn btn-primary w-100 mb-2">
            Sign in </Button></div><br />
      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
    </div> );}
