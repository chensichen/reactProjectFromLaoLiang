import axios from 'axios'

let client = axios.create({
  // baseURL: "http://192.168.16.116:8082",// 创建axios默认请求
  baseURL: "http://kjds.xiaohuaikeji.cn/",// 创建axios默认请求
  timeout: 5000 // 配置超时时间
})
// 配置请求拦截
client.interceptors.request.use(config => {
  // config.setHeaders([
  //   // 在这里设置请求头与携带token信息
  //   // 在这里设置请求头与携带token信息
  // ]);

  // config.data.uid = sessionStorage.getItem('uid') != null ? sessionStorage.getItem('uid') : 0;
  // config.data.openid = sessionStorage.getItem('openid') != null ? sessionStorage.getItem('openid') : '';


  config.data.uid = 1;
  config.data.openid = 'obLV-t_Qg0ZAaQFkSFU3dxzrODSg';

  // config.data.uid = localStorage.getItem('uid') != null ? localStorage.getItem('uid') : 0;
  // config.data.openid = localStorage.getItem('openid') != null ? localStorage.getItem('openid') : '';
  config.data.t = Date.parse(new Date()).toString() / 1000 + '';

  return config;
});

client.interceptors.response.use(
  res => {
    // 请求异常处理
    if (res.status === 401) {
      const err = {code: res.status, message: '无访问权限'};
      return Promise.reject(err);
    } else if (res.status < 200 || res.status > 299) {
      const err = {code: res.status, message: '网络请求出错，请重试！'};
      return Promise.reject(err);
    }

    let url = window.location.href;
    // 2申请签约
    if(res.data.status === 9002 && !/admin\/signInfoMine/.test(url)) {
      window.location.href = '/admin/signInfoMine';
      return false;
    }
    //4拒绝签约、3签约过期、1未签约
    if((res.data.status > 9000 && res.data.status < 9010) && !/admin\/sign/.test(url)) {
      window.location.href = '/admin/sign';
      return false;
    }

    // uid不正确, 重新验证用户
    if(res.data.status > 8000 && res.data.status < 8004) {
      window.location.href = '/auth';
      return false;
    }

    // 请求成功
    try {
      const response = res.data;//JSON.parse

      if (response.status === 0) {
        return response.data;
      }
      const err = {
        status: response.status,
        message: response.msg
      };
      return Promise.reject(err);
    } catch (e) {
      return res;
    }
  },
  err => {

    const error = {
      status: 500,
      message: '网络请求出错，请重试！'
    };
    return Promise.reject(error);
  }
);

export default client;