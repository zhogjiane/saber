<template>
  <div>
    <basic-container>
      <third-register></third-register>
    </basic-container>
    <el-col :span="16">
      <basic-container>
      </basic-container>
    </el-col>
    <el-col :span="8">
      <el-row>
        <basic-container>
          <div class="el-font-size">
          </div>
        </basic-container>
      </el-row>
      <el-row>
        <basic-container>
          <el-collapse v-model="logActiveNames" @change="handleChange">
            <el-collapse-item title="2.8.0发布 增加在线报表模块" name="21">
            </el-collapse-item>
          </el-collapse>
        </basic-container>
      </el-row>
    </el-col>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "wel",
    data() {
      return {
        activeNames: ['1', '2', '3', '5'],
        logActiveNames: ['27']
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    created() {
    },
    methods: {
      handleChange(val) {
        console.log(val);
      }
    }
  };
</script>

<style>
  .el-divider--horizontal {
    margin: 12px 0 !important;
  }

  .el-font-size {
    font-size: 14px;
  }
</style>

