<template>
  <div class="addproject">
    <el-dialog :title="!dialogType ? '新增员工' : '修改员工'" :visible="dialogFormVisible" width="45%" center @close="hideDialog" :close-on-click-modal="false">
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
            <el-form-item label="地址：" prop="location">
              <el-input v-model="form.location" autocomplete="off" show-word-limit placeholder="地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="form.sex" show-word-limit placeholder="性别">
                <el-option v-for="item in [{value: 1, label: '男'}, {value: 0, label: '女'}]" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位：" prop="position">
              <el-select v-model="form.position" show-word-limit placeholder="职位"></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否显示销售：" prop="sales">
              <el-switch v-model="form.sales" active-text="显示" inactive-text="隐藏"> </el-switch>
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
import http from '../../global/http.js';
export default {
  data: function() {
    return {
      form: {
        name: '',
        branch: [],
        phone: '',
        location: '',
        sex: 1,
        position: [],
        sales: true
      },
      rules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        branch: [{ required: true, message: '请选择部门', trigger: 'blur' }]
      }
    };
  },
  props: {
    dialogFormVisible: {
      // 控制dialog显示隐藏
      type: Boolean,
      default: false
    },
    dialogType: {
      // false 新增 true 修改
      type: Boolean,
      default: false
    },
    editData: {
      // 修改传过来的数据
      type: Object,
      default: {}
    },
    treeData: {
      // 产品分类的数据
      type: Array,
      default: []
    }
  },
  watch: {
    dialogFormVisible: {
      handler(val) {
        this.form = {
          name: '',
          branch: [],
          phone: '',
          location: '',
          sex: true,
          position: [],
          sales: true
        };
        if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        if (this.dialogType && val) {
          Object.keys(this.form).map(r => {
            this.form[r] = r === 'branch' ? this.editData[r].split(',').map(r => Number(r)) : this.editData[r];
          });
        }
      }
    }
  },
  methods: {
    // 点击上传文件的事件
    uploadChange(file, e) {
      const format = ['image/jpeg', 'image/png'].includes(file.raw.type);
      const size = file.size / 1024 < 500;
      if (!format) {
        this.$message.error('产品图片只能是 JPG,PNG 格式!');
        this.$refs.upload.handleRemove(file);
        return;
      }
      if (!size) {
        this.$message.error('产品图片大小不能超过 500kb!');
        this.$refs.upload.handleRemove(file);
        return;
      }
    },
    hideDialog(type = false) {
      this.$emit('dialog', type);
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return;
        let location = this.dialogType ? '/editProject' : '/addProject';
        let data = Object.assign({}, this.form, {
          id: this.editData.id || 0
        });
        this.$post(location, data).then((r, data = r.data) => {
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
  mounted() {},
  computed: {
    gethttp() {
      return http || [];
    }
  }
};
</script>
<style lang="stylus" scoped></style>