<template>
    <div class="customer">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="d-f j-c-s-b mb-20">
                <div>
                    <el-button
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="dialogFormVisible = true"
                    >新增客户</el-button>
                </div>
                <div>
                    <el-input
                        v-model="query.name"
                        placeholder="请输入..."
                        class="handle-input mr-10 ml-10"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="id" width="50"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="phone" label="联系方式"></el-table-column>
                    <el-table-column prop="address" label="联系地址">
                        <template slot-scope="scope">
                            <span>{{ cityRegroup(scope.row.address) + scope.row.detailAddress }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="首次交易日期"></el-table-column>
                    <el-table-column label="最近交易日期"></el-table-column>
                    <el-table-column label="头像"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                            >编辑</el-button>
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <Addcustomer :dialogFormVisible="dialogFormVisible" @dialog></Addcustomer>
        </div>
    </div>
</template>

<script>
import Addcustomer from '../common/Addcustomer';
import city from '../../global/city.js';
export default {
    data: function() {
        return {
            query: {
                address: '',
                name: ''
            },
            tableData: [],
            dialogFormVisible: false
        };
    },
    components: {
        Addcustomer
    },
    methods: {
        getCustData() {
            this.$post('queryCust', {}).then((r, data = r.data) => {
                this.tableData = data.item;
            });
        },
        cityRegroup (data) {
          console.log(data)
          return ''
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