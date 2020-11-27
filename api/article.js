import {
    request
} from '@/plugins/request'

// 获取文章列表
export const getArticles = params => {
    return request.get('articles', {
        params
    })
}
// 获取关注文章列表
export const getFeedArticles = params => {
    return request.get('articles/feed', {
        params
    })
}
// 获取文章详情
export const getArticle =slug=>{
    return request.get(`articles/${slug}`)
}
// 收藏
export const addFavorite = slug => {
    return request.post(`articles/${slug}/favorite`)
}
// 取消收藏
export const cancelFavorite = slug => {
    return request.delete(`articles/${slug}/favorite`)
}
// 获取标签
export const getTag = () => {
    return request.get('tags')
}
// 获取文章评论
export const getComments = slug=>{
    return request.get(`/articles/${slug}/comments`)
}