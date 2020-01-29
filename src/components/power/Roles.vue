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
        <el-table-column type="expand" fixed>
          <template v-slot="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环渲染二级权限-->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
                >
                  <el-col :span="7">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeRoleById(scope.row.id)"
              >删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >分配权限</el-button>
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
      <!--分配权限对话框-->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <!--树形空间-->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
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
      },
      setRightDialogVisible: false, // 控制权限分配的对话框显示隐藏
      rightsList: [], // 所有权限的数据
      treeProps: { label: 'authName', children: 'children' }, // 树形空间绑定对象
      defKeys: [], // 默认选中的节点Id值数组
      roleId: ''// 即将分配角色的roleId
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
      const confirmResult = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: result } = await this.$http.delete('roles/' + id)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.getRolesList()
    },
    // 根据ID删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示确认删除
      const confirmResult = await this.$confirm('取消权限？', '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: result } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      role.children = result.data// 双向绑定到了scope
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.rightsList = result.data
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys中
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 如果当前node节点不包含children树形，则为三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭权限对话框时清空权限列表
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: result } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
      this.$message.success(result.meta.msg)
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
