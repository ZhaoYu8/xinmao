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
        <el-button type="primary" @click="quick" class=" a-s-f-e width-100" size="small">一键填充</el-button>
        <div v-show="active === 0">
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
        <div v-show="active === 1">
          <div class="label">
            <p class="mt-10 mb-10 f-20">产品清单</p>
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
            <p class="mt-10 mb-10 f-20">额外费用</p>
          </div>
          <el-table :data="premiumData" v-if="premiumData.length">
            <el-table-column property="name" label="名称"></el-table-column>
            <el-table-column property="money" label="金额"></el-table-column>
            <el-table-column property="remark" label="备注"></el-table-column>
          </el-table>
          <div class="label">
            <p class="mt-10 mb-10 f-20">实际应收</p>
          </div>
          <ul class="d-f f-20">
            <li>
              产品费用合计应收：<span class="c4">{{ projectData.length && projectData.map((r) => r.price * r.count).reduce((prev, curr) => Number(prev) + Number(curr)) }} 元</span>
            </li>
            <li class="ml-20">
              额外费用合计应收: <span class="c4">{{ premiumData.length && premiumData.map((r) => r.money).reduce((prev, curr) => Number(prev) + Number(curr)) }} 元</span>
            </li>
            <li class="ml-20">
              已支付定金: <span class="c4">{{ editData.downPayment }} 元</span>
            </li>
          </ul>
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
              <el-table :data="scope.row.delivery">
                <el-table-column width="150" property="name" label="产品名称"></el-table-column>
                <el-table-column width="150" property="num" label="本次发货数"></el-table-column>
                <el-table-column width="150" property="remark" label="发货备注"></el-table-column>
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
      deliveryData: [],
      premiumData: []
    };
  },
  computed: {
    ...mapState(['projectSort']),
    getOrderId() {
      return this.$route.query.id;
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.path === '/orderDetail') {
          this.$post('./queryCust', { pageIndex: 1, pageSize: 99999, value: '' }).then((r, data = r.data.item) => {
            this.customerData = data;
          });
          if (JSON.stringify(this.editData) === '{}') {
            // 区分一下。第一次和刷新的时候。都只能从后台取数据，第二次查看，只需要调用接口就可以了
            this.$post('./queryOrder', { value: '', pageIndex: 1, pageSize: 10, id: this.getOrderId }).then((r, data = r.data.item) => {
              this.editData = data[0];
              this.orderDateRegroup();
            });
            return;
          }
          this.orderDateRegroup();
        }
      },
      immediate: true
    }
  },
  activated() {
    this.bus.$on('orderdetail', (data) => {
      this.editData = data;
      this.orderDateRegroup();
    });
  },
  methods: {
    typeName(index) {
      let arr = [
        { text: '新增', color: '#67c23a' },
        { text: '修改', color: '#e6a23c' },
        { text: '删除', color: '#ff0000' },
        { text: '已发货', color: '#409eff' },
        { text: '已收款', color: '#f56c6c' },
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
      }
      this.active++;
    },
    back() {
      // 回退查看上一步
      this.active--;
    },
    quick() {
      // 快速填充
      // 如果所有的产品都已经发货了。提示他不需要发货了
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
    },
    async operations() {
      await this.$post('./queryOrderOperations', { id: this.getOrderId }).then((r, data = r.data) => {
        this.operationsData = data.item;
        this.operationsData.map((r) => {
          if (r.operationType === '3') {
            r.delivery = data.list.filter((n) => n.orderOperationId === r.id);
          }
        });
        this.deliveryData = data.list;
      });
    },
    async orderDateRegroup() {
      // 订单数据重组
      if (!this.projectSort.length) await this.changeProjectSort();
      await this.operations();
      this.shipments = [];
      let _editData = { ...this.editData };
      _editData.projectData.map((r, i) => {
        this.shipments[i] = r.shipments || 0;
      });
      this.projectData = _editData.projectData;
      this.premiumData = _editData.premiumData;
      this.projectData.map((r) => {
        let arr = this.deliveryData.filter((n) => r.projectId === n.projectId + '' && n.operationType === '3');
        if (!arr.length) return;
        r.deliveryNumber = arr.map((r) => r.num).reduce((prev, curr) => Number(prev) + Number(curr));
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
}
</style>
<style lang="stylus">
.no-border{
  border: 0 !important
}
</style>
