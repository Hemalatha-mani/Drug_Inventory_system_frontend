
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Drugs.css";
import {
  FaSearch,
  //FaFilter,
  FaEdit,
  FaTrash,
  FaPlus
} from "react-icons/fa";

function Drugs() {

  const [drugs, setDrugs] = useState([]);

  const [drugName, setDrugName] = useState("");
  const [category, setCategory] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [stock, setStock] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

const filteredDrugs = drugs.filter((drug) => {

  const matchesCategory =
    selectedCategory === "" ||
    drug.category === selectedCategory;

  const matchesSearch =
    drug.drugName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    drug.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  return matchesCategory && matchesSearch;
});

const recordsPerPage = 5;
const lastIndex = currentPage * recordsPerPage;
const firstIndex = lastIndex - recordsPerPage;

const currentDrugs = filteredDrugs.slice(firstIndex,lastIndex);

const totalPages = Math.ceil(filteredDrugs.length / recordsPerPage);


  const API_URL = "http://localhost:8080/api/drugs";

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    try {
      const result = await axios.get(API_URL);
      setDrugs(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDrug = async () => {

    if (
      !drugName ||
      !category ||
      !batchNo ||
      !expiryDate ||
      !stock
    ) {
      alert("Please fill all fields");
      return;
    }

    const drug = {
      drugName,
      category,
      batchNo,
      expiryDate,
      stock
    };

    try {

      if (editId) {

  await axios.put(
    `${API_URL}/${editId}`,
    drug
  );

  alert("Drug Updated Successfully");

} else {

  await axios.post(
    API_URL,
    drug
  );

  alert("Drug Added Successfully");
}

      alert("Drug Added Successfully");

      loadDrugs();

      setDrugName("");
      setCategory("");
      setBatchNo("");
      setExpiryDate("");
      setStock("");
      setEditId(null);

    } catch (error) {
      console.error(error);
      alert("Failed to add drug");
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(`${API_URL}/${id}`);

      alert("Drug Deleted Successfully");

      loadDrugs();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (drug) => {

  setEditId(drug.drugId);

  setDrugName(drug.drugName);
  setCategory(drug.category);
  setBatchNo(drug.batchNo);
  setExpiryDate(drug.expiryDate);
  setStock(drug.stock);
};

  return (
    <div className="drugs-page">

      <div className="drugs-header">
        <h2>Drug Inventory Management</h2>

        <button
          className="add-btn"
          onClick={handleAddDrug}
        >
          <FaPlus /> {editId ? " Update Drug" : " Add New Drug"}
        </button>
      </div>

      <div className="drug-form">

        <input
          type="text"
          placeholder="Drug Name"
          value={drugName}
          onChange={(e) =>
            setDrugName(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Batch No"
          value={batchNo}
          onChange={(e) =>
            setBatchNo(e.target.value)
          }
        />

        <input
          type="date"
          value={expiryDate}
          onChange={(e) =>
            setExpiryDate(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

      </div>

      <div className="search-section">

        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search drug by name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
  onChange={(e) =>
    setSelectedCategory(e.target.value)
  }
>
  <option value="">All Categories</option>
  <option value="Pain Relief">Pain Relief</option>
  <option value="Antibiotics">Antibiotics</option>
  <option value="Vitamins">Vitamins</option>
  <option value="Diabetes Care">Diabetes Care</option>
</select>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Drug ID</th>
              <th>Drug Name</th>
              <th>Category</th>
              <th>Batch No.</th>
              <th>Expiry Date</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {currentDrugs.map((drug) => (

              <tr key={drug.drugId}>

                <td>{drug.drugId}</td>
                <td>{drug.drugName}</td>
                <td>{drug.category}</td>
                <td>{drug.batchNo}</td>
                <td>{drug.expiryDate}</td>
                <td>{drug.stock}</td>

                <td>

                  <button className="edit-btn" onClick={() => handleEdit(drug)} >
                    <FaEdit />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(drug.drugId)
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
    Showing {firstIndex + 1} to{" "}
    {Math.min(lastIndex, filteredDrugs.length)}
    {" "}of{" "}  { filteredDrugs.length} entries
  </span>

  <div>

    <button
      className="page"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (

      <button
        key={index + 1}
        className={
          currentPage === index + 1
            ? "page active"
            : "page"
        }
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </button>

    ))}

    <button
      className="page"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      Next
    </button>

  </div>

</div>

    </div>
  );
}

export default Drugs;