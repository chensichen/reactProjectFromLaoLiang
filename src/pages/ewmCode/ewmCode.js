import React from 'react';
import {Flex} from "antd-mobile";
import 'antd-mobile/dist/antd-mobile.css';
import './ewmCode.css'
import client from '../../frame/client'

export default class ewmCode extends React.Component {
  constructor(props) {
    document.title = '二维码';
    super(props);
    this.state = {
      userInfo: {},
      ewmCodeInfo: {},
    };
    this.mounted = true;
  }

  /**
   * @module 页面渲染后请求二维码接口
   */
  componentDidMount() {
    //1.获取用户信息接口
    client.post('api/member/detail.html', {}).then(response => {
      if(this.mounted){
        this.setState({
            userInfo: response,
        })
      }
    }).catch(error => {
    });
    // 获取二维码
    client.post('api/member/qrcode.html', {}).then(response => {
      if(this.mounted){
        this.setState({
            ewmCodeInfo: response,
        })
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  render() {
    const userInfoArr = this.state.userInfo;
    const ewmCodeInfoArr = this.state.ewmCodeInfo;
    return (
      <div className='ewmCode'>
        <div className='ewmCodeBG'>
          <Flex style={{width: '74%', margin: '2em 0 1.5em 3.4em'}}>
            <img className='ewmCodeImg' src={userInfoArr.headimgurl} alt=""/>
            <div>
              <Flex align="baseline">
                <span style={{lineHeight: '2em', fontSize: '1.2em'}}>{userInfoArr.name}</span>
              </Flex>
            </div>
          </Flex>
          <Flex justify="center">
            <img style={{width: '74%'}} src={ewmCodeInfoArr.qrcode} alt=""/>
          </Flex>
          <Flex justify="center" style={{color: '#999999', paddingTop: '3.2em'}}>
            扫描上面二维码，加入我的分销团队吧~
          </Flex>
        </div>
      </div>
    );
  }
}