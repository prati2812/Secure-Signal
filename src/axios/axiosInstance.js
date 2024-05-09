import { BASE_URL } from "@env";
import axios from "axios";
import { useSelector } from "react-redux";


const token = useSelector((state) => state.userProfile.token);

const instance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

});


export default instance;