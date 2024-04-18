import axios from 'axios';
import {BASE_URL} from "../common/BaseUrl";

export default axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});