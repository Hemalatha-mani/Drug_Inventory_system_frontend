import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Users.css";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch
} from "react-icons/fa";

function Users() {

  const API_URL =
    "http://localhost:8080/api/users";

  const [users,setUsers] = useState([]);

  const [fullName,setFullName] =
    useState("");

  const [email,setEmail] =
    useState("");

  const [phone,setPhone] =
    useState("");

  const [role,setRole] =
    useState("");

  const [username,setUsername] =
    useState("");

  const [password,setPassword] =
    useState("");

  const [status,setStatus] =
    useState("");

  const [editId,setEditId] =
    useState(null);

  const [searchTerm,setSearchTerm] =
    useState("");

  const [selectedRole,setSelectedRole] =
    useState("");

  const [selectedStatus,setSelectedStatus] =
    useState("");

  const [currentPage,setCurrentPage] =
    useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      const result =
        await axios.get(API_URL);

      setUsers(result.data);

    } catch(error) {

      console.error(error);

    }
  };

  const handleAddUser = async () => {

    if(
      !fullName ||
      !email ||
      !phone ||
      !role ||
      !username ||
      !password ||
      !status
    ){
      alert("Fill all fields");
      return;
    }

    const user = {

      fullName,
      email,
      phone,
      role,
      username,
      password,
      status

    };

    try {

      if(editId){

        await axios.put(
          `${API_URL}/${editId}`,
          user
        );

        alert("User Updated");

      }else{

        await axios.post(
          API_URL,
          user
        );

        alert("User Added");

      }

      clearForm();

      loadUsers();

    } catch(error){

      console.error(error);

    }
  };

  const clearForm = () => {

    setFullName("");
    setEmail("");
    setPhone("");
    setRole("");
    setUsername("");
    setPassword("");
    setStatus("");
    setEditId(null);

  };

  const handleEdit = (user) => {

    setEditId(user.userId);

    setFullName(user.fullName);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
    setUsername(user.username);
    setPassword(user.password);
    setStatus(user.status);

  };

  const handleDelete = async(id) => {

    if(
      !window.confirm(
        "Delete this user?"
      )
    ) return;

    try {

      await axios.delete(
        `${API_URL}/${id}`
      );

      loadUsers();

    } catch(error){

      console.error(error);

    }
  };

  const filteredUsers =
    users.filter((user)=>{

      const searchMatch =

        user.fullName
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

        ||

        user.email
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

      const roleMatch =

        selectedRole === ""
        ||

        user.role === selectedRole;

      const statusMatch =

        selectedStatus === ""
        ||

        user.status === selectedStatus;

      return (
        searchMatch &&
        roleMatch &&
        statusMatch
      );

    });

  const recordsPerPage = 5;

  const lastIndex =
    currentPage * recordsPerPage;

  const firstIndex =
    lastIndex - recordsPerPage;

  const currentUsers =
    filteredUsers.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filteredUsers.length /
      recordsPerPage
    );

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      u => u.status==="Active"
    ).length;

  const inactiveUsers =
    users.filter(
      u => u.status==="Inactive"
    ).length;

  const admins =
    users.filter(
      u => u.role==="Admin"
    ).length;

  return (

<div className="users-page">

<h2>User Management</h2>

<div className="user-cards">

<div className="card">
<h3>{totalUsers}</h3>
<p>Total Users</p>
</div>

<div className="card">
<h3>{activeUsers}</h3>
<p>Active Users</p>
</div>

<div className="card">
<h3>{inactiveUsers}</h3>
<p>Inactive Users</p>
</div>

<div className="card">
<h3>{admins}</h3>
<p>Admins</p>
</div>

</div>

<div className="user-form">

<input
type="text"
placeholder="Full Name"
value={fullName}
onChange={(e)=>
setFullName(e.target.value)}
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>
setEmail(e.target.value)}
/>

<input
type="text"
placeholder="Phone"
value={phone}
onChange={(e)=>
setPhone(e.target.value)}
/>

<select
value={role}
onChange={(e)=>
setRole(e.target.value)}
>
<option value="">
Role
</option>

<option>
Admin
</option>

<option>
Pharmacist
</option>

<option>
Store Manager
</option>

<option>
Staff
</option>

</select>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>
setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>
setPassword(e.target.value)}
/>

<select
value={status}
onChange={(e)=>
setStatus(e.target.value)}
>
<option value="">
Status
</option>

<option>
Active
</option>

<option>
Inactive
</option>

</select>

<button
className="add-btn"
onClick={handleAddUser}
>
<FaPlus />

{editId
? " Update User"
: " Add User"}
</button>

</div>

<div className="search-section">

<div className="search-box">

<FaSearch />

<input
type="text"
placeholder="Search User"
value={searchTerm}
onChange={(e)=>
setSearchTerm(e.target.value)}
/>

</div>

<select
value={selectedRole}
onChange={(e)=>
setSelectedRole(e.target.value)}
>
<option value="">
All Roles
</option>

<option>
Admin
</option>

<option>
Pharmacist
</option>

<option>
Store Manager
</option>

<option>
Staff
</option>

</select>

<select
value={selectedStatus}
onChange={(e)=>
setSelectedStatus(e.target.value)}
>
<option value="">
All Status
</option>

<option>
Active
</option>

<option>
Inactive
</option>

</select>

</div>

<div className="table-container">

<table>

<thead>

<tr>

<th>ID</th>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Role</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{currentUsers.map((user)=>(

<tr key={user.userId}>

<td>{user.userId}</td>

<td>{user.fullName}</td>

<td>{user.email}</td>

<td>{user.phone}</td>

<td>{user.role}</td>

<td>

<span
className={
user.status==="Active"
? "active-badge"
: "inactive-badge"
}
>
{user.status}
</span>

</td>

<td>

<button
className="view-btn"
onClick={() =>
window.alert(
JSON.stringify(
user,
null,
2
)
)}
>
<FaEye />
</button>

<button
className="edit-btn"
onClick={() =>
handleEdit(user)}
>
<FaEdit />
</button>

<button
className="delete-btn"
onClick={() =>
handleDelete(
user.userId
)}
>
<FaTrash />
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

<div className="pagination">

<button
disabled={
currentPage===1
}
onClick={()=>
setCurrentPage(
currentPage-1
)}
>
Prev
</button>

{[...Array(totalPages)]
.map((_,index)=>(

<button
key={index+1}
className={
currentPage===index+1
? "active"
: ""
}
onClick={()=>
setCurrentPage(
index+1
)}
>
{index+1}
</button>

))}

<button
disabled={
currentPage===totalPages
}
onClick={()=>
setCurrentPage(
currentPage+1
)}
>
Next
</button>

</div>

</div>

  );
}

export default Users;