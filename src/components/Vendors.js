import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Vendors.css";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

function Vendors() {
  const [vendorName, setVendorName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] =useState(1);

  const API_URL = "http://localhost:8080/api/vendors";
  useEffect(() => {
  loadVendors();
}, []);

const loadVendors = async () => {
  try {
    const result = await axios.get(API_URL);
    setVendors(result.data);
  } catch (error) {
    console.error(error);
  }
};
const filteredVendors = vendors.filter((vendor) => {

  return (
    vendor.vendorName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    vendor.contactPerson
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    vendor.phone
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    vendor.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

});
const recordsPerPage = 5;

const lastIndex =
currentPage * recordsPerPage;

const firstIndex =
lastIndex - recordsPerPage;

const currentVendors =
filteredVendors.slice(
  firstIndex,
  lastIndex
);

const totalPages =
Math.ceil(
  filteredVendors.length /
  recordsPerPage
);
const handleAddVendor = async () => {

  if (
    !vendorName ||
    !contactPerson ||
    !phone ||
    !email
  ) {
    alert("Please fill all fields");
    return;
  }

  const vendor = {
    vendorName,
    contactPerson,
    phone,
    email
  };

  try {

    if(editId){

  await axios.put(
    `${API_URL}/${editId}`,
    vendor
  );

  alert("Vendor Updated Successfully");

}else{

  await axios.post(
    API_URL,
    vendor
  );

  alert("Vendor Added Successfully");
}

    alert("Vendor Added Successfully");

    loadVendors();

    setVendorName("");
    setContactPerson("");
    setPhone("");
    setEmail("");
    setEditId(null);

  } catch (error) {

    console.error(error);
    alert("Failed to add vendor");

  }
};

const handleEdit = (vendor) => {

  setEditId(vendor.vendorId);

  setVendorName(vendor.vendorName);
  setContactPerson(vendor.contactPerson);
  setPhone(vendor.phone);
  setEmail(vendor.email);
};

const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete this vendor?"
    );

  if(!confirmDelete) return;

  try{

    await axios.delete(
      `${API_URL}/${id}`
    );

    loadVendors();

    alert("Vendor Deleted");

  }catch(error){

    console.error(error);

  }
};

  return (
    <div className="vendors-page">

      <div className="vendors-header">
        <h2>Vendor Management</h2>

        <button className="add-vendor-btn" onClick={handleAddVendor}>
          <FaPlus /> {editId ? " Update Vendor" : " Add Vendor"}
        </button>
      </div>
      <div className="vendor-form">

  <input
    type="text"
    placeholder="Vendor Name"
    value={vendorName}
    onChange={(e) =>
      setVendorName(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Contact Person"
    value={contactPerson}
    onChange={(e) =>
      setContactPerson(e.target.value)
    }
  />

  <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) =>
      setPhone(e.target.value)
    }
  />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
  />

</div>
      <div className="search-area">

        <div className="vendor-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search vendor by name, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      <div className="vendor-table-container">

        <table>

          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Vendor Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
<tbody>

{currentVendors.map((vendor) => (

<tr key={vendor.vendorId}>

  <td>{vendor.vendorId}</td>
  <td>{vendor.vendorName}</td>
  <td>{vendor.contactPerson}</td>
  <td>{vendor.phone}</td>
  <td>{vendor.email}</td>

  <td>

    <button className="edit-btn" onClick={() => handleEdit(vendor)}>
      <FaEdit /> 
    </button>

    <button className="delete-btn" onClick={() =>
    handleDelete(vendor.vendorId)
  }>
      <FaTrash />
    </button>

  </td>

</tr>

))}

</tbody>

        </table>

      </div>

      <div className="vendor-pagination">

  <span>
    Showing {firstIndex + 1} to{" "}
    {Math.min(
      lastIndex,
      filteredVendors.length
    )}
    {" "}of {filteredVendors.length}
    entries
  </span>

  <div className="page-buttons">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage(
          currentPage - 1
        )
      }
    >
      Prev
    </button>

    {[...Array(totalPages)].map(
      (_, index) => (

      <button
        key={index + 1}
        className={
          currentPage === index + 1
          ? "active"
          : ""
        }
        onClick={() =>
          setCurrentPage(
            index + 1
          )
        }
      >
        {index + 1}
      </button>

    ))}

    <button
      disabled={
        currentPage === totalPages
      }
      onClick={() =>
        setCurrentPage(
          currentPage + 1
        )
      }
    >
      Next
    </button>

  </div>

</div>

    </div>
  );
}

export default Vendors;