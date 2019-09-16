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
        <el-form ref="form" :model="order" :inline="true" class="box">
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="客户名称: " prop="name">
                <el-select v-model="order.name" filterable :popper-append-to-body="false" :default-first-option="true">
                  <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="联系方式：" prop="phone">
                <el-input v-model="order.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="客户地址：" prop="address">
                <el-input v-model="order.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="销售：" prop="sales">
                <el-select v-model="order.sales" :popper-append-to-body="false" :default-first-option="true"></el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="配送方式: " prop="radio">
                <el-radio-group v-model="order.radio">
                  <el-radio :label="1">送货上门</el-radio>
                  <el-radio :label="2">快递</el-radio>
                  <el-radio :label="3">送货+快递</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="收货地址：" prop="shipping">
                <el-input v-model="order.shipping"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f" v-show="[2, 3].includes(order.radio)">
              <el-form-item label="快递单号：" prop="courier">
                <el-input v-model="order.courier"></el-input>
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
        <el-table :data="tableData" border class="pb-20 w-100">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="产品名称"></el-table-column>
          <el-table-column label="产品分类">
            <template slot-scope="scope">
              <span>{{ sortStrig(scope.row.sort) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="units" label="单位">
            <template slot-scope="scope">
              <el-input
                placeholder="请输入单位"
                size="small"
                v-model="scope.row.units"
                clearable
                class="w-75"
                @change="
                  v => {
                    scope.row.units = scope.row.units || '个';
                  }
                "
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="成本">
            <template slot-scope="scope">
              <el-input
                placeholder="请输入成本"
                size="small"
                v-model="scope.row.cost"
                clearable
                class="w-75"
                @change="
                  v => {
                    scope.row.cost = Number(scope.row.cost) || 0;
                  }
                "
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价">
            <template slot-scope="scope">
              <el-input
                placeholder="请输入单价"
                size="small"
                v-model="scope.row.price"
                clearable
                class="w-75"
                @change="
                  v => {
                    scope.row.price = Number(scope.row.price) || 0;
                  }
                "
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量">
            <template slot-scope="scope">
              <el-input
                placeholder="请输入数量"
                size="small"
                v-model="scope.row.count"
                clearable
                class="w-75"
                @change="
                  v => {
                    scope.row.count = Number(scope.row.count) || 0;
                  }
                "
              ></el-input>
            </template>
          </el-table-column>
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

        <!-- 分割线额外费用 -->
        <el-divider class="el-icon-s-custom"><i class="el-icon-s-ticket">金钱</i></el-divider>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="额外费用" name="1">
            <el-row class="d-f goods">
              <i class="el-icon-circle-plus-outline c-p mr-10" @click="addPremium"></i>
              <i class="el-icon-remove-outline c-p"></i>
            </el-row>
            <el-table :data="premiumData" border style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="费用名称" width="300">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入费用名称"
                    size="small"
                    v-model="scope.row.name"
                    clearable
                    class="w-75"
                    @change="
                      v => {
                        scope.row.name = scope.row.name || '支出';
                      }
                    "
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="money" label="金额" width="300">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入金额"
                    size="small"
                    v-model="scope.row.money"
                    clearable
                    class="w-75"
                    @change="
                      v => {
                        scope.row.money = Number(scope.row.money) || 0;
                      }
                    "
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                  <el-input placeholder="请输入备注" size="small" v-model="scope.row.remark" clearable class="w-75"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="金额统计" name="2">
            <el-card class="box-card">
              <el-row class="d-f a-i-c">
                <el-col :span="2">货品金额</el-col>
                <el-col :span="4">{{ proMoney }}</el-col>
                <el-col :span="2">额外费用</el-col>
                <el-col :span="4">{{ premiumPay }}</el-col>
                <el-col :span="2">应收账款</el-col>
                <el-col :span="4">{{ receivables }}</el-col>
                <el-col :span="2">预付定金</el-col>
                <el-col :span="4"><el-input v-model="order.downPayment" placeholder="预付定金" size="mini"></el-input></el-col>
              </el-row>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>

    <!-- 分割线选择产品 -->
    <el-dialog title="选择产品" :visible="dialog.dialogProjectTable" @close="dialogClose" center>
      <el-button size="small" class="mb-10">已选{{ dialog.changeDataNum }}</el-button>
      <el-table :data="dialog.dialogData" max-height="350" @select="dialogChange" @select-all="dialogChange" ref="dialogTable">
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
      order: {
        name: '', // 客户名称
        phone: '', // 联系方式
        address: '', // 地址
        sales: '', // 销售
        radio: 1, // 配送方法
        shipping: '', // 配送地址
        courier: '', // 快递单号
        downPayment: 0 // 已收账款
      },
      dialog: {
        // 选择产品的数据
        form: {
          pageIndex: 1,
          pageSize: 3,
          value: ''
        },
        dialogData: [], // 选择产品table的数据
        changeData: [], // 已选的数据
        changeDataNum: 0, // 总共已选几个产品
        dialogProjectTable: false
      },
      tableData: [], // 产品清单的数据
      premiumData: [], // 额外费用数据
      activeNames: ['1', '2'],
      customerData: [] // 客户下拉数据
    };
  },
  computed: {
    ...mapState(['projectSort']),
    // 货品金额
    proMoney() {
      let money = 0;
      this.tableData.map(r => {
        money += (Number(r.price) || 0) * (Number(r.count) || 0);
      });
      return money;
    },
    // 额外费用支出
    premiumPay() {
      let money = 0;
      this.premiumData.map(r => {
        money += Number(r.money) || 0;
      });
      return money;
    },
    // 应收账款
    receivables() {
      return this.proMoney + this.premiumPay;
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.path === '/addOrder') {
          this.$post('./queryCust', { inputValue: '', pageIndex: 1, pageSize: 99999, value: '' }).then((r, data = r.data.item) => {
            this.customerData = data;
          });
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions({
      changeProjectSort: 'changeProjectSort'
    }),
    dialogClose() {
      this.dialog.dialogProjectTable = false;
    },
    dialogConfirm() {
      let arr = [];
      this.dialog.changeData
        .filter(x => x) // 去除 undefined
        .map(r => {
          arr = [...arr, ...r];
        });
      arr.map(r => {
        // 字符串转换成数字
        for (const key in r) {
          if (['cost', 'price'].includes(key)) r[key] = Number(r[key]);
        }
        // 给数量默认赋值为 1
        this.$set(r, 'count', 1);
      });
      this.tableData = [...this.tableData, ...arr];
      this.dialog.changeDataNum = 0;
      this.dialog.changeData = [];
      this.dialog.dialogProjectTable = false;
    },
    controlDialog() {
      // 点击显示dialog
      if (!this.projectSort.length) this.changeProjectSort();
      this.dialog.dialogProjectTable = true;
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
      this.$set(this.dialog.changeData, this.dialog.form.pageIndex - 1, val);
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
    },
    addPremium() {
      this.premiumData.push({
        name: '支出',
        money: -1,
        remark: ''
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.addorder {
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
        transition: all 0.5s linear;

        &:hover {
          color: #5cb6ff;
          transform: rotateZ(180deg);
        }
      }
    }
  }
}
</style>