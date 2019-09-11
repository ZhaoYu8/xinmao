<template>
  <div class="addorder">
    <el-row type="flex" justify="end" class="head">
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-row>
    <el-form ref="form" :model="form" :inline="true" class="box">
      <el-row type="flex" justify="space-around" :gutter="20">
        <el-col :span="6">
          <el-form-item label="客户名称: " prop="name">
            <el-select v-model="form.name" autocomplete="off" show-word-limit></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系方式：" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系方式：" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系方式：" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import city from '../../global/city.js';
export default {
  data: function() {
    return {
      form: []
    };
  },
  methods: {}
};
</script>
<style lang="stylus" scoped>
.addorder {
  height: inherit;
  background: #fff;
  border-radius: 5px;

  .head {
    padding: 10px 10px 10px 0;
    box-shadow: 0 2px 3px #dcdcdc;
    border-color: transparent;
  }

  .box {
    margin-top: 10px;
  }
}
</style>