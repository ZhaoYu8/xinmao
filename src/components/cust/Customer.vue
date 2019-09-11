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
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增客户</el-button>
        </div>
        <div>
          <el-input
            v-model="form.inputValue"
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
        <el-table :data="tableData" border height="550" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="联系方式"></el-table-column>
          <el-table-column prop="address" width="220" label="联系地址">
            <template slot-scope="scope">
              <span>{{ cityRegroup(scope.row.address) + scope.row.detailAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createDate1" label="创建日期"></el-table-column>
          <el-table-column prop="createName" label="创建人姓名"></el-table-column>
          <el-table-column label="最近交易日期"></el-table-column>
          <el-table-column label="头像"></el-table-column>
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
      <Addcustomer :dialogType="custType" :dialogFormVisible="dialogFormVisible" @dialog="controlDialog" :editData="editData"></Addcustomer>
    </div>
  </div>
</template>

<script>
import Addcustomer from '../cust/Addcustomer';
export default {
  data() {
    return {
      form: {
        inputValue: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      dialogFormVisible: false,
      custType: false,
      editData: {},
      totalCount: 0
    };
  },
  components: {
    Addcustomer
  },
  methods: {
    getCustData(type) {
      this.$post('queryCust', Object.assign({}, this.form, { value: this.form.inputValue })).then((r, data = r.data) => {
        this.tableData = data.item;
        this.totalCount = data.totalCount;
      });
    },
    cityRegroup(data) {
      return this.$global.getCityName(data);
    },
    controlDialog(data) {
      this.dialogFormVisible = false;
      // 这里做了一下处理，新增之后调用分页方法，重置当前页
      if (data) this.currentChange(1);
    },
    handleAdd() {
      this.editData = {};
      this.custType = false;
      this.dialogFormVisible = true;
    },
    handleEdit(...list) {
      this.editData = list[1];
      this.custType = true;
      this.dialogFormVisible = true;
    },
    handleDelete(...list) {
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('deleteCust', { id: list[1].id }).then(data => {
          this.getCustData();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },
    currentChange(val) {
      this.form.pageIndex = val;
      this.getCustData();
    }
  },
  mounted() {
    this.getCustData();
  }
};
</script>
<style lang="stylus" scoped>
.container {
  .handle-input {
    width: 300px;
  }
}
</style>