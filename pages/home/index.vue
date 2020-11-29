<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  :to="{
                    name: 'home',
                  }"
                  >Global Feed
                </nuxt-link>
              </li>
              <li class="nav-item" v-if="tag">
                <a class="nav-link active">
                  <i class="ion-pound"></i>
                  {{ tag }}</a
                >
              </li>
            </ul>
          </div>
          <div class="article-preview" v-show="loading">
            Loading articles...
          </div>
          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="'/profile/' + article.author.username"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="'/profile/' + article.author.username"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date("MMMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                :disabled="article.favoriteDisabled"
                @click="onFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link class="preview-link" :to="'/article/' + article.slug">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
            <ul class="tag-list">
              <li
                class="tag-default tag-pill tag-outline"
                v-for="tag in article.tagList"
                :key="tag"
              >
                {{ tag }}
              </li>
            </ul>
          </div>
          <nav>
            <ul>
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{ name: 'home', query: { page: item, tag, tab } }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                class="tag-pill tag-default"
                v-for="tag in tags"
                :key="tag"
                :to="{ name: 'home', query: { tag, tab: 'tag' } }"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getFeedArticles,
  getTag,
  addFavorite,
  cancelFavorite,
} from "@/api/article";
import { mapState } from "vuex";
import dayjs from "dayjs";

export default {
  watchQuery: ["page", "tag", "tab"],
  async asyncData({ query, store }) {
    let page = Number(query.page) || 1;
    let { tag, tab = "global_feed" } = query;
    let limit = 10;
    // const { data } = await ;
    let getArticleData =
      store.state.user && tab === "your_feed" ? getFeedArticles : getArticles;
    try {
      const res = await Promise.all([
        getArticleData({
          limit,
          offset: limit * (page - 1),
          tag: tag,
        }),
        getTag(),
      ]);
      const [{ data }, { data: tagData }] = res;
      data.articles.forEach((article) => {
        article.favoriteDisabled = false;
      });
      return {
        articles: data.articles,
        articlesCount: data.articlesCount,
        tags: tagData.tags,
        limit,
        page,
        tag,
        loading: false,
        tab: tab || "global_feed",
      };
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
    ...mapState(["user"]),
  },
  methods: {
    async onFavorite(article) {
      let fn = article.favorited ? cancelFavorite : addFavorite;
      article.favoriteDisabled = true;
      try {
        const { data } = await fn(article.slug);
        if (data && data.article) {
          article.favorited = data.article.favorited;
          article.favoritesCount = data.article.favoritesCount;
        }
      } finally {
        article.favoriteDisabled = false;
      }
    },
  },
};
</script>

<style>
</style>