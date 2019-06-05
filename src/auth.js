import React from 'react';
import PropTypes from "prop-types";
import client from './frame/client';

export default class Wechatauth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  getQueryString = (name) => { 
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    let r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null;
  }

  componentWillMount() {
    if(!localStorage.getItem('uid')) {
      let code = this.getQueryString('code');
      let puid = this.getQueryString('puid') ? this.getQueryString('puid') : 0;
      if(code == null) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa2f4b8e63d54b800&redirect_uri=' +
          decodeURI('http://kjdsapp.xiaohuaikeji.cn/auth') + '&response_type=code&scope=snsapi_userinfo&state=' + puid + '#wechat_redirect';
      } else {
        client.post('api/member/register.html', {
          code: this.getQueryString('code'),
          puid: this.getQueryString('state')
        }).then(response => {
          localStorage.setItem('uid', response.id);
          localStorage.setItem('openid', response.open_id);
          localStorage.setItem('token', response.access_token);
          if(localStorage.getItem('uid')) {
            this.context.router.history.push({pathname: '/admin'});
          }
        }).catch({
          // TODO 用户注册/验证失败处理
        });
      }
    } else {
      this.context.router.history.push({pathname: '/admin'});
    }
  }

  render() {
    return '';
  }
}