import api from "./api";

export async function login(credentials) {

  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
}

export async function register(payload){

 const response = await api.post(
 "/auth/register",
 payload
 );

 return response.data;

}
export function getStoredAuth() {
  if (typeof window === "undefined") return null;

  const auth = localStorage.getItem("auth");

  return auth ? JSON.parse(auth) : null;
}

export async function logout() {

  await api.post("/auth/logout");
  setToken(null);

}