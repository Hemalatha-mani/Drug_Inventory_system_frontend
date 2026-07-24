//import React from "react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../css/Reports.css";
import { Pie, Bar } from "react-chartjs-2";

import {
 Chart as ChartJS,
 ArcElement,
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend
} from "chart.js";

ChartJS.register(
 ArcElement,
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend
);


function Reports() {
  const [inventoryData,setInventoryData] = useState([]);
  //const [shipmentData,setShipmentData] = useState([]);
  const [reportType, setReportType] = useState("inventory");
  const [vendorData, setVendorData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const loadReports = async () => {

  try {

    const inventory =
      await axios.get(
        "http://localhost:8080/api/reports/inventory"
      );

    // const shipment =
    //   await axios.get(
    //     "http://localhost:8080/api/reports/shipment-status"
    //   );

    const vendor =
      await axios.get(
        "http://localhost:8080/api/reports/vendor"
      );

    const monthly = await axios.get(
  `http://localhost:8080/api/reports/monthly?fromDate=${fromDate}&toDate=${toDate}`
);

    setInventoryData([
      {
        name: "Available",
        value: inventory.data.available
      },
      {
        name: "Low Stock",
        value: inventory.data.lowStock
      },
      {
        name: "Out Of Stock",
        value: inventory.data.outOfStock
      }
    ]);

    // setShipmentData([
    //   {
    //     status: "Delivered",
    //     count: shipment.data.Delivered
    //   },
    //   {
    //     status: "Pending",
    //     count: shipment.data.Pending
    //   },
    //   {
    //     status: "In Transit",
    //     count: shipment.data["In Transit"]
    //   }
    // ]);

    // ADD THESE TWO LINES
    setVendorData(vendor.data);
    setMonthlyData(monthly.data);

    console.log("Vendor Data:", vendor.data);
    console.log("Monthly Data:", monthly.data);

  } catch (error) {

    console.error(error);

  }
};
 // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(() => {

   loadReports();

 }, []);
//  const loadReports = async () => {

//   try {

//     const inventory =
//       await axios.get(
//         "http://localhost:8080/api/reports/inventory"
//       );

//     const shipment =
//       await axios.get(
//         "http://localhost:8080/api/reports/shipment-status"
//       );

//     const vendor =
//       await axios.get(
//         "http://localhost:8080/api/reports/vendor"
//       );

//     const monthly = await axios.get(
//   `http://localhost:8080/api/reports/monthly?fromDate=${fromDate}&toDate=${toDate}`
// );

//     setInventoryData([
//       {
//         name: "Available",
//         value: inventory.data.available
//       },
//       {
//         name: "Low Stock",
//         value: inventory.data.lowStock
//       },
//       {
//         name: "Out Of Stock",
//         value: inventory.data.outOfStock
//       }
//     ]);

//     setShipmentData([
//       {
//         status: "Delivered",
//         count: shipment.data.Delivered
//       },
//       {
//         status: "Pending",
//         count: shipment.data.Pending
//       },
//       {
//         status: "In Transit",
//         count: shipment.data["In Transit"]
//       }
//     ]);

//     // ADD THESE TWO LINES
//     setVendorData(vendor.data);
//     setMonthlyData(monthly.data);

//     console.log("Vendor Data:", vendor.data);
//     console.log("Monthly Data:", monthly.data);

//   } catch (error) {

//     console.error(error);

//   }
// };


 const pieData = {
  labels: inventoryData.map(item => item.name),

  datasets: [
    {
      data: inventoryData.map(item => item.value),

      backgroundColor: [
        "#4CAF50",
        "#FFC107",
        "#F44336"
      ]
    }
  ]
};

 
 
const vendorChartData = {
  labels: vendorData.map(item => item[0]),

  datasets: [
    {
      label: "Orders",

      data: vendorData.map(item => item[1]),

      backgroundColor: "#0b5fff"
    }
  ]
};



const monthNames = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
};
const monthlyChartData = {
  labels: monthlyData.map(
    item => monthNames[item[0]]
  ),

  datasets: [
    {
      label: "Shipments",

      data: monthlyData.map(
        item => item[1]
      ),

      backgroundColor: "#28a745"
    }
  ]
};


const generateReport = async () => {

  if (!fromDate || !toDate) {
    alert("Please select From Date and To Date");
    return;
  }

  try {

    const monthly = await axios.get(
      `http://localhost:8080/api/reports/monthly?fromDate=${fromDate}&toDate=${toDate}`
    );

    setMonthlyData(monthly.data);

  } catch(error) {

    console.error(error);

  }
};


const downloadPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Drug Inventory Report", 14, 20);

  if(reportType === "inventory"){

    autoTable(doc,{
      startY:30,
      head:[["Status","Count"]],
      body:[
        ["Available",inventoryData[0]?.value],
        ["Low Stock",inventoryData[1]?.value],
        ["Out Of Stock",inventoryData[2]?.value]
      ]
    });

  }

  if(reportType === "vendor"){

    autoTable(doc,{
      startY:30,
      head:[["Vendor","Orders","Amount"]],
      body: vendorData.map(item => [
        item[0],
        item[1],
        item[2]
      ])
    });

  }

  if(reportType === "monthly"){

    autoTable(doc,{
      startY:30,
      head:[["Month","Shipments"]],
      body: monthlyData.map(item => [
        monthNames[item[0]],
        item[1]
      ])
    });

  }

  doc.save(`${reportType}-report.pdf`);
};

 return (
  <div className="reports-page">

   <h2>Reports & Analytics</h2>

   <div className="report-top">

    <div className="report-types">

      <h4>Select Report Type</h4>

      <button
  className={
    reportType === "inventory"
      ? "active"
      : ""
  }
  onClick={() =>
    setReportType("inventory")
  }
>
  Inventory Report
</button>



<button
  className={
    reportType === "vendor"
      ? "active"
      : ""
  }
  onClick={() =>
    setReportType("vendor")
  }
>
  Vendor Performance Report
</button>

<button
  className={
    reportType === "monthly"
      ? "active"
      : ""
  }
  onClick={() =>
    setReportType("monthly")
  }
>
  Monthly Distribution Report
</button>
    </div>

    <div className="report-content">

      <div className="filters">

       <input
  type="date"
  value={fromDate}
  onChange={(e) => setFromDate(e.target.value)}
/>

<input
  type="date"
  value={toDate}
  onChange={(e) => setToDate(e.target.value)}
/>

        <button className="generate-btn" onClick={generateReport}>
          Generate Report
        </button>

        <button className="pdf-btn" onClick={downloadPDF}>
          Download PDF
        </button>

      </div>

      <div className="charts">

{/* INVENTORY REPORT */}

{reportType === "inventory" && (

<div className="report-section">

<div className="chart-card">

<h3>Inventory Stock Summary</h3>

<Pie data={pieData} />

</div>

<div className="report-table">

<table>

<thead>
<tr>
<th>Status</th>
<th>Count</th>
</tr>
</thead>

<tbody>

<tr>
<td>Available</td>
<td>{inventoryData[0]?.value}</td>
</tr>

<tr>
<td>Low Stock</td>
<td>{inventoryData[1]?.value}</td>
</tr>

<tr>
<td>Out Of Stock</td>
<td>{inventoryData[2]?.value}</td>
</tr>

</tbody>

</table>

</div>

</div>

)}

{/* VENDOR REPORT */}

{reportType === "vendor" && (

<div className="report-section">

<div className="chart-card">

<h3>Vendor Performance</h3>

<Bar data={vendorChartData} />

</div>

<div className="report-table">

<table>

<thead>
<tr>
<th>Vendor</th>
<th>Total Orders</th>
<th>Total Amount</th>
</tr>
</thead>

<tbody>

{vendorData.map((item,index)=>(

<tr key={index}>
<td>{item[0]}</td>
<td>{item[1]}</td>
<td>₹{item[2]}</td>
</tr>

))}

</tbody>



</table>

</div>

</div>

)}

{/* MONTHLY REPORT */}

{reportType === "monthly" && (

<div className="report-section">

<div className="chart-card">

<h3>Monthly Distribution</h3>

<Bar data={monthlyChartData} />
</div>

<div className="report-table">

<table>

<thead>
<tr>
<th>Month</th>
<th>Shipments</th>
</tr>
</thead>

<tbody>

{monthlyData.map((item,index)=>(

<tr key={index}>
<td>{monthNames[item[0]]}</td>
<td>{item[1]}</td>
</tr>

))}

</tbody>

</table>

</div>

</div>

)}

</div>

    </div>

   </div>

  </div>
 );
}

export default Reports;