
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SupplyOrders.css";

import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye
} from "react-icons/fa";

function SupplyOrders() {
  

  const API_URL = "http://localhost:8080/api/orders";

  const [orders, setOrders] = useState([]);

  const [vendor, setVendor] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("");

  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await axios.get(API_URL);
      setOrders(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOrder = async () => {

    if (
      !vendor ||
      !orderDate ||
      !totalAmount ||
      !status
    ) {
      alert("Please fill all fields");
      return;
    }

    const order = {
      vendor,
      orderDate,
      totalAmount,
      status
    };

    try {

      if (editId) {

        await axios.put(
          `${API_URL}/${editId}`,
          order
        );

        alert("Order Updated Successfully");

      } else {

        await axios.post(
          API_URL,
          order
        );

        alert("Order Added Successfully");
      }

      setVendor("");
      setOrderDate("");
      setTotalAmount("");
      setStatus("");
      setEditId(null);

      loadOrders();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (order) => {

    setEditId(order.orderId);

    setVendor(order.vendor);
    setOrderDate(order.orderDate);
    setTotalAmount(order.totalAmount);
    setStatus(order.status);
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this order?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/${id}`
      );

      loadOrders();

    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = orders.filter((order) => {

  const matchesSearch =
    order.vendor
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    order.orderId
      ?.toString()
      .includes(searchTerm);

  const matchesStatus =
    selectedStatus === "" ||

    order.status
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

  const currentOrders =
    filteredOrders.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filteredOrders.length /
      recordsPerPage
    );

  const getStatusClass = (status) => {

    if (
      status === "Delivered" ||
      status === "Confirmed"
    )
      return "green";

    if (status === "In Transit")
      return "blue";

    return "red";
  };

  return (

    <div className="orders-page">

      <div className="orders-header">

        <h2>Supply Orders</h2>

        <button
          className="add-btn"
          onClick={handleAddOrder}
        >
          <FaPlus />
          {editId
            ? " Update Order"
            : " Create New Order"}
        </button>

      </div>

      <div className="order-form">

        <input
          type="text"
          placeholder="Vendor"
          value={vendor}
          onChange={(e) =>
            setVendor(e.target.value)
          }
        />

        <input
          type="date"
          value={orderDate}
          onChange={(e) =>
            setOrderDate(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Total Amount"
          value={totalAmount}
          onChange={(e) =>
            setTotalAmount(
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
      placeholder="Search Vendor or Order ID..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />

  </div>

  <select
    className="status-filter"
    value={selectedStatus}
    onChange={(e) => {
      setSelectedStatus(e.target.value);
      setCurrentPage(1);
    }}
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

      <table>

        <thead>

          <tr>

            <th>Order ID</th>
            <th>Vendor</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {currentOrders.map(
            (order) => (

            <tr
              key={order.orderId}
            >

              <td>
                {order.orderId}
              </td>

              <td>
                {order.vendor}
              </td>

              <td>
                {order.orderDate}
              </td>

              <td>
                ₹{order.totalAmount}
              </td>

              <td>

                <span
                  className={
                    getStatusClass(
                      order.status
                    )
                  }
                >
                  {order.status}
                </span>

              </td>

              <td>

                <button
                  className="view-btn"
                  onClick={() =>
                    alert(
                      JSON.stringify(
                        order,
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
                    handleEdit(order)
                  }
                >
                  <FaEdit />
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      order.orderId
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

      <div className="pagination">

        <span>

          Showing

          {" "}
          {firstIndex + 1}

          {" "}to{" "}

          {Math.min(
            lastIndex,
            filteredOrders.length
          )}

          {" "}of{" "}

          {filteredOrders.length}

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

export default SupplyOrders;