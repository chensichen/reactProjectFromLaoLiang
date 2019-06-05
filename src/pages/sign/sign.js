import React from 'react';
import {InputItem, Button, Flex, Toast} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './sign.css'
import client from '../../frame/client'


export default class sign extends React.Component {
  constructor(props) {
    document.title = localStorage.getItem('app_name')?localStorage.getItem('app_name'):'樱淘海外严选'
    super(props);
    this.state = {
      signRevamp:false,//文本框修改状态
      companyName:'',//签约公司
      signName:'',//签约姓名
      iphoneNumber:'',//签约手机
    };
    this.mounted = true;
  }

  /**
   * @module 页面渲染后请求签约信息接口
   */
  componentDidMount() {
    client.post('api/sign/detail.html', {

    }).then(response => {
      if (response.status===1 || response.status===4){
        if(this.mounted){
          this.setState({
              companyName:'',
              signName:'',
              iphoneNumber:'',
          })
        }
      }
      // else if (response.status===3) {
      //   if(this.mounted){
      //     this.setState({
      //         companyName:response.company_name,
      //         signName:response.name,
      //         iphoneNumber:response.phone,
      //         signRevamp:true,
      //     })
      //   }
      // }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
      this.mounted = false;
  }
  /**
   * @module 点击申请签约后请求保存签约信息接口
   */
  signBtn=()=>{
    // 获取输入的持卡人、开户行、银行卡号
    if (this.state.companyName === undefined || this.state.companyName  === '') {
      // 提现成功提示框
      Toast.offline('请输入公司名称！', 3);
    } else if (this.state.signName === undefined || this.state.signName === '') {
      // 提现成功提示框
      Toast.offline('请输入用户姓名！', 3);
    } else if (this.state.iphoneNumber === undefined || this.state.iphoneNumber === '') {
      // 提现成功提示框
      Toast.offline('请输入手机号码！', 3);
    } else {
      client.post('api/sign/create.html', {
        'company_name': this.state.companyName,
        'name': this.state.signName,
        'phone': this.state.iphoneNumber,
      }).then(response => {
        // 提现成功提示框
        Toast.success('申请签约成功！', 2);
        // 返回我的页面
        setTimeout(() => {
          window.location.href = '/admin/signInfoMine';
        }, 2000);
      }).catch(error => {
        // 提现成功提示框
        Toast.offline(error.message, 3);
      });
    }
  }

  onChange1 = (value) => {
    this.setState({
      companyName: value,
    })
  };
  onChange2 = (value) => {
    this.setState({
      signName: value,
    })
  };
  onChange3 = (value) => {
    this.setState({
      iphoneNumber: value,
    })
  };

  render() {
    return (
      <div style={{width: '100%', height: 'calc(90vh)', fontSize: '0.8em',backgroundColor: '#f5f5f9'}}>
        <div style={{width: '96%', margin: '0.5em auto',}}>
          <InputItem
            style={{color: '#333333', fontSize: '0.8em'}}
            placeholder="请输入签约公司名称"
            type="text"
            value={this.state.companyName}
            disabled={this.state.signRevamp}
            onChange={this.onChange1}
          >
            <span style={{color: '#D81E06',}}>*</span>
            <span style={{color: '#333333', fontSize: '0.8em'}}>公司名称</span>
          </InputItem>
          <InputItem
            style={{color: '#333333', fontSize: '0.8em'}}
            placeholder="请输入联系人"
            type="text"
            value={this.state.signName}
            disabled={this.state.signRevamp}
            onChange={this.onChange2}
          >
            <span style={{color: '#D81E06',}}>*</span>
            <span style={{color: '#333333', fontSize: '0.8em'}}>用户姓名</span>
          </InputItem>
          <InputItem
            style={{color: '#333333', fontSize: '0.8em'}}
            type="phone"
            placeholder="请输入联系电话"
            value={this.state.iphoneNumber}
            disabled={this.state.signRevamp}
            onChange={this.onChange3}
            maxLength={14}
          >
            <span style={{color: '#D81E06',}}>*</span>
            <span style={{color: '#333333', fontSize: '0.8em'}}>手机号码</span>
          </InputItem>
        </div>
        <Flex justify="center">
          <Button
            style={{width: '90%', backgroundColor: '#D81E06', position: 'absolute', bottom: '3.2em',zIndex:99}}
            type="warning"
            onClick={this.signBtn}
          ><span style={{ fontSize: '0.8em'}}>申请签约</span></Button>
        </Flex>
        {/*<div style={{width: '100%', height:'8em', backgroundColor: '#f5f5f9',position: 'fixed',bottom: '0',zIndex:9}}/>*/}
      </div>
    );
  }
}
