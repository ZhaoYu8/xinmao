<template>
  <div class="customer">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item> <i class="el-icon-menu"></i> 客户信息 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="d-f j-c-s-b mb-20">
        <div>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增订单</el-button>
          <el-button @click="printSetting">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dayinyulan"></use>
            </svg>
            打印设置
          </el-button>
        </div>
        <div>
          <el-input
            v-model="form.value"
            placeholder="可根据姓名或者手机号搜索"
            @keyup.enter.native="getOrderData"
            class="handle-input mr-10 ml-10"
            clearable
            @clear="getOrderData"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="currentChange(1)">搜索</el-button>
        </div>
      </div>
      <div class="t-c">
        <el-table :data="tableData" border height="650" style="width: 100%" class="table-color">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="custName" label="客户信息">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="bottom" popper-class="name-wrapper">
                <p>姓名: {{ scope.row.custName }}</p>
                <p>联系方式: {{ scope.row.phone }}</p>
                <p>客户地址: {{ scope.row.custAddress }}</p>
                <p>配送地址: {{ cityRegroup(scope.row.address) + scope.row.shipping }}</p>
                <div slot="reference">
                  <el-tag>{{ scope.row.custName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="salesName" label="销售"></el-table-column>
          <el-table-column prop="orderId" label="订单编号" width="170"></el-table-column>
          <el-table-column prop="orderDate" label="下单日期"> </el-table-column>
          <el-table-column prop="project" label="产品">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <el-table :data="scope.row.projectData">
                  <el-table-column width="120" property="proNumber" label="产品编号"></el-table-column>
                  <el-table-column width="100" property="name" label="产品名称"></el-table-column>
                  <el-table-column width="180" property="sort" label="产品分类">
                    <template slot-scope="scope">
                      <span>{{ $global.sortStrig(scope.row.sort, projectSort) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="100" property="units" label="单位"></el-table-column>
                  <el-table-column width="100" property="cost" label="成本"></el-table-column>
                  <el-table-column width="100" property="price" label="单价"></el-table-column>
                  <el-table-column width="100" property="count" label="数量"></el-table-column>
                  <el-table-column width="100" label="总价">
                    <template slot-scope="scope">
                      <span>{{ scope.row.price * scope.row.count }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div slot="reference">
                  <el-tag>
                    {{ scope.row.projectData.length }} 项; 总计:
                    {{
                      (total[scope.$index] = scope.row.projectData.length === 1 ? scope.row.projectData.map((r) => r.price * r.count)[0] : merge(scope.row.projectData)) ||
                        total[scope.$index]
                    }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="额外费用">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" v-if="scope.row.premiumData.length">
                <el-table :data="scope.row.premiumData">
                  <el-table-column width="100" property="name" label="名称"></el-table-column>
                  <el-table-column width="100" property="money" label="金额"></el-table-column>
                  <el-table-column width="300" property="remark" label="备注"></el-table-column>
                </el-table>
                <div slot="reference">
                  <el-tag>
                    {{ scope.row.premiumData.length }} 项; 总计:
                    {{ (totalPremium[scope.$index] = scope.row.premiumData.map((r) => r.money).reduce((prev, curr) => Number(prev) + Number(curr))) || totalPremium[scope.$index] }}
                  </el-tag>
                </div>
              </el-popover>
              <el-tag v-else>
                {{ (totalPremium[scope.$index] = 0) || '无' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="总待收">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <div>总待收 = 货品总额 {{ total[scope.$index] }} + 额外费用 {{ totalPremium[scope.$index] }} - 定金 {{ scope.row.downPayment || 0 }}</div>
                <div slot="reference">
                  <el-tag>
                    {{ Number(total[scope.$index]) + Number(totalPremium[scope.$index]) - Number(scope.row.downPayment ? scope.row.downPayment : 0) }} 元; 定金：
                    {{ scope.row.downPayment }}
                  </el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createDate" width="160" label="创建日期"> </el-table-column>
          <el-table-column prop="createName" label="创建人姓名"> </el-table-column>
          <el-table-column prop="type" label="状态">
            <template slot-scope="scope">
              <div class="d-f a-i-c j-c-c">
                <el-button type="primary" round size="small" @click="handleDetail(scope.$index, scope.row)">待发货</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-dropdown>
                <span class="el-dropdown-link ml-10">更多操作<i class="el-icon-arrow-down el-icon--right"></i> </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-tooltip class="item" effect="light" content="删除订单，一般我们是不建议有此操作！" placement="left">
                      <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </el-tooltip>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-tooltip class="item" effect="light" content="此操作，默认已经全部发货，进入待收款状态！" placement="left">
                      <el-button type="text" icon="el-icon-truck" @click="handleDelete(scope.$index, scope.row)">快速发货</el-button>
                    </el-tooltip>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-tooltip class="item" effect="light" content="此操作，默认已经全部发货，并且收到全部货款，进入待确认状态！" placement="left">
                      <el-button type="text" icon="el-icon-bank-card" @click="handleDelete(scope.$index, scope.row)">快速收款</el-button>
                    </el-tooltip>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-tooltip class="item" effect="light" content="此操作，默认已经全部发货，并且收到全部货款。直接确认订单完成，订单流程结束！" placement="left">
                      <el-button type="text" icon="el-icon-magic-stick" @click="handleDelete(scope.$index, scope.row)">快速完成</el-button>
                    </el-tooltip>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-20">
          <el-pagination background @current-change="currentChange" layout="total, prev, pager, next, jumper" :total="totalCount" :current-page="form.pageIndex"></el-pagination>
        </div>
      </div>
    </div>
    <printSetting></printSetting>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import printSetting from '../print/printSetting';
export default {
  data() {
    return {
      form: {
        value: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      editData: {},
      totalCount: 0,
      total: [], // 货品金额统计
      totalPremium: [] // 额外费用统计
    };
  },
  components: {
    printSetting: printSetting
  },
  computed: {
    ...mapState(['projectSort'])
  },
  methods: {
    ...mapActions(['changeProjectSort']),
    getOrderData(type) {
      this.total = [];
      this.totalPremium = [];
      this.$post('queryOrder', Object.assign({}, this.form, { value: this.form.value })).then((r, data = r.data) => {
        this.tableData = data.item;
        this.totalCount = data.totalCount;
      });
    },
    cityRegroup(data) {
      return this.$global.getCityName(data);
    },
    handleAdd() {
      this.$router.push({ path: '/addOrder' });
      this.editData = {};
    },
    handleDetail(...list) {
      this.editData = list[1];
      this.$router.push({ path: '/orderDetail', query: { orderEdit: 1, id: list[1].id } });
      this.bus.$emit('orderdetail', this.editData);
    },
    handleEdit(...list) {
      this.editData = list[1];
      this.$router.push({ path: '/addOrder', query: { orderEdit: 1, id: list[1].id } });
      this.bus.$emit('orderedit', this.editData);
    },
    handleDelete(...list) {
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {});
    },
    currentChange(val) {
      this.form.pageIndex = val;
      this.getOrderData();
    },
    merge(data) {
      let count = 0;
      data.map((r) => {
        count += r.price * r.count;
      });
      return count;
    },
    printSetting() {
      this.bus.$emit('printSetting');
    }
  },
  mounted() {
    if (!this.projectSort.length) {
      // 如果产品分类数据为空，则请求一下分类数据
      this.changeProjectSort();
    }
    this.getOrderData();
    this.bus.$on('order', (msg) => {
      this.getOrderData();
    });
  }
};
</script>
<style lang="stylus" scoped>
.container {
  .handle-input {
    width: 300px;
  }
}

.name-wrapper {
  p {
    margin: 10px 0;
  }
}
</style>
