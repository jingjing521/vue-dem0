<template>
  <a-layout class="box">
    <a-layout-header class="layout-header">
      <div class="header">
        <span class="setting">
          <a-dropdown>
            <span class="ant-dropdown-link" href="#">
              <a-icon type="setting"/>
              <span class="username">平台客服</span>
            </span>
          </a-dropdown>
        </span>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-content style="overflow: visible">
        <Message :type="activeKey" :broken="broken" :hideUserList="hideUserList" :showUserList="showUserList"
          ref="messageList"/>
      </a-layout-content>
      <a-layout-sider style="background: #fff" :width="350">
        <a-tabs default-active-key="1" style="text-align:left;line-height:50px">
          <a-tab-pane key="1" tab="常见问题">
            <a-list :data-source="kfaskList">
              <a-list-item slot="renderItem" slot-scope="item, index" @click="sendTem(item)" style="padding-left:20px;">{{item.title}}</a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>
 

<script>
import Vue from "vue";
import MessageBox from "../../components/chat/index.vue";
import Message from "../../components/chat/message.vue";
import AddFriend from "../../components/addModal/addFriend.vue";
import GetFriendRequest from "../../components/addModal/getFriendRequest.vue";
import FirendBlack from "../../components/addModal/firendBlack.vue";
import AddGroupUser from "../../components/group/addGroupUser.vue";
import CreateGroup from "../../components/group/createGroup.vue";
import VidoeSetting from "../../components/videoSetting/index";
import GroupRequest from "../../components/group/groupRequest.vue";
import GroupInvite from "../../components/group/groupInvite.vue";
import "./index.less";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      kfaskList: [],
      groupRead: false,
      contactRead: false,
      showSettingOptions: false,
      activeKey: "contact",
      selectedItem: "",
      showAddOptions: false,
      addList: [
        {
          name: "添加好友",
          id: "1",
          icon: "chat"
        },
        {
          name: "申请入群",
          id: "2",
          icon: "friends"
        },
        {
          name: "创建群组",
          id: "3",
          icon: "comment"
        }
      ],
      userName:
        localStorage.getItem("userInfo") &&
        JSON.parse(localStorage.getItem("userInfo")).userId,
      collapsed: false,
      broken: false,
      current: ["contact"]
    };
  },
  computed: {
    chatList() {
      return this.$store.state.chat.msgList;
    }
  },
  created() { 
    console.log( "地址栏参数：", this.$route.params );
    this.toLogin();
    // 获取常见问题列表
    var _this = this;
    this.axios
      .get("/apis/api/kfask/list?page=1&limit=10&jid="+this.$route.params.shopId, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          uid: "1"
        }
      })
      .then(function(response) { 
        _this.kfaskList = response.data.data.records; 
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  methods: {
    ...mapActions(["onLogout", "onGetFirendBlack", "onSendText", "onLogin"]),
    toLogin() {
      this.onLogin({ username: this.$route.params.loginname, password: "123456" });
    },
    toLogout() {
      this.onLogout();
    },
    sendTem(item) {
      var _this = this;
      this.axios
        .post("/apis/api/kfask/info?id=" + item.id, {
          headers: { "Access-Control-Allow-Origin": "*", uid: "1" }
        })
        .then(function(response) { 
          _this.onSendText({
            chatType: "contact",
            chatId: "",
            message: item.title,
            name: _this.$route.params.toname,
            type: 1,
            content: response.data.data.content
          });
        })
        .catch(function(error) {
          console.log(error);
        });
      
    },
    onCollapse(collapsed, type) {
      if (type != "responsive") {
        this.$data.collapsed = true;
      } else {
        this.$data.collapsed = false;
      }
    },
    onBreakpoint(broken) {
      this.$data.broken = broken;
    },
    hideUserList() {
      this.$data.collapsed = true;
    },
    showUserList() {
      this.$data.collapsed = false;
    },
    select(i) {
      this.$refs.messageList.select(i);
      if (this.broken) {
        this.$data.collapsed = true;
      }
    },
    GetFirendBlack() {
      this.onGetFirendBlack();
      this.$refs.firendModel.changModel();
    },
    optionsVisibleChange() {
      this.$data.showSettingOptions = !this.$data.showSettingOptions;
    },
    contactTypeChange(type) {
      this.$data.activeKey = type.key;
      this.$router.push(`/${type.key}`);
      if (this.broken && this.collapsed) {
        this.$data.collapsed = false;
      }

      switch (type.key) {
        case "contact":
          this.$refs.messageBox.onGetContactUserList();
          break;
        case "group":
          this.$refs.messageBox.onGetGroupUserList();
          break;
        case "chatroom":
          this.$refs.messageBox.onGetChatroomUserList();
          break;
        default:
          break;
      }
      this.$refs.messageList.getCurrentMsg(type.key);
    },
    addModalChange() {
      this.$data.showAddOptions = !this.$data.showAddOptions;
    },
    ulClick(i) {
      // this.addModalChange();
      switch (i) {
        case "1":
          this.$refs.addFriendMethods.changeModal();
          break;
        case "2":
          this.$refs.addGroupModel.changeGroupModel();
          break;
        case "3":
          this.$refs.createGroupModel.changeCreateModel();
          break;
        default:
          break;
      }
    },
    recEmedia() {
      this.$refs.videoSetting.show();
    },
    getUnread(type) {
      const chatList = this.chatList[type];
      let obj = {
        contact: false,
        group: false
      };
      if (JSON.stringify(chatList) != "{}") {
        for (const item in chatList) {
          chatList[item].map((v, k) => {
            if (v.status === "unread") {
              if (v.chatType === "group") {
                obj.group = true;
              }
              if (v.chatType === "contact") {
                obj.contact = true;
              }
            }
            return obj;
          });
        }
      }
      return {
        contact: obj.contact,
        group: obj.group
      };
    }
  },
  components: {
    MessageBox,
    Message,
    AddFriend,
    GetFriendRequest,
    FirendBlack,
    AddGroupUser,
    CreateGroup,
    VidoeSetting,
    GroupRequest,
    GroupInvite
  }
};
</script>

<style>
.box {
  position: absolute;
  width: 80%;
  min-width: 800px;
  overflow: hidden;
  height: 90%;
  margin: auto;
  left: 0;
  right: 0;
  top: 100px;
  bottom: 100px;
  text-align: center;
  box-shadow: 0 0 50px #8c8c8c;
}
.box .layout-header {
  background: #3f51b5 !important;
}
.box .layout-header .header {
  line-height: 60px;
  height: 60px;
}
.box .ant-tabs-bar {
  margin: 0;
}
.box .ant-tabs-nav-container {
  line-height: 28px;
}
</style>
