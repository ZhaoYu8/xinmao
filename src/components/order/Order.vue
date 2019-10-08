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
        </div>
        <div>
          <el-input
            v-model="form.value"
            placeholder="可根据姓名或者手机号搜索"
            @keyup.enter.native="getCustData"
            class="handle-input mr-10 ml-10"
            clearable
            @clear="getCustData"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="currentChange(1)">搜索</el-button>
        </div>
      </div>
      <div class="t-c">
        <el-table :data="tableData" border height="650" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="custName" label="客户信息">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top" popper-class="name-wrapper">
                <p>姓名: {{ scope.row.custName }}</p>
                <p>联系地址: {{ scope.row.custAddress }}</p>
                <div slot="reference">
                  <el-tag>{{ scope.row.custName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="联系方式"></el-table-column>
          <el-table-column prop="address" width="220" label="联系地址">
            <template slot-scope="scope">
              <span>{{ cityRegroup(scope.row.address) + scope.row.shipping }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salesName" label="销售"></el-table-column>
          <el-table-column prop="project" label="产品">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <el-table :data="scope.row.tableData">
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
                    {{ scope.row.tableData.length }} 项; 总计:
                    {{ scope.row.tableData.map(r => r.price * r.count).reduce((prev, curr) => prev + curr) }}
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
                    {{ scope.row.premiumData.map(r => r.money).reduce((prev, curr) => Number(prev) + Number(curr)) }}
                  </el-tag>
                </div>
              </el-popover>
              <el-tag v-else>无</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createDate1" width="200" label="创建日期">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createDate1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="创建人姓名"> </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-20">
          <el-pagination background @current-change="currentChange" layout="total, prev, pager, next, jumper" :total="totalCount" :current-page="form.pageIndex"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
      totalCount: 0
    };
  },
  components: {},
  computed: {
    ...mapState(['projectSort'])
  },
  methods: {
    ...mapActions(['changeProjectSort']),
    getCustData(type) {
      this.$post('queryOrder', Object.assign({}, this.form, { value: this.form.value })).then((r, data = r.data) => {
        this.tableData = data.item;
        this.totalCount = data.totalCount;
      });
    },
    cityRegroup(data) {
      return this.$global.getCityName(data);
    },
    controlDialog(data) {
      // 这里做了一下处理，新增之后调用分页方法，重置当前页
      if (data) this.currentChange(1);
    },
    handleAdd() {
      this.$router.push({ path: '/addOrder' });
      this.editData = {};
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
      this.getCustData();
    }
  },
  mounted() {
    if (!this.projectSort.length) {
      // 如果产品分类数据为空，则请求一下分类数据
      this.changeProjectSort();
    }
    this.getCustData();
    this.bus.$on('order', msg => {
      this.getCustData();
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