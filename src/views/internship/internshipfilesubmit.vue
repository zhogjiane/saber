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
               :upload-after="uploadAfter"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text"
                   size="small"
                   icon="el-icon-download"
                   @click="fileDownload(scope.row)">附件下载
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/internship/internshipfilesubmit";
  import * as fileMessage from "@/api/file/filemessage";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
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
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "材料名称",
              prop: "internshipFileName",
              rules: [{
                required: true,
                message: "请输入材料名称",
                trigger: "blur"
              }]
            },
            {
              label: "实习公司",
              prop: "companyname",
              rules: [{
                required: true,
                message: "请输入实习公司",
                trigger: "blur"
              }]
            },
            {
              label: "实习地址",
              prop: "companyaddress",
              rules: [{
                required: true,
                message: "请输入实习地址",
                trigger: "blur"
              }]
            },
            {
              label: "提交人",
              prop: "createUser",
              type: "select",
              dicUrl: "/api/blade-user/getAllUser",
              props: {
                label: "name",
                value: "id"
              },
              dataType: "number",
              slot: true,
              rules: [{
                required: true,
                message: "请输入提交人",
                trigger: "blur"
              }],
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
              rules: [{
                required: true,
                message: "请选择所属教师",
                trigger: "click"
              }]
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
              rules: [{
                required: true,
                message: "请选择实习状态",
                trigger: "blur"
              }],
            },
            {
              label: "备注",
              prop: "remark",
              row: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: '附件上传',
              prop: 'filePath',
              type: 'upload',
              loadText: '附件上传中，请稍等',
              span: 24,
              limit:'1',
              propsHttp: {
                res: 'data',
                url: 'link',
                name: 'originalName',
              },
              action: '/api/blade-resource/oss/endpoint/put-file',
              hide:true,
            },
            /*{
              label: '附件上传',
              type: 'upload',
              propsHttp: {
                res: 'data',
                url: 'link',
              },
              canvasOption: {
                text: 'blade',
                ratio: 0.1
              },
              action: '/api/blade-resource/oss/endpoint/put-file',
              span: 12,
              row: true,
              prop: 'filePath'
            },*/
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
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
        row.filePath = row.filePath[0].value;
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
        row.filePath = row.filePath[0].value;
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
      fileDownload(row) {
        console.log(row);
        const filePath = row.filePath;
        this.$confirm("确定下载附件?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.downFile(filePath);
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
      uploadAfter(res, done, loading){
        console.log(res);
        const form = {};
        form.fileName = res.originalName;
        form.fileUrl = res.link;
        fileMessage.update(form);
        done();
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
