<template>
  <div class="addproject">
    <el-dialog :title="dialogType ? '新增员工' : '修改员工'" :visible="dialogShow" width="45%" center @close="hideDialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="姓名" maxlength="15" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门：" prop="branch">
              <el-cascader v-model="form.branch" :options="treeData" :props="{ label: 'name', value: 'id', checkStrictly: true }" class="w-100">
                <template slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="form.phone" autocomplete="off" placeholder="手机号" maxlength="15" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="form.sex" show-word-limit placeholder="性别" class="w-100">
                <el-option
                  v-for="item in [
                    { value: 1, label: '男' },
                    { value: 0, label: '女' }
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
              <el-input v-model="form.detailAddress" autocomplete="off" show-word-limit placeholder="详细地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否显示销售：" prop="sales">
              <el-switch v-model="form.sales" active-text="显示" inactive-text="隐藏"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="职位：" prop="position">
              <el-select v-model="form.position" show-word-limit placeholder="职位"></el-select>
            </el-form-item> -->
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
      dialogShow: false,
      dialogType: true, // true 新增 false 修改
      editData: {},
      form: {
        name: '',
        branch: [],
        phone: '',
        address: ['340000', '340200', '340225'],
        detailAddress: '',
        sex: 1,
        position: [],
        sales: true
      },
      rules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        branch: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        address: [{ required: true, message: '请选择省区市', trigger: 'change' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    };
  },
  props: {
    treeData: {
      // 产品分类的数据
      type: Array,
      default: []
    }
  },
  watch: {},
  methods: {
    hideDialog(type = false) {
      this.dialogShow = false;
      this.$refs['ruleForm'].resetFields();
      this.$emit('dialog', type);
    },
    confirm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) return;
        let location = this.dialogType ? '/addUser' : '/editUser';
        let data = Object.assign({}, this.form, {
          id: this.editData.id || 0
        });
        this.$post(location, data).then((r, data = r.data) => {
          this.$notify({
            title: this.dialogType ? '新增成功' : '修改成功',
            message: data.message,
            type: 'success'
          });
          this.hideDialog(true);
        });
      });
    }
  },
  mounted() {
    this.bus.$on('dialogUser', (type, data = {}) => {
      this.dialogShow = true;
      this.dialogType = type;
      if (!type) {
        this.editData = data;
        this.form = { ...this.form, ...this.editData };
        Object.assign(this.form, { sales: data.sales ? true : false, branch: data.branch.split(',').map((r) => Number(r)), address: (data.address && data.address.split(',')) || '' });
      }
    });
  },
  computed: {
    cityData() {
      return city || [];
    }
  }
};
</script>
<style lang="stylus" scoped></style>
