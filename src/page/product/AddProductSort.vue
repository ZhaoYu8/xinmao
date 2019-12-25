<template>
  <div class="addproductsort">
    <el-dialog :title="!dialogType ? '新增产品分类' : '修改产品分类'" :visible="dialogFormVisible" width="30%" center @close="hideDialog">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="分类名称：" prop="name">
              <el-input v-model="form.name" autocomplete="off" maxlength="15" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="上级分类：" prop="parent">
              <el-cascader v-model="form.parent" :options="options" :props="{ label: 'name', value: 'id', checkStrictly: true }" class="w-100">
                <template slot-scope="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
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
export default {
  data: function() {
    return {
      form: {
        name: '',
        parent: '0'
      },
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]
      }
    };
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    dialogType: {
      // 新增还是修改
      type: Boolean,
      default: false
    },
    editData: {
      // 修改数据
      type: Object,
      default: {}
    },
    treeData: {
      type: Array,
      default: []
    }
  },
  watch: {
    dialogFormVisible: {
      handler(val) {
        this.form = {
          name: '',
          parent: '0'
        };
        if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        if (val) {
          this.form = {
            name: this.editData['name'] || '',
            parent: [0, '0', '', undefined].includes(this.editData['parent']) ? '0' : this.editData['parent']
          };
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
        if (Array.isArray(this.form.parent) && this.form.parent.length > 3) {
          this.$notify({
            title: '警告',
            message: '分类最多4个层级！',
            type: 'warning'
          });
          return;
        }
        if (this.dialogType && Array.isArray(this.form.parent) && this.form.parent.includes(this.editData.id)) {
          this.$notify({
            title: '警告',
            message: '修改分类，不能修改成自己，或者自己的下属！',
            type: 'warning'
          });
          return;
        }
        let location = this.dialogType ? '/editSort' : '/addSort';
        this.$post(
          location,
          Object.assign({}, this.form, { id: this.editData.id || 0, parent: Array.isArray(this.form.parent) ? this.form.parent[this.form.parent.length - 1] : this.form.parent })
        ).then((r, data = r.data) => {
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
    options() {
      let arr = JSON.parse(JSON.stringify(this.treeData));
      arr.unshift({ name: '无', id: '0' });
      return arr;
    }
  }
};
</script>
<style lang="stylus" scoped></style>