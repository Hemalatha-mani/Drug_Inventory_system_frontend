// import React from "react";
// import "../css/DrugRequests.css";
// import {
//  FaSearch,
//  FaPlus,
//  FaEye
// } from "react-icons/fa";

// function DrugRequests() {
//  return (
//   <div className="request-page">

//    <div className="request-header">

//     <h2>Drug Request Management</h2>

//     <button className="new-request-btn">
//       <FaPlus /> New Request
//     </button>

//    </div>

//    <div className="request-search">

//       <FaSearch />

//       <input
//        type="text"
//        placeholder="Search request by hospital or drug..."
//       />

//    </div>

//    <div className="request-table">

//     <table>

//      <thead>
//       <tr>
//        <th>Request ID</th>
//        <th>Hospital</th>
//        <th>Drug</th>
//        <th>Requested Qty</th>
//        <th>Request Date</th>
//        <th>Status</th>
//        <th>Action</th>
//       </tr>
//      </thead>

//      <tbody>

//       <tr>
//        <td>REQ1001</td>
//        <td>City Hospital</td>
//        <td>Paracetamol</td>
//        <td>500</td>
//        <td>21-May-2024</td>
//        <td>
//         <span className="approved">
//           Approved
//         </span>
//        </td>
//        <td>
//         <button className="view-btn">
//          <FaEye />
//         </button>
//        </td>
//       </tr>

//       <tr>
//        <td>REQ1002</td>
//        <td>Green Valley Clinic</td>
//        <td>Amoxicillin</td>
//        <td>300</td>
//        <td>21-May-2024</td>
//        <td>
//         <span className="pending">
//          Pending
//         </span>
//        </td>
//        <td>
//         <button className="view-btn">
//          <FaEye />
//         </button>
//        </td>
//       </tr>

//       <tr>
//        <td>REQ1003</td>
//        <td>Sunrise Hospital</td>
//        <td>Metformin</td>
//        <td>200</td>
//        <td>20-May-2024</td>
//        <td>
//         <span className="approved">
//          Approved
//         </span>
//        </td>
//        <td>
//         <button className="view-btn">
//          <FaEye />
//         </button>
//        </td>
//       </tr>

//       <tr>
//        <td>REQ1004</td>
//        <td>Life Care Hospital</td>
//        <td>Ibuprofen</td>
//        <td>150</td>
//        <td>20-May-2024</td>
//        <td>
//         <span className="dispatch">
//          Dispatched
//         </span>
//        </td>
//        <td>
//         <button className="view-btn">
//          <FaEye />
//         </button>
//        </td>
//       </tr>

//       <tr>
//        <td>REQ1005</td>
//        <td>Hope Medical Center</td>
//        <td>Azithromycin</td>
//        <td>100</td>
//        <td>19-May-2024</td>
//        <td>
//         <span className="pending">
//          Pending
//         </span>
//        </td>
//        <td>
//         <button className="view-btn">
//          <FaEye />
//         </button>
//        </td>
//       </tr>

//      </tbody>

//     </table>

//    </div>

//    <div className="pagination">

//     <span>
//       Showing 1 to 5 of 18 entries
//     </span>

//     <div>
//       <button>&lt;</button>
//       <button className="active">1</button>
//       <button>2</button>
//       <button>3</button>
//       <button>4</button>
//       <button>&gt;</button>
//     </div>

//    </div>

//   </div>
//  );
// }

// export default DrugRequests;
import React, { useState, useEffect } from "react";
import axios from "axios";

import "../css/DrugRequests.css";

import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";

function DrugRequests() {

  const API_URL =
    "http://localhost:8080/api/drugrequests";

  const [requests, setRequests] = useState([]);

  const [hospital, setHospital] = useState("");
  const [drug, setDrug] = useState("");
  const [requestedQty, setRequestedQty] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [status, setStatus] = useState("");

  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {

      const result =
        await axios.get(API_URL);

      setRequests(result.data);

    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRequest = async () => {

    if (
      !hospital ||
      !drug ||
      !requestedQty ||
      !requestedDate ||
      !status
    ) {
      alert("Fill all fields");
      return;
    }

    const request = {
      hospital,
      drug,
      requestedQty,
      requestedDate,
      status
    };

    try {

      if (editId) {

        await axios.put(
          `${API_URL}/${editId}`,
          request
        );

        alert("Updated Successfully");

      } else {

        await axios.post(
          API_URL,
          request
        );

        alert("Added Successfully");
      }

      setHospital("");
      setDrug("");
      setRequestedQty("");
      setRequestedDate("");
      setStatus("");
      setEditId(null);

      loadRequests();

    } catch (error) {

      console.error(error);
    }
  };

  const handleEdit = (request) => {

    setEditId(request.requestId);

    setHospital(request.hospital);
    setDrug(request.drug);
    setRequestedQty(request.requestedQty);
    setRequestedDate(request.requestedDate);
    setStatus(request.status);
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this request?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/${id}`
      );

      loadRequests();

    } catch (error) {

      console.error(error);
    }
  };

  const handleView = (request) => {

    alert(
      `Request ID : ${request.requestId}

Hospital : ${request.hospital}

Drug : ${request.drug}

Quantity : ${request.requestedQty}

Date : ${request.requestedDate}

Status : ${request.status}`
    );
  };

  const filteredRequests =
    requests.filter((request) =>

      request.hospital
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

      ||

      request.drug
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

      ||

      request.status
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const recordsPerPage = 5;

  const lastIndex =
    currentPage * recordsPerPage;

  const firstIndex =
    lastIndex - recordsPerPage;

  const currentRequests =
    filteredRequests.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filteredRequests.length /
      recordsPerPage
    );

  const getStatusClass = (status) => {

    if (
      status === "Delivered" ||
      status === "Confirmed"
    )
      return "delivered";

    if (status === "In Transit")
      return "transit";

    if (
      status === "Pending" ||
      status === "Cancelled"
    )
      return "pending";

    return "";
  };

  return (

    <div className="drugrequest-page">

      <div className="page-header">

        <h2>
          Drug Request Management
        </h2>

        <button
          className="add-btn"
          onClick={handleAddRequest}
        >
          <FaPlus />

          {editId
            ? " Update Request"
            : " Add Request"}
        </button>

      </div>

      <div className="request-form">

        <select
          value={hospital}
          onChange={(e) =>
            setHospital(e.target.value)
          }
        >

          <option value="">
            Select Hospital
          </option>

          <option>Apollo Hospital</option>
          <option>Fortis Hospital</option>
          <option>CMC Hospital</option>
          <option>Global Hospital</option>
          <option>MIOT Hospital</option>

        </select>

        <input
          type="text"
          placeholder="Drug Name"
          value={drug}
          onChange={(e) =>
            setDrug(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Requested Qty"
          value={requestedQty}
          onChange={(e) =>
            setRequestedQty(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={requestedDate}
          onChange={(e) =>
            setRequestedDate(
              e.target.value
            )
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >

          <option value="">
            Select Status
          </option>

          <option>
            Delivered
          </option>

          <option>
            In Transit
          </option>

          <option>
            Pending
          </option>

          <option>
            Confirmed
          </option>

          <option>
            Cancelled
          </option>

        </select>

      </div>

      <div className="search-box">

        <FaSearch />

        <input
          type="text"
          placeholder="Search Hospital, Drug, Status..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
        />

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Request ID</th>
              <th>Hospital</th>
              <th>Drug</th>
              <th>Requested Qty</th>
              <th>Requested Date</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {currentRequests.map(
              (request) => (

              <tr
                key={request.requestId}
              >

                <td>
                  {request.requestId}
                </td>

                <td>
                  {request.hospital}
                </td>

                <td>
                  {request.drug}
                </td>

                <td>
                  {request.requestedQty}
                </td>

                <td>
                  {request.requestedDate}
                </td>

                <td>

                  <span
                    className={`status ${getStatusClass(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() =>
                      handleView(
                        request
                      )
                    }
                  >
                    <FaEye />
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(
                        request
                      )
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        request.requestId
                      )
                    }
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

        <span>

          Showing

          {" "}
          {firstIndex + 1}

          {" "}to{" "}

          {Math.min(
            lastIndex,
            filteredRequests.length
          )}

          {" "}of{" "}

          {filteredRequests.length}

          {" "}entries

        </span>

        <div>

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Prev
          </button>

          {[...Array(totalPages)]
            .map((_, index) => (

            <button
              key={index + 1}
              className={
                currentPage ===
                index + 1
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
              currentPage ===
              totalPages
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

export default DrugRequests;