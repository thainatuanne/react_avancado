import axios from "axios";

export const academyApi = axios.create({
    baseURL: "http://localhost:5173/",
});