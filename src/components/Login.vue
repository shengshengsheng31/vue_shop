<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="logo" />
      </div>
      <!--登录表单-->
      <el-form class="login_form">
        <el-form-item>
          <el-input placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btnStyle">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btnStyle {
    // 弹性布局
    display: flex;
    justify-content: center;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    // 指定宽度和高度（最小/最大属性）确定元素边框
    box-sizing: border-box;
  }
}
</style>
