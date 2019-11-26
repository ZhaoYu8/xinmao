<template>
  <div class="order-detail">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item> <i class="el-icon-menu"></i> 订单详情 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div>
        订单编号：<span style="color:#409EFF" class="f-20">{{ editData.orderId }}</span>
      </div>
      <el-steps :active="active" align-center finish-status="success" class="mt-20 mb-20">
        <el-step title="发货"></el-step>
        <el-step title="收款"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div class="source d-f f-d-c">
        <el-button type="primary" @click="quick" class=" a-s-f-e width-100" size="small">一键填充</el-button>
        <el-table :data="projectData" style="width: 80%;margin: 0 auto;">
          <el-table-column width="150" property="name" label="产品名称"></el-table-column>
          <el-table-column width="230" property="sort" label="产品分类">
            <template slot-scope="scope">
              <span>{{ $global.sortStrig(scope.row.sort, projectSort) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" property="units" label="单位"></el-table-column>
          <el-table-column width="150" property="cost" label="成本"></el-table-column>
          <el-table-column width="150" property="price" label="单价"></el-table-column>
          <el-table-column width="150" property="count" label="数量"></el-table-column>
          <el-table-column prop="address" label="发货数">
            <template slot-scope="scope">
              <el-input-number v-model="shipments[scope.$index]" :max="Number(scope.row.count)"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div class="a-s-c mt-20">
          <el-button type="primary" size="small" class="width-100" @click="next">下一步</el-button>
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
            <p :style="{ color: typeName(scope.row.operationType).color }">{{ typeName(scope.row.operationType).text }}</p>
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
      shipments: [],
      operationsData: []
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
          // this.$post('./querySalesUser', {}).then((r, data = r.data.item) => {
          //   this.salesData = data;
          // });
          if (JSON.stringify(this.editData) === '{}') {
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
    this.bus.$on('orderdetail', (data) => {
      this.editData = data;
    });
  },
  methods: {
    typeName(index) {
      let arr = [
        { text: '新增', color: '#1890ff' },
        { text: '修改', color: '#207d46' },
        { text: '删除', color: '#ff0000' },
        { text: '发货中', color: '#67c23a' },
        { text: '收款中', color: '#e6a23c' },
        { text: '完成', color: '#3ce6e3' }
      ];
      return arr[index];
    },
    ...mapActions({
      changeProjectSort: 'changeProjectSort'
    }),
    next() {
      // 下一步流转
      this.active++;
    },
    quick() {
      // 快速填充
      this.shipments.map((r, index) => {
        this.$set(this.shipments, index, this.projectData[index].count);
      });
    },
    async orderDateRegroup() {
      if (!this.projectSort.length) await this.changeProjectSort();
      await this.$post('./queryOrderOperations', { id: this.getOrderId }).then((r, data = r.data.item) => {
        this.operationsData = data;
      });
      // 订单数据重组
      this.shipments = [];
      let _editData = { ...this.editData };
      _editData.projectData.map((r, i) => {
        this.shipments[i] = r.shipments || 0;
      });
      this.projectData = _editData.projectData;
      this.premiumData = _editData.premiumData;
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
