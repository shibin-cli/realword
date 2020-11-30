<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <li v-for="(messages, field) in errors" :key="field">
              {{ field }} {{ messages.join(",") }}
            </li>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="submitDisabled"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateUser } from "@/api/user";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: "authenticated",
  computed: {
    ...mapState({
      userState: (state) => state.user,
    }),
  },
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        image: "",
        bio: "",
      },
      errors: [],
      submitDisabled: false,
    };
  },
  created() {
    this.user.username = this.userState.username;
    this.user.email = this.userState.email;
    this.user.bio = this.userState.bio || "";
    this.user.image = this.userState.image || "";
  },

  methods: {
    logout() {
      // Code will also be required to invalidate the JWT Cookie on external API
      Cookie.remove("user");
      this.$store.commit("setUser", null);
      this.$router.push("/");
    },
    async onSubmit() {
      this.submitDisabled = true;
      try {
        let user = { ...this.user };
        if (!user.password) {
          delete user.password;
        }
        const { data } = await updateUser(user);
        this.$store.commit("setUser", data.user);
        Cookie.set("user", data.user);
      } catch (e) {
        this.errors = e.response.data.errors;
      } finally {
        this.submitDisabled = false;
      }
    },
  },
};
</script>

<style>
</style>