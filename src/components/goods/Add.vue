<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--信息提示-->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--表单验证不能放在tabs和tab之间-->
      <el-form
        :model="addFrom"
        :rules="addFormRules"
        ref="ruleFormRef"
        label-width="100px"
        label-position="top"
      >
        <!--tab栏-->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!--复选框-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeIndex: '0', // tab和步骤条
      // 添加商品的表单数据对象
      addFrom: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [] // 图片数组
      },
      // 表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: '输入名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '输入价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '输入重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '输入数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '选择分类', trigger: 'blur' }
        ]
      },
      catelist: [], // 商品分类列表
      // 级联选择器的属性
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [], // 动态参数列表
      onlyTableData: [], // 静态属性列表
      uploadURL: 'http://152.136.139.149:8888/api/private/v1/upload', // 上传图片的url地址
      // 图片上传的header
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: ''// 图片预览地址

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有分类列表
    async getCateList () {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.catelist = result.data
      this.$message.success(result.meta.msg)
    },
    // 级联选择器变化
    handleChange () {

    },
    // 标签页切换
    beforeTabLeave (activeName, oldActiveName) {
      let changeTab = false
      this.$refs.ruleFormRef.validate(valid => {
        changeTab = valid
      })
      return changeTab
    },
    async tabClicked () {
      // 商品属性，动态参数
      if (this.activeIndex === '1') {
        const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0
            ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = result.data
      } else if (this.activeIndex === '2') {
        const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.onlyTableData = result.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url.replace('127.0.0.1', '152.136.139.149')
      console.log(this.previewPath)
    },
    // 处理移除图片的操作
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addFrom.pics.findIndex(x => x.pic === filePath)
      this.addFrom.pics.splice(i, 1)
    },
    // 图片上传成功的钩子
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addFrom.pics.push(picInfo)
    }
  },
  computed: {
    cateId () {
      return this.addFrom.goods_cat[2]
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
