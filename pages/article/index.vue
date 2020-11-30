<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
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
      <hr />
      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comments :article="article" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleMeta from "./components/article-meta";
import MarkdownIt from "markdown-it";
import { getArticle } from "@/api/article";
import ArticleComments from "./components/article-comments.vue";
const md = new MarkdownIt();
export default {
  components: {
    ArticleMeta,
    ArticleComments,
  },

  async asyncData(ctx) {
    try {
      const { data } = await getArticle(ctx.params.slug);
      data.article.body = md.render(data.article.body);
      return {
        article: data.article,
      };
    } catch (err) {
      ctx.error({ statusCode: 404, message: "Article not found" });
    }
  },
  head() {
    return {
      title: this.article.title + " - realworld",
      meta: [
        {
          hid: this.article.title,
          name: "description",
          content: this.article.description,
        },
      ],
    };
  },
};
</script>

<style>
</style>