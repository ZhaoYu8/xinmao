<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="ms-login" label-width="0px" class="ms-content" v-show="tiggle">
        <el-form-item prop="username">
          <el-input v-model="param.username" prefix-icon="el-icon-mobile-phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" placeholder="密码" v-model="param.password" :show-password="true" @keyup.enter.native="submitForm()"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <div>
          <el-checkbox v-model="checked" @change="checkedFun">记住密码</el-checkbox>
        </div>
        <p class="login-tips">Tips : 使用遇到问题，请联系作者。13370229059</p>
      </el-form>

      <el-form :model="register" :rules="registerRules" ref="register" label-width="0px" class="ms-content" v-show="!tiggle">
        <el-form-item prop="name">
          <el-input v-model="register.name" prefix-icon="el-icon-office-building" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="register.phone" prefix-icon="el-icon-mobile-phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" placeholder="密码" v-model="register.password" :show-password="true" @keyup.enter.native="submitForm()"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input prefix-icon="el-icon-star-off" placeholder="4位数确认码，如不知晓，请联系作者" v-model="register.code" @keyup.enter.native="submitForm()"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitRegister()">注册</el-button>
        </div>
        <p class="login-tips">Tips : 使用遇到问题，请联系作者。13370229059</p>
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
      register: {
        name: '',
        phone: '',
        password: '',
        code: ''
      },
      tiggle: true,
      rules: {
        username: [{ validator: this.validatePass, required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      registerRules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        phone: [{ validator: this.validatePass, required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 20, message: '最少6位数', trigger: 'blur' }],
        code: [{ required: true, message: '请输入确认码', trigger: 'blur' }, { min: 4, max: 4, message: '确认码为4位数字', trigger: 'blur' }]
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
      this.$refs['ms-login'].validate(valid => {
        if (!valid) return;
        this.$post('login', this.param)
          .then((r, data = r.data) => {
            if (data.success) {
              this.loginSuccess(data);
            } else {
              if (data.errorType === 2) {
                localStorage.setItem('token', '');
                this.tiggle = false;
                this.register.phone = this.param.username;
                this.register.password = this.param.password;
                this.$notify({
                  title: '提示',
                  message: data.message,
                  type: 'warning'
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
    },
    submitRegister() {
      this.$refs['register'].validate(valid => {
        if (!valid) return;
        if (this.register.code !== '7896') {
          this.$notify({
            title: '提示',
            message: '确认码不正确，如不知晓，请联系作者!',
            type: 'error'
          });
          return;
        }
        this.$post('register', this.register)
          .then((r, data = r.data) => {
            if (data.success) {
              this.loginSuccess(data);
            } else {
              if (data.errorType === 2) {
                localStorage.setItem('token', '');
                this.tiggle = false;
                this.$notify({
                  title: '提示',
                  message: data.message,
                  type: 'warning'
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