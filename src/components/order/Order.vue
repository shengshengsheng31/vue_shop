<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索框-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column  label="订单编号"  prop="order_number"></el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: []

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: result } = await this.$http.get('orders', { params: this.queryInfo })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.total = result.data.total
      this.orderlist = result.data.goods
    }
  }
}
</script>
<style lang="stylus" scoped></style>
