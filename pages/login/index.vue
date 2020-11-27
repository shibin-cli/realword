<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            {{ isLoginPage ? "Login in" : "Sign up" }}
          </h1>
          <p class="text-xs-center">
            <nuxt-link to="/register" v-if="isLoginPage"
              >Need an account?</nuxt-link
            >
            <nuxt-link to="/login" v-else>Have an account?</nuxt-link>
          </p>
          <ul class="error-messages">
            <li v-for="(messages, field) in errors" :key="field">
              {{ field }} {{ messages.join(",") }}
            </li>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLoginPage">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
                v-model="username"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                required
                v-model="email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                autocomplete
                minlength="8"
                required
                v-model="password"
              />
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              :disabled="submitDisabled"
            >
              {{ isLoginPage ? "Login in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { register, login } from "@/api/user";
import axios from "axios";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  middleware: "notAuthenticated",
  computed: {
    isLoginPage() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      email: "",
      password: "",
      username: "",
      errors: {},
      submitDisabled: false,
    };
  },
  methods: {
    async onSubmit() {
      this.submitDisabled = true;
      try {
        let user = {
          email: this.email,
          password: this.password,
          username: this.username,
        };
        let fn = this.isLoginPage ? login : register;
        const { data } = await fn(user);
        this.$store.commit("setUser", data.user);
        // 数据持久化
        Cookie.set("user", data.user);
        this.$router.push("/");
      } catch (e) {
        this.errors = e.response.data.errors;
      } finally {
        this.submitDisabled = false;
      }
    },
  },
};
</script>