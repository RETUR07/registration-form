import { useContext } from 'react';
import Context from '../Contexts/Context';

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

    const refreshAccessToken = () => {
    axios({
        method: 'post',
        url: 'http://localhost:5050/api/Authorization/refresh-token',
        data: localStorage.getItem("refreshToken"),
    })
    .catch(
        (error) => {
        console.log(error);
        setAuthorized(false);
    })
    .then(
        (response) => {
        if(response)
        {
            localStorage.setItem("jwtToken", response.data.jwtToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            setAuthorized(true);
        }
    })
    }
    return (<div></div>);
}
