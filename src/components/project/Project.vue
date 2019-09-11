<template>
  <div class="project">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item> <i class="el-icon-menu"></i> 产品信息 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-col :span="24">
        <el-tabs v-model="activeName" type="card">
          <!-- 产品 -->
          <el-tab-pane name="first">
            <span slot="label"> <i class="el-icon-shopping-cart-full"></i> 产品 </span>
            <div class="d-f j-c-s-b mb-20">
              <div>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addProject">新增产品</el-button>
              </div>
              <div>
                <el-input
                  v-model="form.inputValue"
                  placeholder="可根据姓名或者手机号搜索"
                  @keyup.enter.native="getProjectData"
                  class="handle-input mr-10 ml-10"
                  clearable
                  @clear="getProjectData"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="currentChange(1)">搜索</el-button>
              </div>
            </div>
            <div class="t-c">
              <el-table :data="tableData" border height="520" style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="产品名称"></el-table-column>
                <el-table-column label="产品分类">
                  <template slot-scope="scope">
                    <span>{{ sortStrig(scope.row.sort) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="units" label="单位"></el-table-column>
                <el-table-column prop="cost" label="单价"></el-table-column>
                <el-table-column prop="price" label="成本"></el-table-column>
                <el-table-column label="产品图片">
                  <template slot-scope="scope">
                    <div class="d-f a-i-c j-c-s-a">
                      <el-image
                        v-if="scope.row.photo.length"
                        style="width: 50px; height: 50px"
                        :src="scope.row.photo[0].url"
                        :preview-src-list="scope.row.photo.map(r => r.url)"
                      >
                      </el-image>
                      <img v-else style="width: 50px; height: 50px" src="../../assets/img/img.jpg" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createDate1" label="创建日期"></el-table-column>
                <el-table-column prop="createName" label="创建人姓名"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="editProject(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="delProject(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="mt-20">
                <el-pagination background @current-change="currentChange" layout="total, prev, pager, next, jumper" :total="totalCount" :current-page="form.pageIndex"></el-pagination>
              </div>
            </div>
          </el-tab-pane>

          <!-- 分类 -->
          <el-tab-pane name="second">
            <span slot="label"> <i class="el-icon-goods"></i> 分类 </span>
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="mb-10" @click="sortAdd({})">新增分类</el-button>
            <el-tree :data="treeData" node-key="id" default-expand-all :props="{ children: 'children', label: 'name' }" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" icon="el-icon-add-location" size="mini" @click.stop="sortAdd(data, node)">新增</el-button>
                  <el-button type="text" icon="el-icon-edit" size="mini" @click.stop="editSort(node, data)">修改</el-button>
                  <el-button type="text" icon="el-icon-delete" size="mini" @click.stop="delSort(node, data)">删除</el-button>
                </span>
              </span>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <Addproject :treeData="treeData" :dialogType="projectType" :dialogFormVisible="projectVisible" @dialog="controlDialog" :editData="editData"></Addproject>
      <AddProjectSort :treeData="treeData" :dialogType="sortType" :dialogFormVisible="sortVisible" @dialog="projectSortDialog" :editData="sortEditData"></AddProjectSort>
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
      treeData: [],
      rawTreeData: [] // 原始treeData
    };
  },
  components: {
    Addproject,
    AddProjectSort
  },
  methods: {
    // 查询产品列表
    getProjectData(type) {
      this.$post('queryProject', Object.assign({}, this.form, { value: this.form.inputValue })).then((r, data = r.data) => {
        this.tableData = data.item;
        this.totalCount = data.totalCount;
      });
    },
    getProjectSort() {
      this.$post('querySort', {}).then((r, data = r.data) => {
        this.treeData = this.$global.dataBase(data.item);
        this.rawTreeData = data.item;
      });
    },
    // 子组件传递过来的方法
    controlDialog(data) {
      this.projectVisible = false;
      // 这里做了一下处理，新增之后调用分页方法，重置当前页
      if (data) this.currentChange(1);
    },
    projectSortDialog(data) {
      this.sortVisible = false;
      if (data) this.getProjectSort();
    },
    // 新增产品
    addProject() {
      this.editData = {};
      this.projectType = false;
      this.projectVisible = true;
    },
    // 修改产品
    editProject(...list) {
      this.editData = list[1];
      this.projectType = true;
      this.projectVisible = true;
    },
    // 删除产品
    delProject(...list) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('delProject', { id: list[1].id }).then(data => {
          this.getProjectData();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },
    // 新增分类
    sortAdd(list = {}, node) {
      if (node && node.level > 3) {
        this.$notify({
          title: '警告',
          message: '分类最多4个层级！这是第四层！',
          type: 'warning'
        });
        return;
      }
      this.sortEditData = list.id ? { name: '', parent: list.id } : {};
      this.sortType = false;
      this.sortVisible = true;
    },
    editSort(...list) {
      this.sortEditData = list[1];
      this.sortType = true;
      this.sortVisible = true;
    },
    delSort(...list) {
      if (list[1].children) {
        this.$alert('此分类有子元素，必须先删除掉所有的子元素！', '提示');
        return;
      }
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('delSort', { id: list[1].id }).then(data => {
          this.getProjectSort();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },
    // 点击分页
    currentChange(val) {
      this.form.pageIndex = val;
      this.getProjectData();
    },
    sortStrig(v) {
      // 根据id返回name
      let arr = v.split(',');
      if (arr.length > 1) {
        return arr
          .map(r => {
            let text = this.rawTreeData.filter(n => n.id === Number(r))[0];
            return (text && text.name) || '';
          })
          .join('/');
      } else {
        let text = this.rawTreeData.filter(n => n.id === Number(arr[0]))[0];
        return (text && text.name) || '';
      }
    }
  },
  mounted() {
    this.getProjectData();
    this.getProjectSort();
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