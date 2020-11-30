<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img class="user-img" :src="profile.image" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{
                name: 'settings',
              }"
              v-if="user&&(profile.username === user.username)"
            >
              <i class="ion-gear-a"> Edit Profile Settings</i>
            </nuxt-link>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{ active: profile.following }"
              @click="follow"
              :disabled="followDisabled"
              v-else
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{
                `${profile.following ? "Unfollow" : "Follow"} ${
                  profile.username
                }`
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my',
                    },
                    params: {
                      usename: profile.username,
                    },
                  }"
                  :class="{ active: tab === 'my' }"
                  exact
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'favorited' }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited',
                    },
                    params: {
                      usename: profile.username,
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <ArticleList :articles="articles" />
          <nav v-if="totalPage > 1">
            <ul>
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{ name: 'profile', query: { page: item, tab } }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getArticles } from "@/api/article";
import { getProfile, followUser, unfollowUser } from "@/api/user";
import ArticleList from "@/components/article-list/index.vue";

export default {
  // middleware: "authenticated",
  components: {
    ArticleList,
  },
  watchQuery: ["tab", "page"],
  async asyncData(ctx) {
    const { query, params, store } = ctx;
    let limit = 5;
    let page = Number(query.page) || 1;
    try {
      let opts = {
        limit,
        offset: limit * (page - 1),
        page:page
      };
      if (query.tab === "favorited") {
        opts.favorited = params.username;
      } else {
        opts.author = params.username;
        query.tab = query.tab || "my";
      }
      const [articlesData, profileData] = await Promise.all([
        getArticles(opts),
        getProfile(params.username),
      ]);
      let  articlesCount =  articlesData.data.articlesCount
      
      return {
        articles: articlesData.data.articles,
        profile: profileData.data.profile,
        tab: query.tab,
        articlesCount,
        limit,
        page
      };
    } catch (err) {
      ctx.error({ statusCode: 404, message: "Profile not found" });
    }
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  data() {
    return {
      followDisabled: false,
    };
  },
  methods: {
    async follow() {
      let fn = this.profile.following ? unfollowUser : followUser;
      this.followDisabled = true;
      try {
        const { data } = await fn(this.profile.username);
        this.profile.following = data.profile.following;
      } catch (error) {
      } finally {
        this.followDisabled = false;
      }
    },
  },
};
</script>

<style>
</style>