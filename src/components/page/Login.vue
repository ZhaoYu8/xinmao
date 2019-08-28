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
                <div>
                    <el-checkbox v-model="checked" @change="checkedFun">记住密码</el-checkbox>
                </div>
                <p class="login-tips">Tips : 使用请联系作者。13370229059</p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ validator: this.validatePass, required: true, message: '请输入手机号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            checked: false
        };
    },
    mounted() {
        let ms_username = localStorage.getItem('ms_username');
        if (ms_username) {
            this.param.username = ms_username;
        }
        if (this.$global.getCookie('checked')) {
            this.checked = true;
            this.param.password = this.$global.getCookie('password');
        }
    },
    methods: {
        checkedFun(val) {
            if (!val) return;
            this.$message({
                showClose: true,
                message: '记住密码时效7天，到期需要重新登录！'
            });
        },
        validatePass(rule, value, callback) {
            // 自定义验证
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        },
        loginSuccess(data) {
            // 登录成功调用方法
            localStorage.setItem('ms_username', this.param.username);
            this.$message.success('登录成功');
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('token_exp', new Date().getTime());
            }
            if (this.checked && !this.$global.getCookie('checked')) {
                // 记住密码功能 并且cookie里记住密码已经失效了，不然每次登陆都会重新创建覆盖老的。
                let date = new Date();
                date.setTime(date.getTime() + 60 * 1000 * 60 * 24 * 7); //过期时间 7天
                document.cookie = `checked=true;expires=${date.toGMTString()}`;
                document.cookie = `password=${this.param.password};expires=${date.toGMTString()}`;
            }
            this.$router.push('/');
        },
        submitForm() {
            // 点击登陆
            this.$refs.login.validate(valid => {
                if (!valid) return;
                this.$post('login', this.param)
                    .then((r, data = r.data) => {
                        if (data.success) {
                            this.loginSuccess(data);
                        } else {
                            if (data.errorType === 2) {
                                // 是未注册过的
                                this.$confirm(data.message, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$post('register', this.param).then((r, data = r.data) => {
                                        this.loginSuccess(data);
                                    });
                                });
                            } else {
                                this.$alert(data.message, '提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning'
                                });
                            }
                        }
                    })
                    .catch(data => {
                        console.log(data);
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