<template>
  <div class="addorder">
    <el-container>
      <!-- 头部按钮 -->
      <el-header class="p-0">
        <el-card shadow="hover" :body-style="{ padding: '10px' }" class="head">
          <el-row type="flex" justify="end">
            <el-button type="primary" @click="print">打印</el-button>
            <el-button type="primary" @click="confirm">保存</el-button>
            <el-button>取消</el-button>
          </el-row>
        </el-card>
      </el-header>
      <el-main class="main">
        <!-- 客户基础信息 -->
        <el-divider> <i class="el-icon-s-custom">基础信息</i></el-divider>
        <el-form ref="ruleForm" :model="order" :rules="rules" :inline="true" class="box" label-width="100px">
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="客户名称：" prop="name">
                <el-select v-model="order.name" class="width-220" filterable :popper-append-to-body="false" :default-first-option="true" @change="custChange" :disabled="getOrderId">
                  <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="联系方式：" prop="phone">
                <el-input v-model="order.phone" class="width-260"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="客户地址：">
                <el-tooltip v-if="order.custAddress && order.custAddress.length > 25" effect="dark" :content="order.custAddress || '无'">
                  <p class="text-hidden width-300">{{ order.custAddress || '无' }}</p>
                </el-tooltip>
                <p v-else class="text-hidden width-300">{{ order.custAddress || '无' }}</p>
              </el-form-item>
            </el-col>
            <el-form-item label="销售：" prop="sales">
              <el-select v-model="order.sales" filterable :popper-append-to-body="false" :default-first-option="true" class="width-260">
                <el-option v-for="item in salesData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="配送方式：">
                <el-radio-group v-model="order.deliveryType">
                  <el-radio :label="1">送货上门</el-radio>
                  <el-radio :label="2">快递</el-radio>
                  <el-radio :label="3">送货+快递</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="收货地址：" prop="address">
                <el-cascader :options="cityData" v-model="order.address" clearable class="width-260"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f">
              <el-form-item label="详细地址：" prop="shipping">
                <el-input v-model="order.shipping" class="width-260"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="d-f" v-show="[2, 3].includes(order.deliveryType)">
              <el-form-item label="快递单号：" prop="courier">
                <el-input v-model="order.courier" class="width-260"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" class="d-f">
              <el-form-item label="下单日期：" prop="orderDate">
                <el-date-picker
                  v-model="order.orderDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :picker-options="$global.pickerOptions"
                  :clearable="false"
                  class="width-220"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 分割线产品清单 -->
        <el-divider><i class="el-icon-s-claim">产品清单</i></el-divider>
        <el-row class="d-f goods">
          <i class="el-icon-menu c-p" @click="controlDialog"></i>
          <i class="el-icon-remove-outline c-p" @click="delList('product')"></i>
        </el-row>
        <el-table :data="productData" border class="w-100 table-color" ref="product">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="proNumber" label="产品编号" width="120"></el-table-column>
          <el-table-column prop="name" label="产品名称"></el-table-column>
          <el-table-column label="产品分类">
            <template slot-scope="scope">
              <span>{{ $global.sortStrig(scope.row.sort, productSort) }}</span>
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
                  (v) => {
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
                  (v) => {
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
                  (v) => {
                    scope.row.price = Number(scope.row.price) || 1;
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
                  (v) => {
                    scope.row.count = Number(scope.row.count) || 1;
                  }
                "
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="proRemark" label="单据备注">
            <template slot-scope="scope">
              <el-input placeholder="备注" size="small" v-model="scope.row.proRemark" clearable class="w-75"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="产品图片">
            <template slot-scope="scope">
              <div class="d-f a-i-c j-c-s-a">
                <el-image
                  v-if="scope.row.photo && scope.row.photo.length"
                  style="width: 50px; height: 50px"
                  :src="scope.row.photo[0].url"
                  :preview-src-list="scope.row.photo.map((r) => r.url)"
                >
                </el-image>
                <img v-else style="width: 50px; height: 50px" src="../../assets/img/img.jpg" />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分割线额外费用 -->
        <el-divider><i class="el-icon-s-ticket">金钱</i></el-divider>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="额外费用" name="1">
            <template slot="title"> <i class="grid"></i>额外费用 </template>
            <el-row class="d-f goods a-i-c">
              <i class="el-icon-circle-plus-outline c-p mr-10" @click="addPremium"></i>
              <i class="el-icon-remove-outline c-p" @click="delList('premium')"></i>
            </el-row>
            <el-table :data="premiumData" border class="w-100 table-color" ref="premium">
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
                      (v) => {
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
                      (v) => {
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

          <el-collapse-item name="2" class="f-26">
            <template slot="title"> <i class="grid"></i>金额统计 </template>
            <el-card class="box-card">
              <el-row class="d-f a-i-c f-18 j-c-c">
                <el-col :span="2">货品金额</el-col>
                <el-col :span="4" class="f-20 el-main-text">{{ proMoney }}</el-col>
                <el-col :span="2">额外费用</el-col>
                <el-col :span="4" class="f-20 el-main-text">{{ premiumPay }}</el-col>
                <el-col :span="2">应收账款</el-col>
                <el-col :span="4" class="f-20 el-main-text">{{ receivables }}</el-col>
                <el-col :span="2">预付定金</el-col>
                <el-col :span="4"><el-input v-model="order.downPayment" placeholder="预付定金" size="small" class="f-20"></el-input></el-col>
              </el-row>
            </el-card>
          </el-collapse-item>
          <el-collapse-item title="备注" name="3">
            <template slot="title"> <i class="grid"></i>备注 </template>
            <el-card class="box-card">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" placeholder="请输入备注！" v-model="order.remark"> </el-input>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>

    <!-- 分割线选择产品 -->
    <el-dialog title="选择产品" :visible="dialog.dialogProductTable" @close="dialogClose" center>
      <el-button size="small" class="mb-10">已选{{ dialog.changeDataNum }}</el-button>
      <el-table :data="dialog.dialogData" max-height="350" @select="dialogChange" @select-all="dialogChange" ref="dialogTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="proNumber" label="产品编号"></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column label="产品分类" :width="170">
          <template slot-scope="scope">
            <span>{{ $global.sortStrig(scope.row.sort, productSort) }}</span>
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
                :preview-src-list="scope.row.photo.map((r) => r.url)"
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
import city from '../../global/city.js';
export default {
  data() {
    let checkCourier = (rule, value, callback) => {
      if ([2, 3].includes(this.order.deliveryType) && !value) {
        return callback(new Error('快递单号不能为空！'));
      } else {
        callback();
      }
    };
    return {
      order: {
        name: '', // 客户名称
        phone: '', // 联系方式
        custAddress: '', // 客户地址
        address: '', // 地址
        sales: '', // 销售
        deliveryType: 1, // 配送方法
        shipping: '', // 配送地址
        courier: '', // 快递单号
        orderDate: '', // 下单日期
        downPayment: 0, // 已收账款
        remark: '' // 备注
      },
      editData: {},
      dialog: {
        // 选择产品的数据
        form: {
          pageIndex: 1,
          pageSize: 5,
          value: ''
        },
        dialogData: [], // 选择产品table的数据
        changeData: [], // 已选的数据
        changeDataNum: 0, // 总共已选几个产品
        dialogProductTable: false
      },
      productData: [], // 产品清单的数据
      premiumData: [], // 额外费用数据
      activeNames: ['1', '2', '3'], // 折叠面板数据
      customerData: [], // 客户下拉数据
      salesData: [], // 销售下拉数据
      rules: {
        name: [{ required: true, message: '请选择客户', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        sales: [{ required: true, message: '请选择销售', trigger: 'change' }],
        address: [{ required: true, message: '请选择省区市', trigger: 'change' }],
        shipping: [{ required: true, message: '请输入收货地址', trigger: 'change' }],
        courier: [{ validator: checkCourier, trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapState(['productSort']),
    // 货品金额
    proMoney() {
      let money = 0;
      this.productData.map((r) => {
        money = this.$global.Add(this.$global.Multiply(Number(r.price) || 0, Number(r.count) || 0), money);
      });
      return money;
    },
    // 额外费用支出
    premiumPay() {
      let money = 0;
      this.premiumData.map((r) => {
        money = this.$global.Add(Number(r.money) || 0, money);
      });
      return money;
    },
    // 应收账款
    receivables() {
      return this.proMoney + this.premiumPay;
    },
    cityData() {
      return city || [];
    },
    // 是否是修改
    getOrderId() {
      return this.$route.query.id;
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.path === '/addOrder') {
          this.$post('./queryCust', { pageIndex: 1, pageSize: 99999, value: '' }).then((r, data = r.data.item) => {
            this.customerData = data;
          });
          this.$post('./querySalesUser', {}).then((r, data = r.data.item) => {
            this.salesData = data;
          });
          if (!this.getOrderId) {
            // 新增
            let _order = this.order;
            for (const key in _order) {
              _order[key] = '';
            }
            _order.deliveryType = 1;
            _order.downPayment = 0;
            this.productData = [];
            this.premiumData = [];
            _order.orderDate = this.$global.getNewDate();
            return; // 看是不是修改
          }
          if (JSON.stringify(this.editData) === '{}' || this.editData.id !== this.getOrderId) {
            // 区分一下。第一次和刷新的时候。都只能从后台取数据，第二次查看，只需要调用接口就可以了
            this.$post('./queryOrder', { value: '', pageIndex: 1, pageSize: 10, id: this.getOrderId }).then((r, data = r.data.item) => {
              this.editData = data[0];
              this.orderDateRegroup();
            });
          } else {
            this.orderDateRegroup();
          }
        }
      },
      immediate: true
    }
  },
  activated() {
    // 每次进新增修改订单触发
    this.bus.$off('orderedit');
    if (this.$refs['ruleForm']) this.$refs['ruleForm'].clearValidate();
    this.bus.$on('orderedit', (data) => {
      this.editData = data;
    });
  },
  methods: {
    ...mapActions({
      changeProductSort: 'changeProductSort'
    }),
    async orderDateRegroup() {
      if (!this.productSort.length) await this.changeProductSort();
      // 订单数据重组
      let _data = this.order,
        _editData = { ...this.editData };
      for (const key in _data) {
        _data[key] = _editData[key];
        if (key === 'address') {
          _data[key] = _data[key].split(',');
        }
        if (key === 'orderDate') {
          _data[key] = this.$global.getNewDate(_data[key]);
        }
        if (['name', 'sales', 'deliveryType'].includes(key)) _data[key] = Number(_data[key]);
      }
      this.productData = _editData.productData;
      this.premiumData = _editData.premiumData;
    },
    dialogClose() {
      // 选择产品列表关闭页面
      this.dialog.dialogProductTable = false;
    },
    dialogConfirm() {
      // 选择产品确定
      let arr = [];
      this.dialog.changeData
        .filter((x) => x) // 去除 undefined
        .map((r) => {
          arr = [...arr, ...r];
        });
      arr.map((r) => {
        // 字符串转换成数字
        for (const key in r) {
          if (['cost', 'price'].includes(key)) r[key] = Number(r[key]);
        }
        // 给数量默认赋值为 1
        this.$set(r, 'count', 1);
      });
      this.productData = [...this.productData, ...arr];
      this.dialog.changeDataNum = 0;
      this.dialog.changeData = [];
      this.dialog.dialogProductTable = false;
    },
    delList(type) {
      let data = this.$refs[type].selection;
      if (!data.length) {
        this.$notify({
          title: '提示',
          message: '请选择需要删除的数据!'
        });
        return;
      }
      let obj = {
        product: () => {
          this.productData.map((n, i) => {
            n._i = i;
          });
          this.productData = this.productData.filter((r, i) => !data.map(n => n._i).includes(i));
        },
        premium: () => {
          this.premiumData.map((n, i) => {
            n._i = i;
          });
          this.premiumData = this.premiumData.filter((r, i) => !data.map(n => n._i).includes(i));
        }
      };
      this.$confirm('确认删除么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        obj[type]();
      });
    },
    controlDialog() {
      // 点击显示dialog
      if (!this.productSort.length) this.changeProductSort();
      this.dialog.dialogProductTable = true;
      this.$post('queryProduct', Object.assign({}, this.dialog.form)).then((r, data = r.data) => {
        this.dialog = { ...this.dialog, ...{ dialogData: data.item, totalCount: data.totalCount } };
        let arr = this.dialog.changeData[this.dialog.form.pageIndex];
        if (arr && arr.length) {
          // 点击分页给已选绑定
          this.$nextTick(() => {
            data.item.map((row, i) => {
              // 这里不直接给toggleRowSelection方法 row的原因，是elm ui这里有bug。不认之前确定的数据。只认新请求过来的数据。
              let _arr = arr.map((r) => r.id);
              if (_arr.includes(row.id)) this.$refs.dialogTable.toggleRowSelection(data.item[i]);
            });
          });
        }
      });
    },
    dialogCurrentChange(val) {
      // dialog分页
      this.dialog.form.pageIndex = val;
      let arr = this.dialog.changeData[val - 1];
      this.$post('queryProduct', Object.assign({}, this.dialog.form)).then((r, data = r.data) => {
        this.dialog = { ...this.dialog, ...{ dialogData: data.item, totalCount: data.totalCount } };
        if (arr && arr.length) {
          // 点击分页给已选绑定
          this.$nextTick(() => {
            data.item.map((row, i) => {
              // 这里不直接给toggleRowSelection方法 row的原因，是elm ui这里有bug。不认之前确定的数据。只认新请求过来的数据。
              let _arr = arr.map((r) => r.id);
              if (_arr.includes(row.id)) this.$refs.dialogTable.toggleRowSelection(data.item[i]);
            });
          });
        }
      });
    },
    dialogChange(val) {
      // 产品表单选中数据
      this.$set(this.dialog.changeData, this.dialog.form.pageIndex - 1, val);
      this.dialog.changeDataNum = 0;
      this.dialog.changeData.map((r) => {
        this.dialog.changeDataNum += r.length;
      });
    },
    addPremium() {
      // 新增额外支出
      this.premiumData.push({
        name: '支出',
        money: -1,
        remark: '',
        id: this.premiumData.length
      });
    },
    custChange(val) {
      let data = this.customerData.filter((v) => v.id === val)[0];
      this.order = {
        ...this.order,
        ...{ phone: data.phone, custAddress: this.$global.getCityName(data.address) + data.detailAddress, shipping: data.detailAddress, address: data.address.split(',') }
      };
      this.$refs['ruleForm'].clearValidate();
    },
    confirm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) return;
        if (!this.productData.length) {
          this.$notify.error({
            title: '错误',
            message: '产品清单为空，请选择产品!'
          });
          return;
        }
        let orderObj = { ...this.order, ...{ productData: this.productData, premiumData: this.premiumData } };
        if (this.getOrderId) {
          orderObj.id = this.getOrderId;
        }
        this.$post(this.getOrderId ? '/editOrder' : '/addOrder', orderObj).then((r, data = r.data) => {
          if (data.success) {
            this.$notify({
              title: this.getOrderId ? '修改成功' : '新增成功',
              message: data.message,
              type: 'success'
            });
            this.$router.push({ path: '/order' });
            this.bus.$emit('order', 1);
            return;
          }
          this.$notify({
            title: this.getOrderId ? '修改' : '新增',
            message: data.message,
            type: 'error'
          });
        });
      });
    },
    print() {
      let that = this;
      const { href } = this.$router.resolve({
        name: '打印',
        path: '/print',
        query: {
          id: that.getOrderId
        }
      });
      window.open(href, '_blank');
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
        margin: 8px 0 8px 8px;
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
