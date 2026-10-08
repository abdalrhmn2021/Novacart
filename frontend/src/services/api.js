import axios from "axios";

const api = axios.create({

 // Same-origin: proxied to the backend by next.config.mjs rewrites
 baseURL: "/api",

 headers:{
  "Content-Type":"application/json",
 },

 withCredentials:true,

});


export default api;

