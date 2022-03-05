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
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @refresh-change="refreshChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   @click="showModifyParametersVisible = true">新 增
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.template_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <download-excel
          :data   = "json_data"
          :fields = "json_fields"
          worksheet = "My Worksheet"
          :name    = "title">
          <el-button type="text"
                     size="small"
                     icon="el-icon-download"
          @click="updateTitle(scope.row)">模板导出
          </el-button>
        </download-excel>

      </template>
    </avue-crud>
    <el-dialog :visible.sync="showModifyParametersVisible" title="新增模板" center customClass="customWidth" :before-close="closeDialog">
       <el-form ref="modifyParametersForm" :inline="true" :model="modifyParametersForm" >
         <el-row>
           <el-form-item label='模板名:':rules="{
                required: true, message: '模板名称不能为空', trigger: 'blur'
            }">
             <el-input v-model="modifyParametersForm.templateName" placeholder="请输入模板名称" style="width: 80vh"></el-input>
           </el-form-item>
         </el-row>
         <el-form-item label='字段名1' prop="params[0].paramName" :rules="{
                required: true, message: '字段名不能为空', trigger: 'blur'
            }">
           <el-input v-model="modifyParametersForm.params[0].paramName"></el-input>
         </el-form-item>
         <el-form-item label='字段值1' prop="params[0].paramValue" :rules="{
               required: true, message: '字段值不能为空', trigger: 'blur'
           }">
           <el-input v-model="modifyParametersForm.params[0].paramValue"></el-input>
         </el-form-item>
         <el-form-item>
           <i class="el-icon-delete" style="visibility:hidden;"></i>
         </el-form-item>
         <!-- 动态增加项目 -->

         <div v-for="(item, index) in modifyParametersForm.params" v-if="index>=1" :key="index">
           <el-form-item :label="'字段名' + (index+1)" :prop="'params.' + index + '.paramName'" :rules="{
               required: true, message: '字段名不能为空', trigger: 'blur'
           }">

             <el-input v-model="item.paramName"></el-input>
           </el-form-item>
           <el-form-item :label="'字段值' + (index+1)" :prop="'params.' + index + '.paramValue'" :rules="{
               required: true, message: '字段值不能为空', trigger: 'blur'
           }">
             <el-input v-model="item.paramValue"></el-input>
           </el-form-item>

           <el-form-item>
             <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
           </el-form-item>
         </div>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitParameForm()">提交</el-button>
         <el-button @click="addItem">添加字段</el-button>
       </div>
     </el-dialog>
  </basic-container>
</template>
<script>
  import {getList, getDetail, add, update, remove} from "@/api/template/template";
  import {mapGetters} from "vuex";
  import Vue from 'vue'
  import JsonExcel from 'vue-json-excel'

  Vue.component('downloadExcel', JsonExcel)
  export default {
    data() {
      return {
        title:'',
        json_fields: {},
        json_data: [
          {
          },
        ],
        form: {},
        query: {},
        loading: true,
        showInput:'',
        showModifyParametersVisible:false,
        modifyParametersForm: {
          pvaId: '',
          templateName:'',
          params: [
            {
              "paramName": '',
              "paramValue": ''
             }
           ]
         },
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
          addBtn:false,
          editBtn:false,
          viewBtn:false,
          index: true,
          selection: true,
          column: [
            {
              label: "ID",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入ID",
                trigger: "blur"
              }],
              hide:true,
            },
            {
              label: "模板名称",
              prop: "templateName",
              rules: [{
                required: true,
                message: "请输入模板名称",
                trigger: "blur"
              }]
            },
            {
              label: "模板值",
              prop: "templateValue",
              rules: [{
                required: true,
                message: "请输入模板值",
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
          addBtn: this.vaildData(this.permission.template_add, false),
          viewBtn: this.vaildData(this.permission.template_view, false),
          delBtn: this.vaildData(this.permission.template_delete, false),
          editBtn: this.vaildData(this.permission.template_edit, false)
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
      updateTitle(row){
        const value = JSON.parse(row.templateValue);
        console.log(value);
        for(let i = 0; i<value.length; i++){
          const name = value[i].paramName;
          const paramValue = value[i].paramValue;
          this.$set(this.json_fields,name,paramValue);
          this.$set(this.json_data,paramValue,'');
        }
        this.title = row.templateName+".xls";
        console.log(this.json_fields);
      },
      addItem() {
        this.modifyParametersForm.params.push({
          paramName: '',
          paramValue: ''
        })
      },
      // 删除一组输入框
      deleteItem(item, index) {
        this.modifyParametersForm.params.splice(index, 1)
       },
       // 关闭批量修改参数表单
      closeDialog(){
        this.showModifyParametersVisible = false
        this.modifyParametersForm = {
          pvaId: '',
          params: [
            {
              "paramName": '',
              "paramValue": ''
            }
          ]
        }
      },
      // 提交批量修改入参表单
      submitParameForm() {
        this.$refs.modifyParametersForm.validate((valid) => {
          if (valid) {
            console.log(this.modifyParametersForm);
            const data = {};
            data.templateName = this.modifyParametersForm.templateName;
            data.templateValue = JSON.stringify(this.modifyParametersForm.params);
            add(data).then(() => {
              this.$message.success('新增成功！')
              // 提交后关闭弹窗，清空数据
              this.closeDialog();
              this.onLoad(this.page, this.query);
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
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
