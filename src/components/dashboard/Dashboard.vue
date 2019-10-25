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
              <p class="f-20 c-666">
                <svg class="icon f-28" aria-hidden="true">
                  <use :xlink:href='getDate.icon'></use>
                </svg>
                {{getDate.text}}，{{ commonInfo.name }}，祝你开心每一天！
              </p>
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
          <el-col :span="8" v-for="(item, index) in commonInfo.orderInfo" :key="index">
            <el-card shadow="hover">
              <el-link :underline="false" class="f-20 number-font-family" type="primary">{{ item.orderId }}</el-link>
              <div class="card-project">
                {{ item.projectData.length }} 项, 总计：{{ item.projectData.length === 1 ? item.projectData.map(r => r.price * r.count)[0] : merge(item.projectData) }}
              </div>
              <div class="d-f j-c-s-b">
                <span>
                  {{ item.salesName }}
                </span>
                <span>
                  {{ item.createDate }}
                </span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'dashboard',
  data() {
    return {
      dateArr:[
        {icon: '#icon-zaoshang', text: '早上好'},
        {icon: '#icon-taiyang', text: '中午好'},
        {icon: '#icon-xiawu', text: '下午好'},
        {icon: '#icon-tianqitubiao-', text: '晚上好'},
        {icon: '#icon-zhishifufeiqiapianicon-', text: '夜深人静了'}
      ]
    };
  },
  computed: {
    ...mapState(['commonInfo']),
    getDate() {
      let date = new Date().getHours(),
      index = 0
      if (7 <= date && date <= 10) { // 07:00 ~ 09:59
        index = 0
      } else if (11 <= date && date <= 13) {  // 11:00 ~ 13:59
        index = 1
      } else if (14 <= date && date <= 17) {  // 14:00 ~ 17:59
        index = 2
      } else if (18 <= date && date <= 21) { // 18:00 ~ 21:59
        index = 3
      } else {
        index = 4
      }
      return this.dateArr[index]
    }
  },
  mounted() {
    this.getCommonInfo();
  },
  methods: {
    ...mapActions(['getCommonInfo']),
    merge(data) {
      let count = 0;
      data.map(r => {
        count += r.price * r.count;
      });
      return count;
    }
  }
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

  .card-project {
    color: rgba(0, 0, 0, 0.45);
    line-height: 50px;
  }
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
  }
}
</style>