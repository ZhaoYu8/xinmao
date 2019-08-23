<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input
                        v-model="param.username"
                        prefix-icon="el-icon-mobile-phone"
                        placeholder="手机号"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-lock"
                        placeholder="密码"
                        v-model="param.password"
                        :show-password="true"
                        @keyup.enter.native="submitForm()"
                    ></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 使用请联系作者。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '13370229059',
                password: '3213213'
            },
            rules: {
                username: [{ validator: this.validatePass, required: true, message: '请输入手机号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (!valid) return;
                this.$post('login', this.param).then((r, data = r.data) => {
                    if (data.success) {
                        this.$message.success('登录成功');
                        localStorage.setItem('ms_username', this.param.username);
                        this.$router.push('/');
                    } else {
                        console.log(data.message);
                        this.$confirm(data.message, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$post('register', this.param).then((r, data = r.data) => {
                                this.$message({
                                    type: 'success',
                                    message: '成功!'
                                });
                            });
                        });
                    }
                });
            });
        }
    }
};
</script>
<style lang="stylus" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/img/login-bg.jpg');
  background-size: 100%;

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;

    .ms-title {
      width: 100%;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      border-bottom: 1px solid #ddd;
    }

    .ms-content {
      padding: 30px 30px;

      .login-btn {
        text-align: center;

        button {
          width: 100%;
          height: 36px;
          margin-bottom: 10px;
        }
      }
    }

    .login-tips {
      font-size: 12px;
      line-height: 30px;
      color: #fff;
    }
  }
}
</style>