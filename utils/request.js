import axios from 'axios'

const request = axios.create({
    baseURL: 'https://conduit.productionready.io/api'
})
export default request