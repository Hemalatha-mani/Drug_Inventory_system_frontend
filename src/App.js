// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import Login from "./components/Login";

// function App() {
//   return <Login />;
// }

// export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Drugs from "./components/Drugs";
import Vendors from "./components/Vendors";
import SupplyOrders from "./components/SupplyOrders";
import Shipments from "./components/Shipments";
import DrugRequests from "./components/DrugRequests";
import Alerts from "./components/Alerts";
import Reports from "./components/Reports";
import Users from "./components/Users";
import Settings from "./components/Settings";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drugs" element={<Drugs />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/supply-orders" element={<SupplyOrders />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/drug-requests" element={<DrugRequests />}/>
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;