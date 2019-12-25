<template>
  <article class="box" :style="{ width: type ? '80%' : '100%' }">
    <header>
      <h1 class="t-c f-28">鑫茂杯业销售单</h1>
    </header>
    <section class="d-f j-c-s-b ml-10 mt-10">
      <div>
        <span>录单日期:</span><span class="Verdana">{{ data.orderDate }}</span>
      </div>
      <div>
        <span>单据编号:</span><span class="Tahoma">{{ data.orderId }}</span>
      </div>
    </section>
    <section class="d-f j-c-s-b ml-10 mt-10">
      <div>
        <span>购买单位:</span><span class="Verdana">{{ data.custName }}</span>
      </div>
      <div>
        <span>联系电话:</span><span class="Tahoma">{{ data.phone }}</span>
      </div>
    </section>

    <table border="1" cellspacing="0">
      <tr>
        <td style="width:10%">序号</td>
        <td style="width:12%">货品编号</td>
        <td>商品全名</td>
        <td>单价</td>
        <td>数量</td>
        <td>金额</td>
        <td style="width:18%">单据备注</td>
      </tr>
      <tr v-for="(item, index) in data.productData">
        <td>{{ index + 1 }}</td>
        <td>{{ item.proNumber }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.count }}</td>
        <td>{{ item.price * item.count }}</td>
        <td>{{ item.proRemark || '' }}</td>
      </tr>
      <tr>
        <td>总计</td>
        <td colspan="3">{{ digitUppercase(priceTotal) }}</td>
        <td>{{ numberTotal }}</td>
        <td>{{ priceTotal }}</td>
        <td></td>
      </tr>
    </table>

    <footer class="mt-20 f-20">
      <ul v-if="this.printData.isCustAddress === 'true'" class="d-f j-c-s-b l-40">
        <li>客户地址：{{ data.custAddress }}</li>
        <li>联系方式：{{ data.phone }}</li>
      </ul>
      <ul class="d-f l-40 f-d-c">
        <li class="d-f j-c-s-b w-100">
          <p>
            公司地址：<span>{{ printData.address }}</span>
          </p>
          <p>
            联系信息：{{ printData.name }}
            <span>{{ printData.phone && printData.phone.split(',')[0] }}</span>
            <span class="ml-20" v-show="printData.phone.split(',')[1]">{{ printData.phone && printData.phone.split(',')[1] }}</span>
          </p>
        </li>
        <li class="w-100" v-if="printData.bank">
          <div v-for="(item, index) in printData.bank.split(',')" :key="index" class="d-f w-50 j-c-s-b fl">
            <p class="f-2">支付方式：{{ item }}</p>
            <p class="f-3">账户：{{ printData.account.split(',')[index] }}</p>
          </div>
        </li>
      </ul>
    </footer>
    <div id="qrcode" class="mt-10"></div>
    <el-button type="primary" class="mt-20 m-0-a d-f" @click="okPrint" v-show="type">打印</el-button>
  </article>
</template>

<script>
import QRCode from 'qrcodejs2'; // 引入qrcode
export default {
  data() {
    return {
      data: {},
      printData: {},
      type: true
    };
  },
  methods: {
    okPrint() {
      this.type = false;
      this.$nextTick(() => {
        window.print();
        this.type = true;
      });
    },
    qrcode() {
      let qrcode = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: 'www.baidu.com?id=123', // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      });
    },
    digitUppercase(n) {
      let fraction = ['角', '分'];
      let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      let unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ];
      let head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      let s = '';
      for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = '';
        for (let j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整')
      );
    }
  },
  computed: {
    getOrderId() {
      return this.$route.query.id;
    },
    numberTotal() {
      let count = 0;
      if (!this.data.productData) return count;
      this.data.productData.map((r) => {
        count += Number(r.count);
      });
      return count;
    },
    priceTotal() {
      let count = 0;
      if (!this.data.productData) return count;
      this.data.productData.map((r) => {
        count += Number(r.count) * Number(r.price);
      });
      return count;
    }
  },
  mounted() {
    this.$post('./queryOrder', { value: '', pageIndex: 1, pageSize: 10, id: this.getOrderId }).then((r, data = r.data.item) => {
      this.data = data[0];
    });
    this.$post('./queryPrint', {}).then((r, data = r.data.item) => {
      this.printData = data[0];
      if (!data.length) {
        this.$alert('你还没有进行打印设置，请前往《订单管理》页面，完成打印设置！点击确定，即将关闭此页面！', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            window.close();
          }
        });
      } else {
        if (this.printData.isQrcode === 'true') this.qrcode();
      }
    });
    // this.qrcode();
  }
};
</script>

<style lang="stylus" scoped>
.box {
  font-family: SimSun;
  font-size: 16px;
  margin: 0 auto;
  margin-top: 50px;

  table, table tr th, table tr td {
    padding: 6px 0px;
    border-color: #bbb;
  }

  table {
    margin-top: 10px;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }
}
</style>
