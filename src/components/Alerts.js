import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Alerts.css";

import {
  FaSearch,
  FaEye,
  FaTrash
} from "react-icons/fa";

function Alerts() {

  const API_URL =
    "http://localhost:8080/api/alerts";

  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {

      const result =
        await axios.get(API_URL);

      setAlerts(result.data);

    } catch (error) {

      console.error(error);

    }
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this alert?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/${id}`
      );

      loadAlerts();

    } catch (error) {

      console.error(error);

    }
  };

  const filteredAlerts =
    alerts.filter(
      (alert) =>
        alert.alertType
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        alert.drugName
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  const recordsPerPage = 5;

  const lastIndex =
    currentPage * recordsPerPage;

  const firstIndex =
    lastIndex - recordsPerPage;

  const currentAlerts =
    filteredAlerts.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filteredAlerts.length /
      recordsPerPage
    );

  const getPriorityClass =
    (priority) => {

      switch (priority) {

        case "Critical":
          return "critical";

        case "High":
          return "high";

        case "Medium":
          return "medium";

        default:
          return "low";
      }
    };

  return (

    <div className="alerts-page">

      <div className="page-header">
        <h2>
          Alerts & Notifications
        </h2>
      </div>

      <div className="search-box">

        <FaSearch />

        <input
          type="text"
          placeholder="Search alerts..."
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

              <th>Alert ID</th>
              <th>Type</th>
              <th>Drug</th>
              <th>Message</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {currentAlerts.map(
              (alert) => (

                <tr
                  key={alert.alertId}
                >

                  <td>
                    {alert.alertId}
                  </td>

                  <td>
                    {alert.alertType}
                  </td>

                  <td>
                    {alert.drugName}
                  </td>

                  <td>
                    {alert.message}
                  </td>

                  <td>
                    {alert.alertDate}
                  </td>

                  <td>

                    <span
                      className={`priority ${getPriorityClass(
                        alert.priority
                      )}`}
                    >

                      {alert.priority}

                    </span>

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        window.alert(
                          JSON.stringify(
                            alert,
                            null,
                            2
                          )
                        )
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          alert.alertId
                        )
                      }
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              )
            )}

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
            filteredAlerts.length
          )}

          {" "}of{" "}

          {filteredAlerts.length}

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

export default Alerts;