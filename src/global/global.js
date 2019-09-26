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
    let list = l.split(',')
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
  }
}
export default obj