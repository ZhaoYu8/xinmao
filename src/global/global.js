// import city from './city'
let city = []
let obj = {
  getCookie(n, name = `${n}=`) { // 根据名称查找cookie
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++){
      let c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  },
  getCityName (l, list = l.split(',')) {
    let data = '', arr = []
    return ''
    arr[0] = this.getName(city, list[0])
    arr[1] = this.getName(arr[0].children, list[1])
    arr[2] = this.getName(arr[1].children, list[2])
    arr.map(r => {
      data += r.label
    })
    return data
  },
  getName (data, val) {
    let str = {}
    for (let i = 0; i < data.length; i++) {
      let n = data[i]
      if (n.value === val) {
        str = n
        break
      }
    }
    return str
  }
}
export default obj