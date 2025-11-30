"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PeopleTable from "./Table/page";
import * as client from "../../client";

export default function People() {
const [users, setUsers] = useState<any[]>([]);
 const { cid } = useParams();
const fetchUsers = async () => {
   const users = await client.findUsersForCourse(cid as string);
   setUsers(users);
 };
 useEffect(() => {
   fetchUsers();
 }, [cid]);
  return (
    <div>
      <h2>People</h2>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
);}