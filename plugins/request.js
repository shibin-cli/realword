import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io/api'
})

export default ({
    store,
    redirect 
}) => {
    request.interceptors.request.use(function (config) {
        const user = store.state.user
        if (user && user.token)
            config.headers.Authorization = `Token ${store.state.user.token}`

        return config
    }, function (error) {
        return Promise.reject(error)
    })
    request.interceptors.response.use(res => res, err => {
        if (err.response && err.response.status === 401) {
            redirect('/login')
        }
        return err
    })
}

// export default request