import axios from "axios";

const HOST = import.meta.env.VITE_HTTP_HOST;

export const apiv2 = axios.create({
    baseURL: `${HOST}/api/v2`,
    withCredentials: true,
    timeout: 10000,
});

export const apiv1 = axios.create({
    baseURL: `${HOST}/api/v1`,
});
