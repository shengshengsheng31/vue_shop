<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--添加角色-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand" fixed></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" min-width="120px"></el-table-column>
        <el-table-column label="操作" min-width="280px">
          <template v-slot="scope">
            <div class="btnOperate">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              >编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--添加角色的对话框-->
      <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改角色对话框-->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="70px">
          <el-form-item label="角色名称">
            <el-input v-model="editForm.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-fotter">
          <el-button @click="editDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="editUserInfo">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      rolelist: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: { roleName: '', roleDesc: '' },
      editForm: {},
      addFormRules: {
        roleName: [
          { required: true, message: '输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度不符合', trigger: 'blur' }
        ],
        roleDesc: [{ max: 50, message: '长度过长', trigger: 'blur' }]
      },
      editFormRules: {
        roleDesc: [{ max: 50, message: '长度过长', trigger: 'blur' }]
      }

    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) { return this.$message.error(result.meta.msg) }
      this.rolelist = result.data
    },
    // 添加用户的对话框关闭时重置表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('roles', this.addForm)
        if (result.meta.status !== 201) { return this.$message.error(result.meta.msg) }
        this.$message.success(result.meta.msg)
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 关闭编辑角色的对话框重置验证状态
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑按钮展示角色编辑对话框
    async showEditDialog (id) {
      const { data: result } = await this.$http.get('roles/' + id)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.editForm = result.data
      this.editDialogVisible = true
    },
    // 修改角色信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
        if (result.meta.status === 200) return this.$message.error(result.meta.msg)
        this.editDialogVisible = false
        this.getRolesList()
        this.$message.success('更新成功')
      })
    },
    // 根据ID删除角色
    async removeRoleById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示', { confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: result } = await this.$http.delete('roles/' + id)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.getRolesList()
    }
  }
}
</script>
<style lang="stylus" scoped></style>
