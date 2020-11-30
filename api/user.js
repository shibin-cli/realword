import {
    request
} from '@/plugins/request'

export const login = ({
    email,
    password
}) => {
    return request
        .post("/users/login", {
            user: {
                email,
                password
            }
        })
}
export const register = ({
    username,
    email,
    password
}) => {
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
export const getProfile = username => {
    return request.get(`profiles/${username}`)
}
export const followUser = username => {
    return request.post(`profiles/${username}/follow`)
}
export const unfollowUser = username => {
    return request.delete(`profiles/${username}/follow`)
}