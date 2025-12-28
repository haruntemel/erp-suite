import api from "../api";


export async function login(username: string, password: string) {
  const res = await api.post("/auth/login", { username, password });
  return res.data; // { token, user }
}