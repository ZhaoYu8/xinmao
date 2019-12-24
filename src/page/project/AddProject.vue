<template>
  <div class="addproject">
    <el-dialog :title="!dialogType ? '新增产品' : '修改产品'" :visible="dialogFormVisible" width="60%" center @close="hideDialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称：" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="产品名称" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类：" prop="sort">
              <el-cascader v-model="form.sort" :options="treeData" :props="{ label: 'name', value: 'id', checkStrictly: true }">
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
            <el-form-item label="产品单位：" prop="units">
              <el-input v-model="form.units" autocomplete="off" placeholder="个/箱/件..." maxlength="15" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本：" prop="cost">
              <el-input v-model="form.cost" autocomplete="off" maxlength="15" show-word-limit placeholder="成本"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建议售价：" prop="price">
              <el-input v-model="form.price" autocomplete="off" maxlength="15" show-word-limit placeholder="建议售价"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类展示主图：" prop="sortNum">
              <el-input v-model="form.sortNum" autocomplete="off" show-word-limit placeholder="默认第一张图片为分类展示主图"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详情页轮播图：" prop="detailNum">
              <el-input v-model="form.detailNum" autocomplete="off" show-word-limit placeholder="默认第二张为主图，可自定义。例如：2,3,4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详情页图片：" prop="detailNumB">
              <el-input v-model="form.detailNumB" autocomplete="off" show-word-limit placeholder="默认第二张后的图片，都为详情页图片，可自定义。例如：2,3,4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="d-f">
          <div style="width:120px;">
            <el-form-item label="产品图片："> </el-form-item>
          </div>
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="gethttp.baseURL + '/uploadfiles'"
            :headers="headers"
            :on-remove="handleRemove"
            :multiple="true"
            :on-change="uploadChange"
            :file-list="fileList"
            list-type="picture"
            :limit="10"
            :on-success="handleAvatarSuccess"
            :on-exceed="
              () => {
                $alert('一个产品最多上传10张图片!', '提示');
              }
            "
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="$refs.upload.submit()">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
          </el-upload>
        </div>
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
        sort: [],
        units: '个',
        cost: 0,
        price: 0,
        sortNum: '',
        detailNum: '',
        detailNumB: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请选择产品分类', trigger: 'blur' }],
        sortNum: [{ validator: this.checkSortNum, trigger: 'blur' }]
      },
      fileList: [], // 修改展示的产品图片数据
      newFileList: [],
      checkSortNum: (rule, value, callback) => {
        if (value !== '') {
          callback(new Error('请再次输入密码'));
        } else {
          callback();
        }
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
          sort: [],
          units: '个',
          cost: 0,
          price: 0,
          sortNum: '',
          detailNum: '',
          detailNumB: ''
        };
        this.newFileList = [];
        if (this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
        this.fileList = [];
        if (this.dialogType && val) {
          Object.keys(this.form).map((r) => {
            this.form[r] = r === 'sort' ? this.editData[r].split(',').map((r) => Number(r)) : this.editData[r];
          });
          if (this.editData.photo.length) {
            this.fileList = this.editData.photo;
          }
        }
      }
    }
  },
  methods: {
    // 点击上传文件的事件
    uploadChange(file, e) {
      const format = ['image/jpeg', 'image/png'].includes(file.raw.type);
      const size = file.size / 1024 < 5 * 1024;
      if (!format) {
        this.$message.error('产品图片只能是 JPG,PNG 格式!');
        this.$refs.upload.handleRemove(file);
        return;
      }
      if (!size) {
        this.$message.error('产品图片不能大于5M!');
        this.$refs.upload.handleRemove(file);
        return;
      }
    },
    handleRemove(data, file) {
      if (data.id) {
        // 第一种情况，删除已经保存过的
        this.fileList = this.fileList.filter((r) => r.id !== data.id);
        if (this.newFileList.length) {
          this.fileList = this.fileList.concat(this.newFileList);
          this.newFileList = [];
        }
      } else {
        this.newFileList = file.filter((r) => !r.id);
      }
    },
    hideDialog(type = false) {
      this.$emit('dialog', type);
    },
    handleAvatarSuccess(data) {
      this.newFileList.push(data.file);
    },
    confirm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) return;
        let location = this.dialogType ? '/editProject' : '/addProject';
        let data = Object.assign({}, this.form, {
          id: this.editData.id || 0
        });
        data.photo = this.fileList.concat(this.newFileList || []);
        this.$post(location, data).then((r, data = r.data) => {
          if (data.success) {
            this.$notify({
              title: this.dialogType ? '修改成功' : '新增成功',
              message: data.message,
              type: 'success'
            });
            this.hideDialog(true);
          } else {
            this.$notify({
              title: this.dialogType ? '修改失败' : '新增失败',
              message: data.message,
              type: 'error'
            });
          }
        });
      });
    }
  },
  mounted() {},
  computed: {
    gethttp() {
      return http || [];
    },
    headers() {
      return { token: localStorage.getItem('token') };
    }
  }
};
</script>
<style lang="stylus">
.el-upload-list__item {
  min-width: 400px;
}
</style>
