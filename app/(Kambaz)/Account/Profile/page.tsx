"use client";
import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import Link from "next/link";
import { Button, FormControl, FormSelect } from "react-bootstrap";
import * as client from "../client";
export default function Profile() {
 const [profile, setProfile] = useState<any>({});
 const dispatch = useDispatch();
 const { currentUser } = useSelector((state: RootState) => state.accountReducer);
 const fetchProfile = () => {
   if (!currentUser) return redirect("/Account/Signin");
   setProfile(currentUser);
 };
 const signout = async () => {
   await client.signout();
   dispatch(setCurrentUser(null));
   redirect("/Account/Signin");
 };
 useEffect(() => {
   fetchProfile();
 }, []);
 const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };


  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
       {profile && (
       <div>
              <FormControl id="wd-username"
                     className="mb-2 wd-account-width"
                     defaultValue={profile.username}
                     onChange={(e) => setProfile({ ...profile, username: e.target.value }) }/>
              <FormControl id="wd-password"
                     type="password"
                     className="mb-2 wd-account-width"
                     defaultValue={profile.password}
                     onChange={(e) => setProfile({ ...profile, password: e.target.value }) }/>
              <FormControl id="wd-firstname"
                     className="mb-2 wd-account-width"
                     defaultValue={profile.firstName}
                     onChange={(e) => setProfile({ ...profile, firstName: e.target.value }) }/>
              <FormControl id="wd-lastname"
                     className="mb-2 wd-account-width"
                     defaultValue={profile.lastName}
                     onChange={(e) => setProfile({ ...profile, lastName: e.target.value }) }/>
              <FormControl id="wd-dob"
                     type="date"
                     className="mb-2 wd-account-width"
                     value={profile.dob ? profile.dob.substring(0, 10) : ""}
                     defaultValue={profile.dob}
                     onChange={(e) => setProfile({ ...profile, dob: e.target.value })}/>
              <FormControl id="wd-email"
                     type="email"
                     className="mb-2 wd-account-width"
                      defaultValue={profile.email}
                     onChange={(e) => setProfile({ ...profile, email: e.target.value })}/>
              <FormSelect id="wd-role" className="mb-2 wd-account-width"
                     value={profile.role}
                     onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="STUDENT">Student</option>
                     </FormSelect>
              <div className="wd-account-width">
                     <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
                     <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
                     Sign out
                     </Button>
              </div>

              </div>
       )}
       
    </div>
);}
