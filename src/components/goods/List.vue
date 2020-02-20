<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="searchGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--表格数据-->
      <el-table :data="goodslist" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="价格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template v-slot="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

  </div>
</template>
<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [], // 商品列表
      total: 0// 总条数
    }
  },
  created () {
    this.getGodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGodsList () {
      const { data: result } = await this.$http.get(`goods`, { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.goodslist = result.data.goods
      this.total = result.data.total
    },
    // 每页显示数量改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGodsList()
    },
    // 当前页改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGodsList()
    },
    // 搜索商品
    searchGoodsList () {
      this.queryInfo.pagenum = 1
      this.getGodsList()
    },
    // 删除商品
    async removeById (id) {
      const confirmResult = await this.$confirm('删除商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除')
      const { data: result } = await this.$http.delete(`goods/${id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.getGodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }

  }

}
</script>
<style lang="stylus" scoped></style>
