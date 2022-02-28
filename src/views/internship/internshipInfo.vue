<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   icon="el-icon-edit"
                   v-if="scope.row.submitStatus === 2"
                   @click="updateSubmitStatus(scope.row,3)">退回
        </el-button>
        <el-button type="text"
                   size="small"
                   icon="el-icon-edit"
                   v-if="scope.row.submitStatus === 2 && (userInfo.authority.includes('teacher')||userInfo.authority.includes('administrator'))"
                   @click="openDialog(scope.row.id)">通过
        </el-button>
        <el-button type="text"
                   size="small"
                   icon="el-icon-edit"
                   v-if="scope.row.submitStatus === 4 && (userInfo.authority.includes('secretary')||userInfo.authority.includes('administrator'))"
                   @click="updateSubmitStatus2(scope.row.id,5)">通过
        </el-button>
        <el-button type="text"
                   size="small"
                   icon="el-icon-edit"
                   v-if="scope.row.submitStatus === 5 && (userInfo.authority.includes('director')||userInfo.authority.includes('administrator'))"
                   @click="updateSubmitStatus2(scope.row.id,6)">通过
        </el-button>
      </template>
    </avue-crud>
    <template>
      <el-dialog title="实习打分" :visible.sync="dialogVisible" :close-on-click-modal="true" :modal="true" :show-close="true" :center="true">
        <avue-form :option="gradesOption" v-model="gradesForm">
          <template slot-scope="scope" slot="menuForm">
            <el-button type="primary"
                       size="small"
                       @click="updateSubmitStatus1(4)">确定
            </el-button>
            <el-button size="small"
                       @click="dialogVisible = false">取消
            </el-button>
          </template>
        </avue-form>
      </el-dialog>
    </template>
  </basic-container>
</template>

<script>
import {getList, getDetail, addMessage} from "@/api/internship/internshipInfo";
  import {mapGetters} from "vuex";
  import {update} from "@/api/system/user";
import { uuid } from 'vue-uuid';

export default {
    data() {
      return {
        userId:'',
        grades:'',
        dialogVisible:false,
        form: {
          id:'',
          internshipFileName:'',
          companyName:'',
          companyAddress:'',
          createUser:'',
          createDept:'',
          createTime:'',
          updateUser:'',
          updateTime:'',
          status:'',
          isDeleted:'',
          remark:''
        },
        gradesForm: {
          grades:'',
        },
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          addBtn:false,
          delBtn:false,
          editBtn:false,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "状态",
              prop: "submitStatus",
              type: "radio",
              dicUrl: "/api/blade-system/dict/dictionary?code=submitStatus",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dataType: "number",
            },
            {
              label: "姓名",
              prop: "name",
            },
            {
              label: "实习状态",
              prop: "status",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=internship_status",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              dataType: "number",
              slot: true,
            },
            {
              label: "实习公司",
              prop: "companyName",
            },
            {
              label: "实习地址",
              prop: "companyAddress",
            },
            {
              label: "邮箱",
              prop: "email",
            },
            {
              label: "手机",
              prop: "phone",
            },
            {
              label: "所属教师",
              prop: "deptId",
              type: "select",
              dicUrl: "/api/blade-system/dept/getAllTeacher",
              props: {
                label: "deptName",
                value: "id"
              },
              slot: true,
            },

          ]
        },
        gradesOption: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          emptyBtn: false,
          submitBtn: false,
          column: [
            {
              label: "实习成绩",
              prop: "grades",
              span:24,
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["userInfo", "permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.internshipfilesubmit_add, false),
          viewBtn: this.vaildData(this.permission.internshipfilesubmit_view, false),
          delBtn: this.vaildData(this.permission.internshipfilesubmit_delete, false),
          editBtn: this.vaildData(this.permission.internshipfilesubmit_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        //row.filePath = row.filePath[0].value;
        add(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        //row.filePath = row.filePath[0].value;
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      openDialog(id){
        this.dialogVisible = true;
        this.userId = id;
      },
      updateSubmitStatus(row,status) {
        const form = {};
        form.id = row.id;
        form.submitStatus = status;
        if(this.gradesForm.grades){
          form.grades = this.gradesForm.grades;
        }else{
          form.grades = 0;
        }
        update(form).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "提交成功!",
            });
            this.onLoad(this.page);
            //增加通知信息
            const message = '实习信息退回！';
            const userId = this.$store.getters.userInfo.userId;
            const toUserId = row.id;
            const messageForm = {};
            messageForm.userId = userId;
            messageForm.toUserId = toUserId;
            messageForm.message = message;
            addMessage(messageForm);
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
      },
      updateSubmitStatus1(status) {
        const form = {};
        form.id = this.userId;
        form.submitStatus = status;
        if(this.gradesForm.grades){
          form.grades = this.gradesForm.grades;
        }else{
          form.grades = 0;
        }
        update(form).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "提交成功!",
            });
            this.dialogVisible = false;
            this.onLoad(this.page);
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
      },
      updateSubmitStatus2(userId,status) {
        const form = {};
        form.id = userId;
        form.submitStatus = status;
        if(this.gradesForm.grades){
          form.grades = this.gradesForm.grades;
        }else{
          form.grades = 0;
        }
        update(form).then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "提交成功!",
            });
            this.dialogVisible = false;
            this.onLoad(this.page);
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
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        console.log(this.$store.getters);
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query),this.$store.getters.userInfo.userId).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
