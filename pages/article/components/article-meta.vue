<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="article.author.username === user.username">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'updateEditor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button
        class="btn btn-outline-danger btn-sm"
        @click="delArticle"
        :disabled="delDisabled"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow Eric Simons <span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addFavorite, cancelFavorite, deleteArticle } from "@/api/article";
export default {
  props: {
    article: {
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      delDisabled: false,
    };
  },
  methods: {
    async onFavorite() {
      let article = this.article;
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
    async delArticle() {
      try {
        this.delDisabled = true;
        const { data } = await deleteArticle(this.article.slug);
        this.delDisabled = false;
        this.$router.push({
          name: "home",
        });
      } catch (error) {
        this.delDisabled = false;
      }
    },
  },
};
</script>

<style>
</style>