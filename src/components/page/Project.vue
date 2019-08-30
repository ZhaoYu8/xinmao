<template>
    <div class="project">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-menu"></i> 产品信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-col :span="24">
                <el-tabs v-model="activeName" type="card">
                    <!-- 产品 -->
                    <el-tab-pane name="first">
                        <span slot="label">
                            <i class="el-icon-shopping-cart-full"></i> 产品
                        </span>
                        <div class="d-f j-c-s-b mb-20">
                            <div>
                                <el-button
                                    type="primary"
                                    icon="el-icon-circle-plus-outline"
                                    @click="handleAdd"
                                >新增产品</el-button>
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
                                <el-button
                                    type="primary"
                                    icon="el-icon-search"
                                    @click="currentChange(1)"
                                >搜索</el-button>
                            </div>
                        </div>
                        <div class="t-c">
                            <el-table :data="tableData" border height="520" style="width: 100%">
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column prop="name" label="产品名称"></el-table-column>
                                <el-table-column prop="name" label="产品分类"></el-table-column>
                                <el-table-column prop="phone" label="单价"></el-table-column>
                                <el-table-column prop="phone" label="成本"></el-table-column>
                                <el-table-column prop="createDate1" label="创建日期"></el-table-column>
                                <el-table-column prop="createName" label="创建人姓名"></el-table-column>
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
                            <div class="mt-20">
                                <el-pagination
                                    background
                                    @current-change="currentChange"
                                    layout="total, prev, pager, next, jumper"
                                    :total="totalCount"
                                    :current-page="form.pageIndex"
                                ></el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 分类 -->
                    <el-tab-pane name="second">
                        <span slot="label">
                            <i class="el-icon-goods"></i> 分类
                        </span>
                        <el-button
                            type="primary"
                            icon="el-icon-circle-plus-outline"
                            class="mb-10"
                            @click="sortAdd"
                        >新增分类</el-button>
                        <el-tree
                            :data="treeData"
                            node-key="id"
                            default-expand-all
                            draggable
                            :allow-drop="allowDrop"
                            :allow-drag="allowDrag"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => append(data)"
                                    >修改</el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => remove(node, data)"
                                    >删除</el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <Addproject
                :dialogType="projectType"
                :dialogFormVisible="projectVisible"
                @dialog="controlDialog"
                :editData="editData"
            ></Addproject>
            <AddProjectSort
                :dialogType="sortType"
                :dialogFormVisible="sortVisible"
                @dialog="controlDialog"
                :editData="sortEditData"
            ></AddProjectSort>
        </div>
    </div>
</template>

<script>
import Addproject from '../project/Addproject';
import AddProjectSort from '../project/AddProjectSort';
export default {
    data() {
        return {
            form: {
                inputValue: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            projectVisible: false, // 产品显示
            sortVisible: false, // 分类显示
            projectType: false, // 产品新增修改
            sortType: false, // 分类新增修改
            editData: {},
            sortEditData: {},
            totalCount: 0,
            activeName: 'first',
            treeData: [
                { id: 2, label: '测试1' },
                {
                    id: 1,
                    label: '测试2',
                    children: [{ id: 2, label: '321', children: [{ id: 2, label: '321', children: [{ id: 2, label: '321' }] }] }]
                }
            ]
        };
    },
    components: {
        Addproject,
        AddProjectSort
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
            this.projectVisible = false;
            this.sortVisible = false;
            // 这里做了一下处理，新增之后调用分页方法，重置当前页
            if (data) this.currentChange(1);
        },
        handleAdd() {
            this.editData = {};
            this.projectType = false;
            this.projectVisible = true;
        },
        sortAdd () {
            this.sortEditData = {};
            this.sortType = false;
            this.sortVisible = true;
        },
        handleEdit(...list) {
            this.editData = list[1];
            this.projectType = true;
            this.projectVisible = true;
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
  overflow: hidden;

  .handle-input {
    width: 300px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>