import axios from "axios"

export const loginService = payload => {
    return axios.post("/api/user/auth", payload).then(res => res.data)
}

export const getMenusService = payload => {
    return axios.get("/api/user/menus").then(res => res.data)
}
