<template>
  <div class="user">
    <div class="crumbs">
      <el-breadcrumb>
        <el-breadcrumb-item> <i class="el-icon-menu"></i> 员工管理 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row>
        <el-col :span="4" class="department p-10">
          <header class="d-f j-c-s-b a-i-c mb-10">
            <span>部门</span>
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addBranch">新增部门</el-button>
          </header>
          <el-tree :data="baseBranch" :props="{ children: 'children', label: 'name' }" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button type="text" icon="el-icon-add-location" size="mini" @click.stop="addBranch(data, node)"></el-button>
                <el-button type="text" icon="el-icon-edit" size="mini" @click.stop="editBranch(node, data)"></el-button>
                <el-button type="text" icon="el-icon-delete" size="mini" @click.stop="delBranch(node, data)"></el-button>
              </span>
            </span>
          </el-tree>
        </el-col>
        <el-col :span="20" class="pl-20">
          <div class="d-f j-c-f-e a-i-c">
            状态：
            <el-radio-group v-model="userType" size="small">
              <el-radio-button label="1">正常</el-radio-button>
              <el-radio-button label="0">删除</el-radio-button>
            </el-radio-group>
            <el-input
              v-model="form.value"
              placeholder="可根据姓名或者手机号搜索"
              @keyup.enter.native="getProjectData"
              class="handle-input mr-10 ml-10 width-300"
              clearable
              @clear="getProjectData"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="currentChange(1)">搜索</el-button>
          </div>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addUser" class="mb-10">新增员工</el-button>
          <el-table :data="tableData" border height="620" style="width: 100%" class="table-color">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="员工名称"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column prop="address" width="220" label="地址">
              <template slot-scope="scope">
                <span>{{ $global.getCityName(scope.row.address) + (scope.row.detailAddress || '无') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别">
              <template slot-scope="scope">
                <span>{{ scope.row.sex ? '男' : '女' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门">
              <template slot-scope="scope">
                <span> {{ $global.sortStrig(scope.row.branch, branch) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="position" label="职位"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" @click="editUser(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" class="red" @click="delUser(scope.$index, scope.row)">{{ scope.row.dr === 1 ? '删除': '启用' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-20 t-c">
            <el-pagination background @current-change="currentChange" layout="total, prev, pager, next, jumper" :total="totalCount" :current-page="form.pageIndex"></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <addBranch :treeData="baseBranch" :dialogType="branchType" :dialogFormVisible="branchVisible" @dialog="dialogConfirm" :editData="branchEditData"></addBranch>
    <addUser :treeData="baseBranch" @dialog="userConfirm"></addUser>
  </div>
</template>

<script>
import addBranch from './addBranch';
import addUser from './addUser';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      branchVisible: false,
      branchEditData: {},
      branchType: false,
      tableData: [],
      form: {
        value: '',
        pageIndex: 1,
        pageSize: 10
      },
      totalCount: 0,
      userType: 1
    };
  },
  components: {
    addBranch,
    addUser
  },
  computed: {
    ...mapState(['branch', 'baseBranch'])
  },
  methods: {
    ...mapActions(['getBranch']),
    handleNodeClick(...val) {
      console.log(val);
    },
    dialogConfirm(val) {
      // 新增修改分支确定
      if (val) this.getBranch();
      this.branchVisible = false;
    },
    userConfirm(val) {
      if (val) this.httpGetUser();
    },
    addBranch(list = {}, node) {
      // 新增部门
      if (node && node.level > 3) {
        this.$notify({
          title: '警告',
          message: '分类最多4个层级！这是第四层！',
          type: 'warning'
        });
        return;
      }
      this.branchEditData = list.id ? { name: '', parent: list.id } : {};
      this.branchVisible = true;
      this.branchType = false;
    },
    editBranch(...list) {
      // 修改分支
      this.branchEditData = list[1];
      this.branchType = true;
      this.branchVisible = true;
    },
    delBranch(...list) {
      if (list[1].children) {
        this.$alert('此分类有子元素，必须先删除掉所有的子元素！', '提示');
        return;
      }
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('delBranch', { id: list[1].id }).then(data => {
          this.getBranch();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
        });
      });
    },
    addUser() {
      // 新增员工
      this.bus.$emit('dialogUser', true);
    },
    editUser(data) {
      this.bus.$emit('dialogUser', false, data);
    },
    delUser(i, data) {
      this.$confirm(data.dr ? '你正在进行删除操作，确定删除吗？' : '你正在进行启用操作，确定启用吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('/deleteUser', { dr: data.dr ? 0 : 1, id: data.id }).then((r, data = r.data) => {
          this.$notify({
            title: '成功',
            message: data.dr ? '删除成功' : '启用成功',
            type: 'success'
          });
          this.httpGetUser();
        });
      });
    },
    currentChange(val) {
      this.form.pageIndex = val;
      this.httpGetUser();
    },
    httpGetUser() {
      this.$post('/queryUser', Object.assign({}, this.form, {dr: this.userType})).then((r, data = r.data) => {
        this.tableData = data.item;
        this.totalCount = data.totalCount;
      });
    }
  },
  mounted() {
    this.getBranch();
    this.httpGetUser();
  }
};
</script>
<style lang="stylus" scoped>
.container {
  .department {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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