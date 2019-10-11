import city from './city'
let obj = {
  getCookie(n, name = `${n}=`) { // 根据名称查找cookie
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  },
  getCityName(l) {
    if (!l) return ''
    let list = Array.isArray(l) ? l : l.split(',')
    let data = '', arr = []
    arr[0] = this.getName(city, list[0])
    arr[1] = this.getName(arr[0].children, list[1])
    arr[2] = this.getName(arr[1].children, list[2])
    arr.map(r => data += r.label + '/')
    return data
  },
  getName(data, val) {
    let str = {}
    for (let i = 0; i < data.length; i++) {
      let n = data[i]
      if (n.value === val) {
        str = n
        break
      }
    }
    return str
  },
  dataBase(data, obj = {}) { // 产品分类信息重组
    data.map(item => obj[item.id] = item)
    data.map(item => {
      if (item.parent !== 0) obj[item.parent].children ? obj[item.parent].children.push(item) : obj[item.parent].children = [item];
    })
    return data.filter(item => item.parent === 0)
  },
  sortStrig(v, data) {
    // 根据id返回name
    let arr = v.split(',');
    if (arr.length > 1) {
      return arr
        .map(r => {
          let text = data.filter(n => n.id === Number(r))[0];
          return (text && text.name) || '';
        })
        .join('/');
    } else {
      let text = data.filter(n => n.id === Number(arr[0]))[0];
      return (text && text.name) || '';
    }
  },
  Multiply(...args) { // x
    if (args.length < 2) return args[0];
    let m = 0;
    let items = [];
    for (let i = 0; i < args.length; i++) {
      let item = args[i].toString();
      item.split('.')[1] && (m += item.split('.')[1].length); // 计算小数总长度m
      items.push(item.replace('.', '')); // 将数字转为整数
    }
    return items.reduce((prev, curr) => (prev * curr)) / 10 ** m; // 转换后的整数相乘, 再除以10的m次方
  },
  Add(...args) { // +
    if (args.length < 2) return args[0];
    let decimals = [];
    let items = [];
    for (let i = 0; i < args.length; i++) {
      if (typeof Number(args[i]) === 'number') {
        items.push(args[i]); // 将有效数字放在数组items中
        let decimal = args[i].toString().split('.')[1];
        decimals.push(decimal ? decimal.length : 0); // 将小数的长度放在数组decimals中
      }
    }
    let m = 10 ** Math.max(...decimals); // 计算最长小数的位数m
    return items.reduce((prev, curr) => (obj.Multiply(prev, m) + obj.Multiply(curr, m))) / m; // 将数字乘以10的m次方相加后再除以10的m次方
  },
  Divide(...args) { // /
    if (args.length < 2) return args[0];
    return args.reduce((prev, curr) => {
      let p = `${prev}`;
      let c = `${curr}`;
      let r1 = p.split('.')[1] ? p.split('.')[1].length : 0;
      let r2 = c.split('.')[1] ? c.split('.')[1].length : 0;
      let m = p.replace('.', '') / c.replace('.', ''); // 将数字转为整数并相除,得到m
      let n = r2 - r1; // 计算小数相差位数n
      return obj.Multiply(m, 10 ** n); // 用m乘以10的n次方
    });
  },
  Subtr(...args) { // -
    if (args.length < 2) return args[0];
    return args.reduce((prev, curr) => {
      let p = `${prev}`;
      let c = `${curr}`;
      let r1 = p.split('.')[1] ? p.split('.')[1].length : 0;
      let r2 = c.split('.')[1] ? c.split('.')[1].length : 0;
      let decimal = Math.max(r2, r1);
      let m = obj.Multiply(p, 10 ** decimal) - obj.Multiply(c, 10 ** decimal);  // 将数字乘以10的m次方相减后再除以10的m次方
      return obj.Divide(m, 10 ** decimal);
    });
  },
  pickerOptions: {
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '明天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '前天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  },
  getNewDate(date = new Date()) {
    if (typeof date === 'string' && date.includes('T')) {
      date = date.replace('T', ' ')
      if (isNaN(Date.parse(date))) {
        date = date.replace(/\-/g, '/')
      }
    }
    const D = new Date(date)
    let year = (D.getFullYear()).toString(),
      month = (D.getMonth() + 1).toString(),
      weekday = D.getDate().toString()
    if (parseInt(month, 10) < 10) {
      month = '0' + month
    }
    if (parseInt(weekday, 10) < 10) {
      weekday = '0' + weekday
    }
    return (year + '-' + month + '-' + weekday)
  }
}
export default obj