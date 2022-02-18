export default {
  tabs: true,
  tabsActive: 1,
  group: [
    {
      label: '个人信息',
      prop: 'info',
      printBtn:true,
      mockBtn:true,
      column: [{
        label: '头像',
        type: 'upload',
        listType: 'picture-img',
        propsHttp: {
          res: 'data',
          url: 'link',
        },
        canvasOption: {
          text: 'blade',
          ratio: 0.1
        },
        action: '/api/blade-resource/oss/endpoint/put-file',
        tip: '只能上传jpg/png用户头像，且不超过500kb',
        span: 12,
        row: true,
        prop: 'avatar'
      }, {
        label: '姓名',
        span: 12,
        prop: 'name',
        rules: [{
          required: true,
          message: "请选择岗位类型",
          trigger: "blur"
        }]
      }, {
        label: '用户名',
        span: 12,
        prop: 'realName'
      },{
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
        }]
      },{
        label: '实习公司',
        span: 12,
        prop: 'companyName',
        rules: [{
          required: true,
          message: "请输入实习公司",
          trigger: "blur"
        }]
      },{
        label: '实习地址',
        span: 12,
        prop: 'companyAddress',
        rules: [{
          required: true,
          message: "请输入实习地址",
          trigger: "blur"
        }]
      },{
        label: '角色',
        span: 12,
        prop: 'roleName',
        disabled: 'true',
      },{
        label: '所属教师',
        span: 12,
        prop: 'deptName',
        disabled: 'true',
      }, {
        label: '手机号',
        span: 12,
        prop: 'phone',
        rules: [{
          required: true,
          message: "请输入手机号",
          trigger: "blur"
        }]
      }, {
        label: '邮箱',
        prop: 'email',
        span: 12,
        rules: [{
          required: true,
          message: "请选择岗位类型",
          trigger: "blur"
        }]
      }]
    },
    {
      label: '修改密码',
      prop: 'password',
      column: [{
        label: '原密码',
        span: 12,
        row: true,
        type: 'password',
        prop: 'oldPassword'
      }, {
        label: '新密码',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword'
      }, {
        label: '确认密码',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword1'
      }]
    }
  ],
}
