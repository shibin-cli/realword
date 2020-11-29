import { request } from '@/plugins/request'

export const login = ({ email, password }) => {
    return request
        .post("/users/login", {
            user: {
                email,
                password
            }
        })
}
export const register = ({ username, email, password }) => {
    return request
        .post("/users", {
            user: {
                username,
                email,
                password,
            }
        })
}
export const updateUser = user => {
    return request
        .put("/user", {
            user
        })
}