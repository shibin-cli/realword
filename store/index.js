const cookieparser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行都是同一个实例
// 为了防止数据冲突，需要把state定义成一个函数，返回数据对象
const state = () => {
    return {
        user: null
    }
}
const mutations = {
    setUser(state, data) {
        state.user = data
    }
}
const actions = {
    // 这个action会在服务端渲染期间自动调用
    // 用来初始化容器数据，传递给客户端使用
    nuxtServerInit({ commit }, { req }) {
        let user = null
        if (req.headers.cookie) {
            const parsed = cookieparser.parse(req.headers.cookie)
            try {
                user = JSON.parse(parsed.user)
            } catch (err) {
                // No valid cookie found
            }
        }
        commit('setUser', user)
      }
}
export default {
    state,
    mutations,
    actions
}