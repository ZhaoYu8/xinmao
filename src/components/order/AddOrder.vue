<template>
  <div class="addorder">
    <el-container>
      <!-- 头部按钮 -->
      <el-header class="p-0">
        <el-card shadow="hover" :body-style="{ padding: '10px' }" class="head">
          <el-row type="flex" justify="end">
            <el-button type="primary">保存</el-button>
            <el-button>取消</el-button>
          </el-row>
        </el-card>
      </el-header>
      <el-main class="main">
        <!-- 客户基础信息 -->
        <el-divider class="el-icon-s-custom"> <i class="el-icon-s-custom">基础信息</i></el-divider>
        <el-form ref="form" :model="form" :inline="true" class="box">
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="客户名称: " prop="name">
                <el-select v-model="form.name" autocomplete="off" show-word-limit></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="联系方式：" prop="phone">
                <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="客户地址：" prop="phone">
                <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="销售：" prop="phone">
                <el-select v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="配送方式: " prop="name">
                <el-radio-group v-model="form.radio">
                  <el-radio :label="1">送货上门</el-radio>
                  <el-radio :label="2">快递</el-radio>
                  <el-radio :label="3">部分送货+快递</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="配送地址：" prop="phone">
                <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f" v-show="[2, 3].includes(form.radio)">
              <el-form-item label="快递单号：" prop="phone">
                <el-input v-model="form.phone" autocomplete="off" maxlength="15" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 分割线产品清单 -->
        <el-divider class="el-icon-s-custom"><i class="el-icon-s-claim">产品清单</i></el-divider>
        <el-row class="d-f goods">
          <i class="el-icon-menu c-p mr-10" @click="controlDialog"></i>
          <i class="el-icon-remove-outline c-p"></i>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" max-height="300">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="产品名称"></el-table-column>
          <el-table-column label="产品分类">
            <template slot-scope="scope">
              <span>{{ sortStrig(scope.row.sort) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="units" label="单位"></el-table-column>
          <el-table-column prop="cost" label="成本"></el-table-column>
          <el-table-column prop="price" label="单价"></el-table-column>
          <el-table-column label="产品图片">
            <template slot-scope="scope">
              <div class="d-f a-i-c j-c-s-a">
                <el-image
                  v-if="scope.row.photo && scope.row.photo.length"
                  style="width: 50px; height: 50px"
                  :src="scope.row.photo[0].url"
                  :preview-src-list="scope.row.photo.map(r => r.url)"
                >
                </el-image>
                <img v-else style="width: 50px; height: 50px" src="../../assets/img/img.jpg" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 分割线选择产品 -->
    <el-dialog title="选择产品" :visible="dialogProjectTable" @close="dialogClose" center>
      <el-table :data="dialog.dialogData">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column label="产品分类">
          <template slot-scope="scope">
            <span>{{ sortStrig(scope.row.sort) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="units" label="单位"></el-table-column>
        <el-table-column prop="cost" label="成本"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column label="产品图片">
          <template slot-scope="scope">
            <div class="d-f a-i-c j-c-s-a">
              <el-image
                v-if="scope.row.photo && scope.row.photo.length"
                style="width: 30px; height: 30px"
                :src="scope.row.photo[0].url"
                :preview-src-list="scope.row.photo.map(r => r.url)"
              >
              </el-image>
              <img v-else style="width: 30px; height: 30px" src="../../assets/img/img.jpg" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      form: {
        radio: 1
      },
      tableData: [], // 已选产品
      dialogTotalCount: 0,
      dialog:{
        form: {
          pageIndex: 1,
          pageSize: 10,
          value: ''
        },
        dialogData: [] // 选择产品
      },
      dialogProjectTable: false // 控制选择产品table显示隐藏
    };
  },
  methods: {
    dialogClose() {
      this.dialogProjectTable = false;
    },
    dialogConfirm() {
      this.dialogProjectTable = false;
    },
    controlDialog() {
      this.dialogProjectTable = true;
      this.$post('queryProject', Object.assign({}, this.dialog.form )).then((r, data = r.data) => {
        this.dialog.dialogData = data.item;
        this.totalCount = data.totalCount;
      });
    },
    sortStrig(v) {
      return '';
      // 根据id返回name
      let arr = v.split(',');
      if (arr.length > 1) {
        return arr
          .map(r => {
            let text = this.rawTreeData.filter(n => n.id === Number(r))[0];
            return (text && text.name) || '';
          })
          .join('/');
      } else {
        let text = this.rawTreeData.filter(n => n.id === Number(arr[0]))[0];
        return (text && text.name) || '';
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.addorder {
  height: inherit;
  background: #fff;
  border-radius: 5px;

  .head {
    background: #f0f8ff;
  }

  .main {
    .box {
      margin-top: 10px;
    }

    .goods {
      i {
        font-size: 25px;
        margin-bottom: 15px;
        color: #2d8cf0;
        transition: color 0.15s linear;

        &:hover {
          color: #5cb6ff;
        }
      }
    }
  }
}
</style>