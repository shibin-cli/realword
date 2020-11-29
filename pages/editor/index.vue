<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <li v-for="(messages, field) in errors" :key="field">
              {{ field }} {{ messages.join(",") }}
            </li>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="article.tagList"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" :disabled="submitDisabled">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from "@/api/article";
export default {
  middleware: "authenticated",
  data() {
    return {
      errors: [],
      submitDisabled:false,
      article: {
        title: "",
        description: "",
        body: "",
        tagList: "",
      },
    };
  },
  async asyncData(ctx) {
    if (ctx.params.slug) {
      const { data } = await getArticle(ctx.params.slug);
       data.article.tagList =  data.article.tagList.join(',')
      return {
        article: data.article,
      };
    }
  },
  methods: {
    async onSubmit() {
      this.submitDisabled = true
      let fn = this.article.slug ? updateArticle : createArticle;
      try {
        const { data } = await fn(
          {
            ...this.article,
            tagList: this.article.tagList.split(','),
          },
          this.article.slug
        );
        this.$router.push({
          name: "article",
          params: {
            slug: data.article.slug,
          },
        });
      } catch (e) {
        console.log(e)
        this.errors = e.response.data.errors;
      }finally{
        this.submitDisabled = false
      }
    },
  },
};
</script>

<style>
</style>