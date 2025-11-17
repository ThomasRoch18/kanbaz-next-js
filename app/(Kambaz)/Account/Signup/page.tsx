"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState<any>({});
  const dispatch = useDispatch();
  const signup = async () => {
  const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    redirect("/Profile");
  };

  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      <FormControl id="wd-username"
             value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
             className="wd-username b-2 mb-2 wd-account-width" placeholder="username"/>
      <FormControl id="wd-password"
             value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
             className="wd-password mb-2 wd-account-width" placeholder="password" type="password"/>
      {/* <FormControl id="wd-verify-password"
             placeholder="verify password" type="password"
             className="mb-2 wd-account-width"/> */}
      <div className="wd-account-width">
      <button id="wd-signin-btn"
            onClick={signup}
            className="btn btn-primary w-100 mb-2">
            Sign up </button></div><br />
      <Link  href="Signin" > Sign in </Link>
    </div>
);}
