import api from "./axios";

// Given credentials in the assignment:
// username: emilys
// password: emilyspass

export const loginUser = async (username, password) => {
    const res = await api.post("/auth/login", { username, password, })
    return res.data
}