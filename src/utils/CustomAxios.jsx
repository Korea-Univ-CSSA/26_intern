import axios from "axios";

export const customAxios = axios.create({
  baseURL: "https://iotcube.net",
  // baseURL: "http://localhost:8081",
  withCredentials: true,
});

// 추후 request 에서 처리해야 할 것
// customAxios.interceptors.request.use(function (config) {
//   const Authorization = localStorage.getItem('access_token');
//   config.headers['Content-Type'] = 'application/json';
//   config.headers['Authorization'] = Authorization;

//   return config;
// });

// 추후 response 에서 처리해야 될 것
// customAxios.interceptors.response.use(
//   function (response) {
//     return response;
//   });
