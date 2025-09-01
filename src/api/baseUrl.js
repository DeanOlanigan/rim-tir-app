import axios from "axios";

export const apiv2 = axios.create({
    baseURL: "/api/v2",
});

export const apiv1 = axios.create({
    baseURL: "/api/v1",
});
