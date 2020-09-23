<template>
  <el-container>
    <div class="login">
      <div class="login-panel">
        <div class="logo">平台客服</div>
        <van-cell-group>
          <van-field v-model="username" equired placeholder="用户名" />
          <van-field
            v-model="password"
            v-on:keyup.13="toLogin"
            type="password"
            placeholder="密码"
            required
          />
        </van-cell-group>
        <van-button type="default" @click="toLogin">登录</van-button>
      </div>
    </div>
  </el-container>
</template>

<script>
import { Message } from "element-ui";

import "./index.less";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      nickname: "",
    };
  },
  mounted: function () {
    // const path = this.isRegister ? "/register" : "/login";
    // if(path !== location.pathname){
    // 	this.$router.push(path);
    // }
  },
  components: {},
  computed: {
    // isRegister(){
    // 	return this.$store.state.login.isRegister;
    // },
  },
  methods: {
    ...mapActions(["onLogin", "setRegisterFlag", "onRegister"]),
    toLogin() {
      var _this = this;
      this.onLogin({
        username: this.username.toLowerCase(),
        password: this.password,
      });
      this.axios.post("/apis/api/user/kfloginByPwd", {
          password: this.password,
          username: this.username,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            window.localStorage.setItem( "shopname", response.data.data.shopname);
            _this.toRegister();
          } else {
            Message.error(response.data.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    toRegister() {
      this.onRegister({
        username: this.username,
        password: this.password,
        nickname: this.username.toLowerCase(),
      });
    },
    changeType() {
      this.setRegisterFlag(!this.isRegister);
    },
  },
};
</script>
