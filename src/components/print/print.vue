<template>
  <article class="box">
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
        <td style="width:5%">序号</td>
        <td style="width:12%">货品编号</td>
        <td>商品全名</td>
        <td>单价</td>
        <td>数量</td>
        <td>金额</td>
        <td style="width:18%">单据备注</td>
      </tr>
      <tr v-for="(item, index) in data.projectData">
        <td>{{ index + 1 }}</td>
        <td>{{ item.proNumber }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.count }}</td>
        <td>{{ item.price * item.count }}</td>
        <td>{{ item.proRemark || '' }}</td>
      </tr>
    </table>
  </article>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    };
  },
  methods: {},
  computed: {
    getOrderId() {
      return this.$route.query.id;
    }
  },
  mounted() {
    this.$post('./queryOrder', { value: '', pageIndex: 1, pageSize: 10, id: this.getOrderId }).then((r, data = r.data.item) => {
      this.data = data[0];
    });
  }
};
</script>


<style lang="stylus" scoped>
.box {
  font-family: SimSun;
  font-size: 16px;
  width: 80%;
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