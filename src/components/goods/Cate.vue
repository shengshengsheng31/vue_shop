<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!--是否有效-->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!--排序-->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template v-slot:opt="scope">
          <div class="btnOperate">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditCateDialog(scope.row)"
            >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row)">删除</el-button>
          </div>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--对话框_添加分类-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!--添加分类的表单-->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--级联选择-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--对话框_修改分类-->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        ref="editCateFormRef"
        :rules="editCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-fotter">
        <el-button @click="editCateDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editCate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addCateDialogVisible: false, // 对话框_添加分类
      editCateDialogVisible: false, // 对话框_修改分类
      parentCateList: [], // 父级分类列表
      selectedKeys: [], // 选中的父级分类ID数组
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [], // 商品分类的数据列表
      total: 0, // 总数据条数
      // 为table指定列
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的表单规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '输入分类名称', tigger: 'blur' }
        ]
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 修改分类的表单数据对象
      editCateForm: {
        cat_id: '',
        cat_name: ''
      },
      // 修改分类的表单规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: '输入分类名称', tigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: result } = await this.$http.get('categories', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.catelist = result.data.result
      this.total = result.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: result } = await this.$http.get('categories', { params: { type: 2 } })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.parentCateList = result.data
    },
    // 监听级联选择变化
    parentCateChanged () {
      // 判断是否选择了父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    // 确定添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('categories', this.addCateForm)
        if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
        this.addCateDialogVisible = false
        this.getCateList()
        this.$message.success(result.meta.msg)
      })
    },
    // 监听添加分类对话框关闭，重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 显示编辑分类对话框
    async showEditCateDialog (cateInfo) {
      const { data: result } = await this.$http.get(`categories/${cateInfo.cat_id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.editCateForm.cat_id = result.data.cat_id
      this.editCateForm.cat_name = result.data.cat_name
      this.editCateDialogVisible = true
    },
    // 确定修改分类
    editCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, { cat_name: this.editCateForm.cat_name })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.getCateList()
        this.editCateDialogVisible = false
        this.$message.success(result.meta.msg)
      })
    },
    // 监听修改分类对话框关闭，重置表单
    editCateDialogClosed () {},
    // 删除分类
    async removeCate (data) {
      const confirmResult = await this.$confirm('删除' + data.cat_name + '?', '提示', { confirmButtonText: '确定', cancelButton: '取消', type: 'warning' }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: result } = await this.$http.delete(`categories/${data.cat_id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.getCateList()
      this.$message.success(result.meta.msg)
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-cascader {
  width: 100%;
}
</style>
