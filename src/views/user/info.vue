<meta name="referrer" content="no-referrer" />
<template>
  <div>
    <basic-container>
      <avue-form :option="option"
                 v-model="form"
                 @tab-click="handleTabClick"
                 @submit="handleSubmit" id="pdfDom">
        <template slot-scope="scope" slot="menuForm" type="primary">
          <el-button @click="getPdf">打印</el-button>
        </template>
      </avue-form>
    </basic-container>
  </div>
</template>

<script>
import option from "@/const/user/info";
import {getUserInfo, update, updatePassword} from "@/api/system/user";
import func from "@/util/func";
import htmlToPdf from '@/components/utils/htmlToPdf'

export default {
  data() {
    return {
      index: 0,
      option: option,
      form: {},
      htmlTitle: '个人信息',
    };
  },
  created() {
    this.handleWitch();
  },
  methods: {
    handleSubmit(form, done) {
      if (this.index === 0) {
        form.submitStatus = 2;
        update(form).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "修改信息成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
          done();
        }, error => {
          window.console.log(error);
          done();
        })
      } else {
        updatePassword(form.oldPassword, form.newPassword, form.newPassword1).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "修改密码成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
          done();
        }, error => {
          window.console.log(error);
          done();
        })
      }
    },
    getPdf () {
      htmlToPdf.downloadPDF(document.querySelector('#pdfDom'), this.htmlTitle)
    },
    handleWitch() {
      if (this.index === 0) {
        getUserInfo().then(res => {
          const user = res.data.data;
          this.form = {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            realName: user.realName,
            roleName: user.roleName,
            deptName: user.deptName,
            phone: user.phone,
            email: user.email,
            status: user.status,
            companyName: user.companyName,
            companyAddress: user.companyAddress,
          }
        });
      }
    },
    handleTabClick(tabs) {
      this.index = func.toInt(tabs.index);
      this.handleWitch();
    }
  }
};
</script>

<style>
</style>
