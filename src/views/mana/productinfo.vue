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
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.productinfo_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/monitoritems/productinfo";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
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
              label: "产品信息主键",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入产品信息主键",
                trigger: "blur"
              }]
            },
            {
              label: "产品类型表主键",
              prop: "productTypeId",
              rules: [{
                required: true,
                message: "请输入产品类型表主键",
                trigger: "blur"
              }]
            },
            {
              label: "产品型号",
              prop: "productModel",
              rules: [{
                required: true,
                message: "请输入产品型号",
                trigger: "blur"
              }]
            },
            {
              label: "产品名称",
              prop: "productName",
              rules: [{
                required: true,
                message: "请输入产品名称",
                trigger: "blur"
              }]
            },
            {
              label: "产品代号",
              prop: "productCode",
              rules: [{
                required: true,
                message: "请输入产品代号",
                trigger: "blur"
              }]
            },
            {
              label: "产品使用寿命,月",
              prop: "serviceLife",
              rules: [{
                required: true,
                message: "请输入产品使用寿命,月",
                trigger: "blur"
              }]
            },
            {
              label: "制造单位ID",
              prop: "manufactureCompanyId",
              rules: [{
                required: true,
                message: "请输入制造单位ID",
                trigger: "blur"
              }]
            },
            {
              label: "制造单位名称",
              prop: "manufactureCompanyName",
              rules: [{
                required: true,
                message: "请输入制造单位名称",
                trigger: "blur"
              }]
            },
            {
              label: "设计单位ID",
              prop: "designCompanyId",
              rules: [{
                required: true,
                message: "请输入设计单位ID",
                trigger: "blur"
              }]
            },
            {
              label: "设计单位名称",
              prop: "designCompanyName",
              rules: [{
                required: true,
                message: "请输入设计单位名称",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remark",
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "密级,0公开,1秘密,2机密,3绝密",
              prop: "securityLevel",
              rules: [{
                required: true,
                message: "请输入密级,0公开,1秘密,2机密,3绝密",
                trigger: "blur"
              }]
            },
            {
              label: "是否删除 0 未删除；1 已删除",
              prop: "isDeleted",
              rules: [{
                required: true,
                message: "请输入是否删除 0 未删除；1 已删除",
                trigger: "blur"
              }]
            },
            {
              label: "所属部门ID",
              prop: "createDept",
              rules: [{
                required: true,
                message: "请输入所属部门ID",
                trigger: "blur"
              }]
            },
            {
              label: "创建人ID",
              prop: "createUser",
              rules: [{
                required: true,
                message: "请输入创建人ID",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              rules: [{
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "修改人ID",
              prop: "updateUser",
              rules: [{
                required: true,
                message: "请输入修改人ID",
                trigger: "blur"
              }]
            },
            {
              label: "修改时间",
              prop: "updateTime",
              rules: [{
                required: true,
                message: "请输入修改时间",
                trigger: "blur"
              }]
            },
            {
              label: "状态",
              prop: "status",
              rules: [{
                required: true,
                message: "请输入状态",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.productinfo_add, false),
          viewBtn: this.vaildData(this.permission.productinfo_view, false),
          delBtn: this.vaildData(this.permission.productinfo_delete, false),
          editBtn: this.vaildData(this.permission.productinfo_edit, false)
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
