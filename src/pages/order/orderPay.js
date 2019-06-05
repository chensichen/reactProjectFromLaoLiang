import React from 'react';
import client from "../../frame/client";
import PropTypes from "prop-types";
import {Toast, Flex} from 'antd-mobile';

export default class orderPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.location.state.order,
      title: '订单支付',
      orderTip: '正在处理，请稍等...',
    };
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentDidMount() {
    document.title = '订单支付';
  }

  payOrder = () => {
    if (typeof(window.WeixinJSBridge) === "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
      }
    } else {
      client.post('api/order/payprepare.html', {
        'oid': this.state.order
      }).then(response => {
        window.WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": response.appId,
          "timeStamp": response.timeStamp,
          "nonceStr": response.nonceStr,
          "package": response.package,
          "signType": response.signType,
          "paySign": response.paySign
        }, function (res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            Toast.success('微信支付完成', 2);
            // 跳转到订单页已付款
            setTimeout(() => {
              window.location.href='/admin/minePage/order/' + 2;
            }, 2000);
          } else {
            Toast.offline('微信支付失败', 3);
            // 跳转到订单页待付款
            setTimeout(() => {
              window.location.href='/admin/minePage/order/' + 0;
            }, 3000);
          }
        });
      }).catch(error => {
        Toast.offline('微信支付失败', 3);
        // 跳转到订单页待付款
        setTimeout(() => {
          window.location.href='/admin/minePage/order/' + 0;
        }, 3000);
      });
    }
  }

  render() {
    return (
      <div className='appBgF'>
        {this.payOrder()}
        <Flex justify='center'>
          <img style={{width:'50%'}} src={require('../../image/yingtao.gif')} alt=""/>
        </Flex>
        <Flex justify='center'>
          <p>{this.state.orderTip}</p>
        </Flex>
      </div>
    );
  }
}