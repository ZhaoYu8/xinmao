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
      <el-button size="small">已选{{ dialog.changeDataNum }}</el-button>
      <el-table :data="dialog.dialogData" max-height="350" @select="dialogChange" ref="dialogTable">
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
      <div class="mt-20">
        <el-pagination
          background
          @current-change="dialogCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="dialog.totalCount"
          :current-page="dialog.form.pageIndex"
          :page-size="dialog.form.pageSize"
        ></el-pagination>
      </div>
      <div slot="footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  data: function() {
    return {
      form: {
        radio: 1
      },
      tableData: [], // 已选产品
      dialogTotalCount: 0,
      dialog: {
        form: {
          pageIndex: 1,
          pageSize: 3,
          value: ''
        },
        dialogData: [], // 选择产品
        changeData: [],
        changeDataNum: 0
      },
      dialogProjectTable: false // 控制选择产品table显示隐藏
    };
  },
  computed: {
    ...mapState(['projectSort'])
  },
  watch: {
    dialogProjectTable: {
      handler(val) {
        if (val) {
        }
      }
    }
  },
  methods: {
    ...mapActions({
      changeProjectSort: 'changeProjectSort'
    }),
    dialogClose() {
      this.dialogProjectTable = false;
    },
    dialogConfirm() {
      this.dialog.changeData = [];
      this.dialogProjectTable = false;
    },
    controlDialog() {
      // 点击显示dialog
      if (!this.projectSort.length) this.changeProjectSort();
      this.dialogProjectTable = true;
      this.$post('queryProject', Object.assign({}, this.dialog.form)).then((r, data = r.data) => {
        this.dialog = { ...this.dialog, ...{ dialogData: data.item, totalCount: data.totalCount } };
        let arr = this.dialog.changeData[this.dialog.form.pageIndex];
        if (arr && arr.length) {
          // 点击分页给已选绑定
          this.$nextTick(() => {
            data.item.map((row, i) => {
              // 这里不直接给toggleRowSelection方法 row的原因，是elm ui这里有bug。不认之前确定的数据。只认新请求过来的数据。
              let _arr = arr.map(r => r.id);
              if (_arr.includes(row.id)) this.$refs.dialogTable.toggleRowSelection(data.item[i]);
            });
          });
        }
      });
    },
    dialogCurrentChange(val) {
      // dialog分页
      this.dialog.form.pageIndex = val;
      let arr = this.dialog.changeData[val];
      this.$post('queryProject', Object.assign({}, this.dialog.form)).then((r, data = r.data) => {
        this.dialog = { ...this.dialog, ...{ dialogData: data.item, totalCount: data.totalCount } };
        if (arr && arr.length) {
          // 点击分页给已选绑定
          this.$nextTick(() => {
            data.item.map((row, i) => {
              // 这里不直接给toggleRowSelection方法 row的原因，是elm ui这里有bug。不认之前确定的数据。只认新请求过来的数据。
              let _arr = arr.map(r => r.id);
              if (_arr.includes(row.id)) this.$refs.dialogTable.toggleRowSelection(data.item[i]);
            });
          });
        }
      });
    },
    dialogChange(val) {
      this.$set(this.dialog.changeData, this.dialog.form.pageIndex, val);
      this.dialog.changeDataNum = 0;
      this.dialog.changeData.map(r => {
        this.dialog.changeDataNum += r.length;
      });
    },
    sortStrig(v) {
      // 根据id返回name
      let arr = v.split(',');
      if (arr.length > 1) {
        return arr
          .map(r => {
            let text = this.projectSort.filter(n => n.id === Number(r))[0];
            return (text && text.name) || '';
          })
          .join('/');
      } else {
        let text = this.projectSort.filter(n => n.id === Number(arr[0]))[0];
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