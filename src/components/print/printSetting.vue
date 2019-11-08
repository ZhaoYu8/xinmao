<template>
  <div class="printSetting">
    <el-dialog title="打印设置" :visible="dialogFormVisible" width="60%" @close="hideDialog" center>
      <el-form :model="form" ref="ruleForm" label-width="150px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="公司地址：">
              <el-input v-model="form.address" autocomplete="off" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系人：">
              <el-input v-model="form.name" autocomplete="off" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" v-for="(item, index) in phone" :key="index">
            <el-form-item label="手机号/电话：">
              <el-input v-model="item.num" autocomplete="off" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="height:40px;" class="d-f a-i-c j-c-c c-pblue c-p" v-if="phone.length === 1">
            <i class="el-icon-circle-plus-outline f-28" @click="addPhone"></i>
          </el-col>
          <el-col :span="2" style="height:40px;" class="d-f a-i-c j-c-c c-pblue c-p" v-if="phone.length === 2">
            <i class="el-icon-remove-outline f-28" @click="delPhone"></i>
          </el-col>
        </el-row>

        <el-row v-for="(item, index) in gathering" :key="index">
          <el-col :span="11">
            <el-form-item label="银行：">
              <el-input v-model="item.bank" autocomplete="off" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="账号：">
              <el-input v-model="item.account" autocomplete="off" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="height:40px;" class="d-f a-i-c j-c-c c-pblue c-p" v-if="index === 0">
            <i class="el-icon-circle-plus-outline f-28" @click="add"></i>
          </el-col>
          <el-col :span="2" style="height:40px;" class="d-f a-i-c j-c-c c-pblue c-p" v-if="index !== 0">
            <i class="el-icon-remove-outline f-28" @click="del(index)"></i>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否显示客户地址："><el-switch v-model="form.isCustAddress" active-color="#13ce66" inactive-color="#ff4949"> </el-switch> </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否显示二维码："><el-switch v-model="form.isQrcode" active-color="#13ce66" inactive-color="#ff4949"> </el-switch> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        address: '',
        name: '',
        isCustAddress: false,
        isQrcode: false
      },
      phone: [{ num: '' }],
      gathering: [{ bank: '', account: '' }],
      printData: {},
      confirmError: [
        { id: 'address', data: 'form', message: '公司地址不能为空！' },
        { id: 'name', data: 'form', message: '联系人不能为空！' },
        { id: 'num', data: 'phone', type: 'arr', message: '手机号/电话不能为空！' },
        { id: 'bank', data: 'gathering', type: 'arr', message: '银行不能为空！' },
        { id: 'account', data: 'gathering', type: 'arr', message: '账号不能为空！' }
      ]
    };
  },
  methods: {
    hideDialog() {
      this.dialogFormVisible = false;
    },
    add() {
      if (this.gathering.length === 4) {
        this.$notify({
          title: '警告',
          message: '最多添加4条',
          type: 'warning'
        });
        return;
      }
      this.gathering.push({ bank: '', account: '' });
    },
    del(i) {
      this.gathering.splice(i, 1);
    },
    addPhone() {
      this.phone.push({ num: '' });
    },
    delPhone() {
      this.phone.splice(1, 1);
    },
    confirm() {
      let error = false;
      let that = this;
      let message = '';
      this.$global.each(this.confirmError, (key, val) => {
        if (val.type === 'arr') {
          // 如果是数组
          this.$global.each(that[val.data], (i, v) => {
            if (!v[val.id] && !error) {
              error = true;
              message = `第${i + 1}个` + val.message;
              return false;
            }
          });
        } else if (!that[val.data][val.id] && !error) {
          error = true;
          message = val.message;
          return false;
        }
      });
      if (error) {
        this.$notify.error({
          title: '错误信息提示！',
          message: message
        });
        return false;
      }
      this.$notify({
        title: 'yes'
      });
    },
    async httpPrintData() {
      let data = await this.$post('queryPrint', Object.assign({}));
    }
  },
  computed: {},
  mounted() {
    this.bus.$on('printSetting', data => {
      this.dialogFormVisible = true;
      this.httpPrintData();
    });
  }
};
</script>
<style lang="stylus" scoped></style>