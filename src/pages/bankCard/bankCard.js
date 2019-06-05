import React from 'react';
import {WingBlank, List, Flex, InputItem, Button, Toast} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './bankCard.css'
import client from '../../frame/client'
import PropTypes from "prop-types";
import '../../App.css'

export default class bankCard extends React.Component {
  constructor(props) {
    document.title = '银行卡';
    super(props);
    this.state = {
      bankUname: '',
      bankName: '',
      bankNumber: '',
    };
    this.mounted = true;
  }

  componentDidMount() {
    // 银行卡信息接口
    client.post('api/card/detail.html', {
    }).then(response => {
      if(this.mounted){
        this.setState({
            bankUname: response.bank_uname,
            bankName: response.bank_name,
            bankNumber: response.bank_number,
        })
      }
    }).catch(error => {
      // 提现成功提示框
      Toast.offline(error.message, 3);
    });
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到银行卡页面
  bankCard = () => {
    // 获取输入的持卡人、开户行、银行卡号
    if (this.state.bankUname === undefined || this.state.bankUname  === '') {
      // 提现成功提示框
      Toast.offline('请输入持卡人！', 3);
    } else if (this.state.bankName === undefined || this.state.bankName === '') {
      // 提现成功提示框
      Toast.offline('请输入开户行！', 3);
    } else if (this.state.bankNumber === undefined || this.state.bankNumber === '') {
      // 提现成功提示框
      Toast.offline('请输入卡号！', 3);
    } else {
      // 提现申请接口
      client.post('api/card/modify.html', {
        'bank_uname': this.state.bankUname,
        'bank_name': this.state.bankName,
        'bank_number': this.state.bankNumber,
      }).then(response => {
        // 提现成功提示框
        Toast.success('保存银行卡成功！', 2);
        // 返回我的页面
        setTimeout(() => {
          this.context.router.history.push('/admin/minePage/bankCardEdit');
        }, 2000);
      }).catch(error => {
        // 提现成功提示框
        Toast.offline(error.message, 3);
      });
    }
  }

  onChange1 = (value) => {
    this.setState({
      bankUname: value,
    })
  };
  onChange2 = (value) => {
    this.setState({
      bankName: value,
    })
  };
  onChange3 = (value) => {
    this.setState({
      bankNumber: value,
    })
  };
  componentWillUnmount(){
    this.mounted = false;
  }
  render() {
    const bankUname = this.state.bankUname;
    const bankName = this.state.bankName;
    const bankNumber = this.state.bankNumber;

    return (
      <WingBlank size="md">
        <div className='bankCardInput'>
          <List>
            <InputItem
              style={{fontSize: '0.8em'}}
              clear
              value={bankName}
              placeholder="请输入开户行"
              onVirtualKeyboardConfirm={v => this.hasCardName(v)}
              onChange={this.onChange2}
            >
              <span style={{ fontSize: '0.8em'}}>开户银行</span>
            </InputItem>

            <InputItem
              style={{ fontSize: '0.8em'}}
              value={bankNumber}
              placeholder="请输入16至19位银行卡号"
              type="bankCard"
              clear
              onVirtualKeyboardConfirm={v => this.hasCardNum(v)}
              onChange={this.onChange3}
            >
              <span style={{ fontSize: '0.8em'}}>银行卡</span>
            </InputItem>
            <InputItem
              style={{ fontSize: '0.8em'}}
              clear
              value={bankUname}
              placeholder="请输入持卡人姓名"
              onVirtualKeyboardConfirm={v => this.hasName(v)}
              onChange={this.onChange1}
            >
              <span style={{ fontSize: '0.8em'}}>持卡人</span>
            </InputItem>
          </List>
          <Flex justify="center">
            <Button
              className='baseBtn'
              onClick={this.bankCard}
              type="warning"
              style={{ position: 'fixed'}}
            ><span style={{fontSize: '0.8em'}}>保存</span></Button>
          </Flex>
        </div>
        <div className='noticeBarInfo'>
          该银行卡用于提现。为保证您能顺利提现成功，请务必填写真实准确的信息。
        </div>
      </WingBlank>
    );
  }
}

