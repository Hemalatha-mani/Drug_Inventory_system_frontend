import axios from "axios";

const API_URL = "http://localhost:8080/api/drugs";

export const getDrugs = () =>
  axios.get(API_URL);

export const addDrug = (drug) =>
  axios.post(API_URL, drug);

export const updateDrug = (id, drug) =>
  axios.put(`${API_URL}/${id}`, drug);

export const deleteDrug = (id) =>
  axios.delete(`${API_URL}/${id}`);