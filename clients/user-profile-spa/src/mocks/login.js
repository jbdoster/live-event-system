import axios from "axios";

export const login = () =>
  axios.post("http://localhost:8082")
  .then(response => {
    return response?.data?.sessionId;
  })
  .catch(error => {
    console.error(error);
  });
