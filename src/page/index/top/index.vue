<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div class="avue-breadcrumb"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           v-if="showCollapse">
        <i class="icon-navicon"
           @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show"
           v-if="showMenu">
        <top-menu></top-menu>
      </div>
      <span class="top-bar__item"
            v-if="showSearch">
        <top-search></top-search>
      </span>
    </div>
    <div class="top-bar__right">
      <el-tooltip v-if="showColor"
                  effect="dark"
                  :content="$t('navbar.color')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showDebug"
                  effect="dark"
                  :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLock"
                  effect="dark"
                  :content="$t('navbar.lock')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme"
                  effect="dark"
                  :content="$t('navbar.theme')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark"
                  :content="$t('navbar.messages')"
                  placement="bottom">
        <div class="top-bar__item">
          <template>
            <span @click="handleOpen()">
              <el-badge is-dot>
                <i class="el-icon-bell"></i>
              </el-badge>
              <el-dialog title="消息通知"
                         fullscreen
                         :visible.sync="box"
                         width="70%"
                         append-to-body>
                <avue-crud :option="option"
                           :table-loading="loading"
                           :data="data"
                           ref="crud"
                           v-model="form"
                           :before-open="beforeOpen"
                           :page="page"
                           @current-change="currentChange"
                           @size-change="sizeChange"
                           @refresh-change="refreshChange"
                           @on-load="onLoad">
                  <template slot="menuLeft">
                    <el-button type="danger"
                               size="small"
                               icon="el-icon-delete"
                               plain
                               @click="viewUserMessages">一键已读
                    </el-button>
                  </template>
                  <template slot-scope="scope" slot="menu">
                    <el-button type="text"
                               size="small"
                               icon="el-icon-view"
                               @click="viewMessages(scope.row.id)">已 读
                    </el-button>
      </template>
                </avue-crud>
              </el-dialog>
            </span>
          </template>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark"
                  :content="$t('navbar.language')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip>
<!--      <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip>-->
      <img class="top-bar__img"
           :src="userInfo.avatar">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.userName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout"
                            divided>{{$t('navbar.logOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { fullscreenToggel, listenfullscreen } from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topLang from "./top-lang";
import {getMessagesList, getUser} from "@/api/system/user";
import * as message from "@/api/message/messages";
export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topLang
  },
  name: "top",
  data() {
    return {
      box: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      form: {
        id:'',
        message:'',
        userId:'',
        toUserId:'',
      },
      data: [],
      query: {},
      loading: false,
      option: {
        menu: true,
        addBtn: false,
        page: false,
        border: true,
        expand: true,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: true,
        headerAlign: "center",
        column: [
          {
            label: "通知",
            prop: "message",
          },
          {
            label: "通知人",
            prop: "userId",
            type: "select",
            dicUrl: "/api/blade-user/getAllUser",
            props: {
              label: "name",
              value: "id"
            },
          },
          {
            label: "接收人",
            prop: "toUserId",
            type: "select",
            dicUrl: "/api/blade-user/getAllToUser",
            props: {
              label: "name",
              value: "id"
            },
          },
        ]
      }
    };
  },
  filters: {},
  created() {},
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor
    }),
    ...mapGetters([
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag"
    ])
  },
  methods: {
    viewMessages(id){
        message.updateMessages(id,this.$store.getters.userInfo.userId).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "消息已读!",
            });
            this.onLoad(this.page);
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        })
    },
    viewUserMessages() {
      message.updateUserMessages(this.$store.getters.userInfo.userId).then(res => {
        if (res.data.success) {
          this.$message({
            type: "success",
            message: "消息一键已读成功!",
          });
          this.onLoad(this.page);
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      })
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getMessagesList(page.currentPage, page.pageSize, Object.assign(params, this.query), this.$store.getters.userInfo.userId).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getUser(this.form.id).then(res => {
          this.form = res.data.data;
          if(this.form.hasOwnProperty("deptId")){
            this.form.deptId = this.form.deptId.split(",");
          }
          if(this.form.hasOwnProperty("roleId")){
            this.form.roleId = this.form.roleId.split(",");
          }
          if(this.form.hasOwnProperty("postId")){
            this.form.postId = this.form.postId.split(",");
          }
        });
      }
      done();
    },
    handleOpen() {
      this.box = true;
      this.onLoad(this.page);
    },
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
