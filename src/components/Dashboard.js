//import React from "react";

import React, {
  useEffect,
  useState
} from "react";
import ShipmentChart from "../components/ShipmentChart";
import axios from "axios";

import "../css/Dashboard.css";
import { Link ,useNavigate} from "react-router-dom";
import {
  FaTachometerAlt,
  FaPills,
  FaTruck,
  FaClipboardList,
  FaBell,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

function Dashboard() {
  const [dashboardData,setDashboardData] = useState({});
  const navigate = useNavigate();
  const [showProfile,setShowProfile] = useState(false);
  const user =JSON.parse(localStorage.getItem("user"));
  const [recentOrders,setRecentOrders] = useState([]);
  useEffect(() => {

    loadDashboard();

  }, []);
const loadDashboard = async () => {

    const result =
      await axios.get(
        "http://localhost:8080/api/dashboard"
      );

    setDashboardData(result.data);
    setRecentOrders(result.data.recentOrders);
  };
  const handleLogout = () => {

  localStorage.removeItem("user");

  navigate("/");
};
  return (
    <div className="dashboard">

      <div className="sidebar">
        <div className="logo">
          Drug Inventory System
        </div>

        <ul>

  <li>
    <Link to="/dashboard">
      <FaTachometerAlt /> Dashboard
    </Link>
  </li>

  <li>
    <Link to="/drugs">
      <FaPills /> Drugs
    </Link>
  </li>

  <li>
    <Link to="/vendors">
      <FaUsers /> Vendors
    </Link>
  </li>

  <li>
    <Link to="/supply-orders">
      <FaClipboardList /> Supply Orders
    </Link>
  </li>

  <li>
    <Link to="/shipments">
      <FaTruck /> Shipments
    </Link>
  </li>
  <li>
  <Link to="/drug-requests">
    <FaClipboardList /> Drug Requests
  </Link>
</li>
  <li>
    <Link to="/alerts">
      <FaBell /> Alerts
    </Link>
  </li>
  
  <li>
    <Link to="/reports">
      <FaFileAlt /> Reports
    </Link>
  </li>

  <li>
    <Link to="/users">
      <FaUsers /> Users
    </Link>
  </li>

  <li>
    <Link to="/settings">
      <FaCog /> Settings
    </Link>
  </li>

</ul>
        <Link to="/" className="logout">
  <FaSignOutAlt /> Logout
</Link>
      </div>

      <div className="main-content">

        <div className="header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back, Admin User!</p>
          </div>

          <div
  className="profile"
  onClick={() =>
    setShowProfile(!showProfile)
  }
>
  <div className="avatar">
    {user?.username?.charAt(0).toUpperCase()}
  </div>

  {user?.username}
</div>

{showProfile && (

<div className="profile-card">

  <h3>{user?.username}</h3>

  <p>
    <strong>Email:</strong>
    {" "}
    {user?.email}
  </p>

  <p>
    <strong>Phone:</strong>
    {" "}
    {user?.phone}
  </p>

  <p>
    <strong>Role:</strong>
    {" "}
    {user?.role}
  </p>

  <button
    onClick={handleLogout}
  >
    Logout
  </button>

</div>

)}
        </div>

        <div className="cards">

          <div className="card blue">
            <h4>Total Drugs</h4>
            <h2>{dashboardData.totalDrugs}</h2>
          </div>

          <div className="card green">
            <h4>Available Stock</h4>
            <h2>{dashboardData.availableStock}</h2>
          </div>

          <div className="card yellow">
            <h4>Low Stock Alerts</h4>
            <h2>{dashboardData.lowStock}</h2>
          </div>

          <div className="card purple">
            <h4>Shipments Pending</h4>
            <h2>{dashboardData.pendingShipments}</h2>
          </div>

        </div>

        <div className="table-section">

          <div className="table-card">
            <h3>Recent Supply Orders</h3>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vendor</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

{recentOrders.map((order) => (

<tr key={order.orderId}>

  <td>
    {order.orderId}
  </td>

  <td>
    {order.vendor}
  </td>

  <td>
    {order.status}
  </td>

</tr>

))}

</tbody>
            </table>

          </div>

        <div className="table-card">

  <ShipmentChart
    delivered={
      dashboardData.deliveredShipments || 0
    }
    pending={
      dashboardData.pendingShipments || 0
    }
  />

</div> 
  

  

    

    

  

          </div>

        </div>

      </div>

   
  );
}

export default Dashboard;