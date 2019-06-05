import React from 'react';
import {Icon} from 'antd-mobile';
import PropTypes from "prop-types";
import 'antd-mobile/dist/antd-mobile.css';

export default class shopPage extends React.Component {
  constructor(props) {
    document.title = '购物车';
    super(props);
    this.state = {
      successTime: 5,    //商品列表
    };
    this.t = '';
  }

  componentWillMount() {
    this.t = setInterval(this.jump, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.t)
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  jump = () => {
    if (this.state.successTime > 0) {
      if (this.state.successTime === 1) {
        this.setState({
          successTime: 0
        })
        this.context.router.history.push('/admin/minePage/order/3');
      } else {
        this.setState({
          successTime: this.state.successTime - 1
        })
      }
    } else {
      this.setState({
        successTime: 0,
      })
    }
  }

  onConfirm = () => {
    this.setState({
      successTime: 0,
    })
    this.context.router.history.push('/admin/minePage/order/3');
  }

  render() {
    return (
      <div className='shopPaySuccess' style={{textAlign: 'center', paddingTop: '3em'}}>
        <div className='shopPaySuccessIcon'><Icon size={"lg"} type={'loading'}/></div>
        <p className='shopPaySuccessState'>订单提交成功</p>
        <p className='shopPaySuccessJump'>
          <span className='shopPaySecond'>{this.state.successTime}</span>秒后将自动跳转
        </p>
        <p className='shopPayConfirm' onClick={this.onConfirm}>
          确定
        </p>
      </div>
    )
  }
}