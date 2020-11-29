<template>
  <div>
    <form class="card comment-form" @submit.prevent="addComment">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          required
          v-model="comment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="commentDisabled">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="(comment,index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: { username: comment.author.username },
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <a href="" class="comment-author">{{ comment.author.username }}</a>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD, YYYY")
        }}</span>
        <span
          class="mod-options"
          v-if="user.username === comment.author.username"
        >
          <!-- <i class="ion-edit"></i> -->
          <i class="ion-trash-a" @click="delComment(comment.id,index)" :disabled="deleteDisabled"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getComments, addComment, deleteComment } from "@/api/article";
export default {
  props: {
    article: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      comments: [],
      comment: "",
      commentDisabled: false,
      deleteDisabled:false
    };
  },
  async created() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  methods: {
    async addComment() {
      this.commentDisabled = true;
      try {
        const { data } = await addComment(this.article.slug, {
          body: this.comment,
        });
        this.comments.unshift(data.comment);
        this.comment = "";
      } catch (e) {
      } finally {
        this.commentDisabled = false;
      }
    },
    async delComment(id,index) {
      try {
         await deleteComment(this.article.slug, id);
         this.comments.splice(index,1)
      } catch (error) {
      } finally {
      }
    },
  },
};
</script>