<template>
  <div class="customer">
    <el-dialog :title="!dialogType ? '新增客户' : '修改客户'" :visible="dialogFormVisible" width="45%" @close="hideDialog" center>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="form.name" autocomplete="off" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式：" prop="phone">
              <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="省市区：" prop="address">
              <el-cascader :options="cityData" v-model="form.address" clearable class="w-100"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址：" prop="detailAddress">
              <el-input v-model="form.detailAddress" autocomplete="off" maxlength="30" show-word-limit></el-input>
            </el-form-item>
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
import city from '../../global/city.js';
export default {
  data: function() {
    return {
      form: {
        name: '',
        phone: '',
        address: ['340000', '340200', '340225'],
        detailAddress: '',
        photo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        address: [{ required: true, message: '请选择省区市', trigger: 'change' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    };
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    dialogFormVisible: {
      handler(val) {
        this.form = {
          name: '',
          phone: '',
          address: ['340000', '340200', '340225'],
          detailAddress: '',
          photo: ''
        };
        if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        if (this.dialogType && val) {
          Object.keys(this.form).map(r => {
            this.form[r] = r === 'address' ? this.editData[r].split(',') : this.editData[r];
          });
        }
      }
    }
  },
  methods: {
    hideDialog(type = false) {
      this.$emit('dialog', type);
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return;
        let location = this.dialogType ? '/editCust' : '/addCust';
        this.$post(location, Object.assign({}, this.form, { address: this.form.address.join(','), id: this.editData.id || 0 })).then((r, data = r.data) => {
          this.$notify({
            title: this.dialogType ? '修改成功' : '新增成功',
            message: data.message,
            type: 'success'
          });
          this.hideDialog(true);
        });
      });
    }
  },
  computed: {
    cityData() {
      return city || [];
    }
  },
  mounted() {}
};
</script>
<style lang="stylus" scoped></style>