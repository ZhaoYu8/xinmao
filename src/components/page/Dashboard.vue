<template>
  <div class="dashboard">
    <div class="page-header">
      <p class="f-16 f-w">
        工作台
      </p>
      <div class="page-header-content">
        <el-row :gutter="10" class="d-f a-i-c">
          <el-col :span="18" class="d-f a-i-c">
            <div class="avatar-image">
              <img src="../../assets/img/Bia.png" alt="" />
            </div>
            <div class="ml-20">
              <p class="f-20 c-666">早安，赵宇，祝你开心每一天！</p>
              <p class="f-18 c-999">
                职务
                <el-divider direction="vertical"></el-divider>
                总经理
              </p>
            </div>
          </el-col>
          <el-col :span="6" class="d-f a-i-c j-c-f-e mr-20">
            <ul class="mr-10">
              <li class="f-20">订单数</li>
              <li class="f-20 f-w t-c">321</li>
            </ul>
            <el-divider direction="vertical"></el-divider>
            <ul class="ml-10">
              <li class="f-20">销售排名</li>
              <li class="f-20 f-w t-c">8/24</li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row class="mt-20">
      <el-col :span="15" class="card">
        <div class="d-f j-c-s-b a-i-c mlr-10">
          <span class="pt-15 pb-15">进行中的项目</span>
          <el-button type="text">全部项目</el-button>
        </div>
        <el-row :gutter="0">
          <el-col :span="8" v-for="item in 3" :key="item">
            <el-card shadow="hover">
              <i class="el-icon-apple"></i>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {};
  },
  components: {},
  computed: {},
  created() {},
  methods: {}
};
</script>


<style lang="stylus" scoped>
.page-header {
  box-sizing: border-box;
  margin: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  padding: 16px 14px;
  background: #fff;

  .page-header-content {
    margin-top: 10px;

    .avatar-image {
      width: 72px;
      height: 72px;
      border-radius: 72px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.card {
  background: #fff;
  border-radius: 5px;
}
</style>
<style lang="stylus">
.dashboard {
  .el-divider--vertical {
    height: 40px;
  }

  .el-card, .el-message {
    box-shadow: 1px 0 0 0 #e8e8e8, 0 1px 0 0 #e8e8e8, 1px 1px 0 0 #e8e8e8, inset 1px 0 0 0 #e8e8e8, inset 0 1px 0 0 #e8e8e8;
    border-radius: 0;
    border: 0;
    padding: 24px;
  }
}
</style>