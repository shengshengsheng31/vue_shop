<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--头部警告-->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!--选择商品分类-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--级联选择框-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--tab 页签-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!--循环渲染tag标签-->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!--新增标签-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" min-width="180px">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!--循环渲染tag标签-->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!--新增标签-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" min-width="180px">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数对话框-->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      catelist: [], // 商品分类列表
      // 级联选择框
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [], // 级联选择框双向绑定
      activeName: 'many', // 被激活的页签
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态属性数据
      addDialogVisible: false, // 控制添加对话框
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数表单规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 控制修改对话框
      // 修改参数的表单数据对象
      editForm: {
      },
      // 修改参数表单规则
      editFormRules: {
        attr_name: [
          { required: true, message: '输入参数名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList () {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.catelist = result.data
    },
    // 级联选择框选中项变化
    handleChange () {
      this.getParamsData()
    },
    // 页签选择
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData () {
      // 选中三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      // 将字符串转为数组
      result.data.forEach(item => {
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(',') : []
        // 控制文本款的显示与隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = result.data
      } else {
        this.onlyTableData = result.data
      }
    },
    // 添加对话框的关闭
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 确定按钮添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
        this.addDialogVisible = false
        this.getParamsData()
        this.$message.success(result.meta.msg)
      })
    },
    // 点击按钮展示修改对话框
    async showEditDialog (attrId) {
      const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { attr_sel: this.activeName })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.editForm = result.data
      this.editDialogVisible = true
    },
    // 修改对话框关闭
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改按钮修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.editDialogVisible = false
        this.getParamsData()
        this.$message.success(result.meta.msg)
      })
    },
    // 根据id删除参数
    async removeParams (attrId) {
      const confirmResult = await this.$confirm('删除数据?', '提示',
        { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消操作')
      const { data: result } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.getParamsData()
      this.$message.success(result.meta.msg)
    },
    // tag文本框失去焦点或按下回车
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) return// 保证在回车时不新增空tag
      row.inputValue = row.inputValue.trim()
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 对attr_vals的操作保存到数据库
    async saveAttrVals (row) {
      const { data: result } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
    },
    // tag点击按钮展示输入框
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获得焦点
      // $nextTick当页面上元素被重新渲染后才会执行指定代码，直接执行则会出现获取不到的情况
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 按钮被禁用的状态
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) { return true }
      return false
    },
    // 当前选中的三级ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText () {
      if (this.activeName === 'many') { return '动态参数' }
      return '静态属性'
    }
  }
}
</script>
<style lang="stylus" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px;
}
</style>
