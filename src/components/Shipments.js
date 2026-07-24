
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Shipments.css";

import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus
} from "react-icons/fa";

function Shipments() {

  const API_URL = "http://localhost:8080/api/shipments";

  const [shipments, setShipments] = useState([]);

  const [shipmentId, setShipmentId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [shipmentDate, setShipmentDate] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [status, setStatus] = useState("");

  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const result = await axios.get(API_URL);
      setShipments(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddShipment = async () => {

    if (
      !orderId ||
      !shipmentDate ||
      !expectedDelivery ||
      !status
    ) {
      alert("Please fill all fields");
      return;
    }

    const shipment = {
      orderId,
      shipmentDate,
      expectedDelivery,
      status
    };

    try {

      if (editId) {

        await axios.put(
          `${API_URL}/${editId}`,
          shipment
        );

        alert("Shipment Updated Successfully");

      } else {

        await axios.post(
          API_URL,
          shipment
        );

        alert("Shipment Added Successfully");
      }

      setShipmentId("");
      setOrderId("");
      setShipmentDate("");
      setExpectedDelivery("");
      setStatus("");
      setEditId(null);

      loadShipments();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (shipment) => {

    setEditId(shipment.shipmentId);

    setOrderId(shipment.orderId);
    setShipmentDate(shipment.shipmentDate);
    setExpectedDelivery(
      shipment.expectedDelivery
    );
    setStatus(shipment.status);
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this shipment?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/${id}`
      );

      loadShipments();

    } catch (error) {
      console.error(error);
    }
  };

  const filteredShipments = shipments.filter((shipment) => {

  const matchesSearch =
    shipment.orderId
      ?.toString()
      .includes(searchTerm) ||

    shipment.shipmentId
      ?.toString()
      .includes(searchTerm);

  const matchesStatus =
    selectedStatus === "" ||

    shipment.status
      ?.trim()
      .toLowerCase() ===

    selectedStatus
      .trim()
      .toLowerCase();

  return matchesSearch && matchesStatus;
});

  const recordsPerPage = 5;

  const lastIndex =
    currentPage * recordsPerPage;

  const firstIndex =
    lastIndex - recordsPerPage;

  const currentShipments =
    filteredShipments.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filteredShipments.length /
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

    if (status === "Pending")
      return "pending";

    return "cancelled";
  };

  return (

    <div className="shipments-page">

      <div className="page-header">

        <h2>Shipment Tracking</h2>

        <button
          className="add-btn"
          onClick={handleAddShipment}
        >
          <FaPlus />

          {editId
            ? " Update Shipment"
            : " Add Shipment"}
        </button>

      </div>

      <div className="shipment-form">

        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) =>
            setOrderId(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={shipmentDate}
          onChange={(e) =>
            setShipmentDate(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={expectedDelivery}
          onChange={(e) =>
            setExpectedDelivery(
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

     <div className="search-section">

  <div className="search-box">
    <FaSearch />

    <input
      type="text"
      placeholder="Search Shipment ID or Order ID..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />
  </div>

  <select
    className="status-filter"
    value={selectedStatus}
    onChange={(e) =>
      setSelectedStatus(e.target.value)
    }
  >
    <option value="">
      All Status
    </option>

    <option value="Delivered">
      Delivered
    </option>

    <option value="In Transit">
      In Transit
    </option>

    <option value="Pending">
      Pending
    </option>

    <option value="Confirmed">
      Confirmed
    </option>

    <option value="Cancelled">
      Cancelled
    </option>

  </select>

</div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Shipment ID</th>
              <th>Order ID</th>
              <th>Shipment Date</th>
              <th>Expected Delivery</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {currentShipments.map(
              (shipment) => (

              <tr
                key={
                  shipment.shipmentId
                }
              >

                <td>
                  {shipment.shipmentId}
                </td>

                <td>
                  {shipment.orderId}
                </td>

                <td>
                  {shipment.shipmentDate}
                </td>

                <td>
                  {
                    shipment.expectedDelivery
                  }
                </td>

                <td>

                  <span
                    className={`status ${getStatusClass(
                      shipment.status
                    )}`}
                  >
                    {shipment.status}
                  </span>

                </td>

                <td>

                  <button
                    className="view-btn"
                    onClick={() =>
                      alert(
                        JSON.stringify(
                          shipment,
                          null,
                          2
                        )
                      )
                    }
                  >
                    <FaEye />
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(
                        shipment
                      )
                    }
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        shipment.shipmentId
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

          {
            filteredShipments.length === 0
              ? 0
              : firstIndex + 1
          }

          {" "}to{" "}

          {Math.min(
            lastIndex,
            filteredShipments.length
          )}

          {" "}of{" "}

          {filteredShipments.length}

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

export default Shipments;