<template>
  <div class="order-detail">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item> <i class="el-icon-menu"></i> 订单详情 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <ul class="d-f l-40 f-18">
        <li class="d-f a-i-c">
          订单编号：<span style="color:#409EFF" class="f-20">{{ editData.orderId }}</span>
        </li>
        <li class="ml-20">
          客户名称：<span style="color:#409EFF">{{ editData.custName }}</span>
        </li>
        <li class="ml-20">
          销售：<span style="color:#409EFF">{{ editData.salesName }}</span>
        </li>
      </ul>
      <el-steps :active="active" align-center finish-status="success" class="mt-20 mb-20">
        <el-step title="发货"></el-step>
        <el-step title="收款"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div class="source d-f f-d-c">
        <!-- 这是发货页面 -->
        <div v-show="active === 0">
          <el-button type="primary" @click="quick" class="fr width-100" size="small">一键填充</el-button>
          <el-table :data="projectData" style="width: 90%;margin: 0 auto;">
            <el-table-column property="name" label="产品名称"></el-table-column>
            <el-table-column property="sort" label="产品分类">
              <template slot-scope="scope">
                <span>{{ $global.sortStrig(scope.row.sort, projectSort) }}</span>
              </template>
            </el-table-column>
            <el-table-column property="units" label="单位"></el-table-column>
            <el-table-column property="cost" label="成本"></el-table-column>
            <el-table-column property="price" label="单价"></el-table-column>
            <el-table-column property="count" label="数量"></el-table-column>
            <el-table-column property="deliveryNumber" label="已发货数">
              <template slot-scope="scope">
                <p :class="{ c3: scope.row.overruns, c4: !scope.row.overruns }" class="f-20">
                  {{ (scope.row.deliveryNumber || 0) + (scope.row.overruns ? ` (超${scope.row.deliveryNumber - scope.row.count}) ` : ``) }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="发货数" width="200">
              <template slot-scope="scope">
                <el-input-number v-model="shipments[scope.$index]" :max="Number(scope.row.count)"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="发货备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 这是收款页面 -->
        <div v-show="active === 1">
          <div class="label">
            <p class="f-20 ">实际应收</p>
            <el-button type="primary" @click="quick" class=" a-s-f-e width-100" size="small">一键填充</el-button>
          </div>
          <ul class="d-f f-20 ml-20 a-i-c l-36">
            <li>
              1. 产品费用合计应收：<span class="c4">{{ projectTotal }} 元</span>
            </li>
            <li class="ml-20">
              2. 额外费用合计应收: <span class="c4">{{ premiumTotal }} 元</span>
            </li>
            <li class="ml-20">
              3. 已支付定金: <span class="c4">{{ editData.downPayment }} 元</span>
            </li>
            <li class="ml-20">
              4. 实际已收: <span class="c4">{{ moneyNumTotal }} 元</span>
            </li>
            <li class="ml-20">
              5. 剩余应收: <span class="c4">{{ Number(projectTotal) + Number(premiumTotal) - (editData.downPayment || 0) - moneyNumTotal }} 元</span>
            </li>
          </ul>
          <el-form :model="moneyValidateForm" ref="moneyValidateForm" label-width="100px" class="moneyValidateForm">
            <el-form-item label="金钱" prop="num" :rules="[{ required: true, message: '本次收款不能为空！' }]">
              <el-input
                v-model="moneyValidateForm.num"
                class="f-24"
                @input="
                  (value) => {
                    if (value[value.length - 1] === '.' && value.split('.').length < 3) {
                      moneyValidateForm.num = value;
                      return;
                    }
                    moneyValidateForm.num = parseFloat(value);
                  }
                "
              >
                <i slot="prefix">
                  <svg class="icon f-22 c-p" aria-hidden="true">
                    <use xlink:href="#icon-xinzengshoukuan"></use></svg
                ></i>
              </el-input>
            </el-form-item>
            <el-form-item label="收款备注" prop="remark">
              <el-input v-model="moneyValidateForm.remark">
                <i slot="prefix">
                  <svg class="icon f-28 c-p" aria-hidden="true">
                    <use xlink:href="#icon-guidang"></use></svg></i
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="label">
            <p class="f-20">产品清单</p>
          </div>
          <el-table :data="projectData">
            <el-table-column property="name" label="产品名称"></el-table-column>
            <el-table-column property="sort" label="产品分类">
              <template slot-scope="scope">
                <span>{{ $global.sortStrig(scope.row.sort, projectSort) }}</span>
              </template>
            </el-table-column>
            <el-table-column property="units" label="单位"></el-table-column>
            <el-table-column property="cost" label="成本"></el-table-column>
            <el-table-column property="price" label="单价"></el-table-column>
            <el-table-column property="count" label="数量"></el-table-column>
            <el-table-column label="应收款">
              <template slot-scope="scope">
                <p class="c4 f-20">{{ scope.row.price * scope.row.count }}</p>
              </template>
            </el-table-column>
          </el-table>
          <div class="label" v-if="premiumData.length">
            <p class="f-20">额外费用</p>
          </div>
          <el-table :data="premiumData" v-if="premiumData.length">
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="money" label="金额"></el-table-column>
            <el-table-column property="remark" label="备注"></el-table-column>
          </el-table>
        </div>
        <div class="a-s-c mt-20">
          <el-button type="primary" size="small" class="width-100" @click="back" v-if="active !== 0">上一步</el-button>
          <el-button type="warning" size="small" class="width-100" @click="active = 1" v-if="active === 0">去收款</el-button>
          <el-button type="primary" size="small" class="width-100" @click="next" v-if="active === 0">确认发货</el-button>
          <el-button type="primary" size="small" class="width-100" @click="next" v-if="active === 1">确认收款</el-button>
          <el-button type="success" size="small" class="width-100" @click="next">快速完成</el-button>
        </div>
        <div class="state">
          <h3>说明</h3>
          <h4><i class="el-icon-warning"></i>下一步</h4>
          <p>点击下一步，会让流程进入代收款环境。可发货多次。</p>
          <h4><i class="el-icon-warning"></i>快速完成</h4>
          <p>点击快速完成，默认全部发货完成。流程进入待收款环境。</p>
        </div>
      </div>
      <el-divider></el-divider>
      操作记录
      <el-table :data="operationsData" style="width: 100%">
        <el-table-column prop="operationUserName" label="操作人"> </el-table-column>
        <el-table-column prop="operationType" label="操作类型">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover" v-if="scope.row.operationType === '3'">
              <el-table :data="[scope.row]">
                <el-table-column width="150" property="name" label="产品名称"></el-table-column>
                <el-table-column width="150" property="num" label="本次发货数"></el-table-column>
                <el-table-column width="300" property="remark" label="发货备注"></el-table-column>
              </el-table>
              <div slot="reference" class="d-inline-block">
                <el-tag :color="typeName(scope.row.operationType).color" effect="dark" class="no-border width-60 t-c">{{ typeName(scope.row.operationType).text }}</el-tag>
              </div>
            </el-popover>
            <el-popover placement="right" trigger="hover" v-else-if="scope.row.operationType === '4'">
              <el-table :data="[scope.row]">
                <el-table-column width="150" property="moneyNum" label="本次收入"></el-table-column>
                <el-table-column width="300" property="moneyRemark" label="收款备注"></el-table-column>
              </el-table>
              <div slot="reference" class="d-inline-block">
                <el-tag :color="typeName(scope.row.operationType).color" effect="dark" class="no-border width-60 t-c">{{ typeName(scope.row.operationType).text }}</el-tag>
              </div>
            </el-popover>
            <el-tag v-else :color="typeName(scope.row.operationType).color" effect="dark" class="no-border  width-60 t-c">{{ typeName(scope.row.operationType).text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationDate" label="操作时间"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import city from '../../global/city.js';
export default {
  data() {
    return {
      editData: {},
      projectData: [],
      active: 0,
      shipments: [], // 发货数存储的数据
      operationsData: [],
      operationsListData: {}, // 合并存放 发货 收款 的数据
      premiumData: [], // 额外费用存放数据
      moneyValidateForm: {
        num: '',
        remark: ''
      }
    };
  },
  computed: {
    ...mapState(['projectSort']),
    getOrderId() {
      return this.$route.query.id;
    },
    projectTotal() {
      return this.projectData.length && this.projectData.map((r) => r.price * r.count).reduce((prev, curr) => Number(prev) + Number(curr));
    },
    premiumTotal() {
      return this.premiumData.length && this.premiumData.map((r) => r.money).reduce((prev, curr) => Number(prev) + Number(curr));
    },
    moneyNumTotal() {
      return this.operationsListData['4'] && this.operationsListData['4'].map((r) => r.moneyNum).reduce((prev, curr) => Number(prev) + Number(curr));
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.path === '/orderDetail') {
          if (JSON.stringify(this.editData) === '{}') {
            // 区分一下。第一次和刷新的时候。都只能从后台取数据，第二次查看，只需要调用接口就可以了
            this.$post('./queryOrder', { value: '', pageIndex: 1, pageSize: 10, id: this.getOrderId }).then((r, data = r.data.item) => {
              this.editData = data[0];
              this.orderDateRegroup();
            });
          }
        }
      },
      immediate: true
    }
  },
  activated() {
    this.bus.$off('orderdetail');
    this.bus.$on('orderdetail', (data) => {
      this.editData = data;
      this.orderDateRegroup();
    });
  },
  methods: {
    ceshi(val) {
      console.log(val);
    },
    typeName(index) {
      let arr = [
        { text: '新增', color: '#67c23a' },
        { text: '修改', color: '#e6a23c' },
        { text: '删除', color: '#ff0000' },
        { text: '发货', color: '#409eff' },
        { text: '收款', color: '#f56c6c' },
        { text: '完成', color: '#3ce6e3' }
      ];
      return arr[index];
    },
    ...mapActions({
      changeProjectSort: 'changeProjectSort'
    }),
    async next() {
      // 下一步流转
      if (!this.active) {
        let arr = this.projectData.map((r, i) => {
          return { projectId: r.projectId, num: this.shipments[i], remark: r.remark || '' };
        });
        await this.$post('./addOrderDelivery', { id: this.getOrderId, data: arr });
        this.orderDateRegroup();
      } else if (this.active === 1) {
        this.$refs['moneyValidateForm'].validate((valid) => {
          if (valid) {
            this.$post('./addOrderMoney', { id: this.getOrderId, num: this.moneyValidateForm.num, remark: this.moneyValidateForm.remark }).then(() => {
              this.orderDateRegroup();
            });
          } else {
            return false;
          }
        });
      }
    },
    back() {
      // 回退查看上一步
      this.active--;
    },
    quick() {
      // 快速填充
      // 如果所有的产品都已经发货了。提示他不需要发货了
      if (this.active === 0) {
        if (this.projectData.map((r) => r.deliveryNumber >= Number(r.count)).filter((r) => r).length === this.projectData.length) {
          this.$notify.info({
            title: '消息',
            message: '已经全部发货了！'
          });
          return;
        }
        this.shipments.map((r, index) => {
          let num = Number(this.projectData[index].count) - Number(this.projectData[index].deliveryNumber || 0);
          this.$set(this.shipments, index, num < 0 ? 0 : num);
        });
      } else if (this.active === 1) {
        if (Number(this.projectTotal) + Number(this.premiumTotal) - (this.editData.downPayment || 0) - this.moneyNumTotal <= 0) {
          this.$notify.info({
            title: '消息',
            message: '已经全部收款完成了!'
          });
          return;
        }
        this.moneyValidateForm.num = Number(this.projectTotal) + Number(this.premiumTotal) - (this.editData.downPayment || 0) - this.moneyNumTotal;
      }
    },
    async operations() {
      await this.$post('./queryOrderOperations', { id: this.getOrderId }).then((r, data = r.data) => {
        this.operationsData = data.item; // 这个订单的所有操作记录
        this.$set(
          this.operationsListData,
          '3',
          this.operationsData.filter((r) => r.operationType === '3')
        ); // 把发货的数据筛选出来
        this.$set(
          this.operationsListData,
          '4',
          this.operationsData.filter((r) => r.operationType === '4')
        ); // 把发货的数据筛选出来
      });
    },
    async orderDateRegroup() {
      // 订单数据重组
      if (!this.projectSort.length) await this.changeProjectSort();
      await this.operations();
      let _editData = { ...this.editData };
      // 重置发货数
      _editData.projectData.map((r, i) => {
        this.shipments[i] = 0;
      });
      // 重置已收款
      this.moneyValidateForm = {
        num: '',
        remark: ''
      };
      // 清除验证信息
      this.$refs['moneyValidateForm'].resetFields();
      this.projectData = _editData.projectData;
      this.premiumData = _editData.premiumData;
      this.projectData.map((r) => {
        // 产品数据 匹配 操作记录
        let arr = this.operationsListData['3'].filter((n) => r.projectId === n.projectId + '' && n.operationType === '3');
        if (!arr.length) return;
        // 单条产品已发货数统计
        r.deliveryNumber = arr.map((r) => r.num).reduce((prev, curr) => Number(prev) + Number(curr));
        // 已发货数 是否 超过 发货数
        if (r.deliveryNumber > Number(r.count)) r.overruns = true;
      });
      // 如果所有的产品都已经发货了。自动跳转到收款页面。
      if (this.projectData.map((r) => r.deliveryNumber >= Number(r.count)).filter((r) => r).length === this.projectData.length) {
        this.active = 1;
      } else {
        this.active = 0;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.order-detail {
  border-radius: 5px;

  .el-step__icon {
    height: 32px;
    width: 32px;
  }

  .state {
    padding: 0 56px;
    color: rgba(0, 0, 0, 0.45);

    h3 {
      margin: 0 0 12px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      line-height: 32px;
    }

    h4 {
      margin: 0 0 4px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
    }

    p {
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 22px;
    }
  }
}
</style>
<style lang="stylus">
.order-detail {
  .el-step__icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  .el-step.is-horizontal .el-step__line {
    top: 16px;
  }
  .moneyValidateForm {
    width: 500px
    margin: 20px auto
  }
  .el-input__prefix, .el-input__suffix {
    display flex
    align-items center
    line-height 100%
  }
}
.no-border{
  border: 0 !important
}
</style>
