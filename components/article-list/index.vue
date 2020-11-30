<template>
  <div class="article-list">
    <div class="article-preview" v-show="!articles.length">
      No articles are here... yet.
    </div>
    <div class="article-preview" v-show="loading">Loading articles...</div>
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
  </div>
</template>

<script>
import { addFavorite, cancelFavorite } from "@/api/article";
export default {
  props: {
    articles: {
      default: [],
      required: true,
    },
    loading: {
      default: false,
    },
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