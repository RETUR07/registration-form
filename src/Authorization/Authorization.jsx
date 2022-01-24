import { useContext } from 'react';
import Context from '../Contexts/Context';

const cache = require('memory-cache');

export default function Authorization(){
    const axios = require('axios').default;
    const {setAuthorized} = useContext(Context);

    axios.interceptors.request.use(
    async (config) => {
        config.headers.Authorization = "Bearer " + localStorage.getItem("jwtToken")
        return config;
    },
    error => {
        Promise.reject(error)
    });

    axios.interceptors.response.use((response) => {
    return response
    }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshAccessToken();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("jwtToken");
        return axios(originalRequest);
    }
    return Promise.reject(error);
    });

    const refreshAccessToken = async () => {
        const data = new URLSearchParams();
        data.append('client_id', "client");
        data.append('client_secret', "secret");
        data.append('grant_type', "refresh_token");
        data.append('refresh_token', localStorage.getItem("refreshToken"));
    await axios({
        method: 'post',
        url: 'https://localhost:9001/connect/token',
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
    })
    .catch(
        (error) => {
        console.log(error);
        cache.clear();
        setAuthorized(false);
    })
    .then(
        (response) => {
        if(response)
        {
            localStorage.setItem("jwtToken", response.data.access_token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            setAuthorized(true);
        }
    })
    }
    return (null);
}
