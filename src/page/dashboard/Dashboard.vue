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
              <p class="f-20 c-666 f-w mb-10">
                <!-- <svg class="icon f-28" aria-hidden="true">
                  <use :xlink:href="getDate.icon"></use>
                </svg> -->
                {{ dateText }}，{{ commonInfo.name }}，祝你开心每一天！
              </p>
              <p class="header-tip-desc" v-if="weather_1">
                <svg class="icon f-28" aria-hidden="true">
                  <use :xlink:href="'#' + weatherIcon"></use>
                </svg>
                {{ weather.city + `今天天气` + '，' + weather_0.wea + '，' + weather_0.tem2 + ' ~ ' + weather_0.tem1 + ' ' + weather_0.air_tips }}
                {{ `明天天气 ` + '，' + weather_1.wea + '，' + weather_1.tem2 + ' ~ ' + weather_1.tem1 }}
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
    <el-row class="mt-10">
      <el-col :span="15" class="card">
        <div class="d-f j-c-s-b a-i-c mlr-10">
          <span class="pt-15 pb-15">进行中的项目</span>
          <el-button type="text">全部项目</el-button>
        </div>
        <el-row :gutter="0">
          <el-col :span="8" v-for="(item, index) in commonInfo.orderInfo" :key="index">
            <el-card shadow="hover">
              <div class="d-f a-i-c j-c-s-b">
                <el-link :underline="false" @click="link(item)" class="f-20 number-font-family" type="primary">{{ item.orderId }}</el-link>
                <svg class="icon f-28 c-p" aria-hidden="true">
                  <use xlink:href="#icon-model"></use>
                </svg>
              </div>
              <div class="card-project">
                {{ item.projectData.length }} 项, 总计：{{ item.projectData.length === 1 ? item.projectData.map((r) => r.price * r.count)[0] : merge(item.projectData) }}
              </div>
              <div class="d-f j-c-s-b a-i-c">
                <span>
                  {{ item.salesName }}
                </span>
                <span>
                  <svg class="icon f-28 c-p" aria-hidden="true">
                    <use xlink:href="#icon-shijianjiedian"></use>
                  </svg>
                  {{ item.createDate }}
                </span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-card class="mt-10">
      <div slot="header" class="d-f j-c-s-b">
        <p><i class="el-icon-s-data circle"></i><span class="ml-10">销售额 2019</span></p>
        <div>
          <el-date-picker v-model="pickerData" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" class="dashboardDate"> </el-date-picker>
        </div>
      </div>
      <el-row class=" b-c-1">
        <el-col :span="15"> <div id="c1"></div></el-col>
        <el-col :span="9" :style="{ height: tableHeight + 'px' }" class="d-f f-d-c">
          <p class="mb-10">客户销售额排行榜</p>
          <ul class="f-1 d-f j-c-s-b f-d-c">
            <li v-for="(item, index) in 7" :key="index">
              <el-row>
                <el-col :span="18">
                  <span :class="index < 3 ? 'circle' : 'circle-darkly'" class="mr-10">{{ item }}</span>
                  <span>{{ '王记茶行 ' + index + ' 号店' }}</span>
                </el-col>
                <el-col :span="6" class="t-r">
                  12345
                </el-col>
              </el-row>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'dashboard',
  data() {
    return {
      dateArr: ['早上好', '中午好', '下午好', '晚上好', '夜深人静了'],
      weather: {},
      G2Data: [
        { month: '1月', sold: 130000 },
        { month: '2月', sold: 110000 },
        { month: '3月', sold: 90000 },
        { month: '4月', sold: 40000 },
        { month: '5月', sold: 50000 },
        { month: '6月', sold: 60000 },
        { month: '7月', sold: 70000 },
        { month: '8月', sold: 80000 },
        { month: '9月', sold: 90000 },
        { month: '10月', sold: 100000 },
        { month: '11月', sold: 110000 },
        { month: '12月', sold: 120000 }
      ],
      pickerData: '',
      tableHeight: 300
    };
  },
  computed: {
    ...mapState(['commonInfo']),
    dateText() {
      let date = new Date().getHours(),
        index = 0;
      if (7 <= date && date <= 10) {
        // 07:00 ~ 09:59
        index = 0;
      } else if (11 <= date && date <= 13) {
        // 11:00 ~ 13:59
        index = 1;
      } else if (14 <= date && date <= 17) {
        // 14:00 ~ 17:59
        index = 2;
      } else if (18 <= date && date <= 21) {
        // 18:00 ~ 21:59
        index = 3;
      } else {
        index = 4;
      }
      return this.dateArr[index];
    },
    weatherIcon() {
      let arr = [
        { id: 'xue', name: 'icon-daxue' },
        { id: 'lei', name: 'icon-leizhenyu' },
        { id: 'shachen', name: 'icon-shachenbao' },
        { id: 'wu', name: 'icon-wu' },
        { id: 'bingbao', name: 'icon-leizhenyubanyoubingbao' },
        { id: 'yun', name: 'icon-duoyun' },
        { id: 'yu', name: 'icon-dayu' },
        { id: 'yin', name: 'icon-yintian' },
        { id: 'qing', name: 'icon-qing' }
      ];
      return arr.filter((r) => r.id === this.weather_0.wea_img)[0].name;
    },
    weather_0() {
      return this.weather.data && this.weather.data[0];
    },
    weather_1() {
      return this.weather.data && this.weather.data[1];
    }
  },
  mounted() {
    this.getCommonInfo();
    this.$post('./weather').then((data) => {
      this.weather = data.data.item;
    });
    this.bus.$off('openDashboard');
    this.bus.$on('openDashboard', () => {
      this.getCommonInfo();
    });
    const chart = new G2.Chart({
      container: 'c1',
      forceFit: true,
      height: this.tableHeight,
      padding: [20, 20, 20, 60]
    });
    chart.source(this.G2Data);
    chart.interval().position('month*sold');
    chart.scale('sold', {
      alias: '销售额(元)'
    });
    chart.render();
  },
  methods: {
    ...mapActions(['getCommonInfo']),
    merge(data) {
      let count = 0;
      data.map((r) => {
        count += r.price * r.count;
      });
      return count;
    },
    link(item) {
      this.$router.push({ path: '/orderDetail', query: { orderEdit: 1, id: item.id } });
      this.bus.$emit('orderdetail', item);
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
  padding: 12px 14px;
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
    .header-tip-desc {
      color :#808695
      font-size 16px
    }
  }
}

.card {
  background: #fff;
  border-radius: 5px;

  .card-project {
    color: rgba(0, 0, 0, 0.45);
    line-height: 30px;
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
  .dashboardDate {
    width: 240px;
    height: 30px;
    line-height: 30px;
    .el-range-separator,.el-range__icon {
      line-height 22px
    }
  }
  .el-card__body {
    padding 16px 20px
  }
}
</style>
