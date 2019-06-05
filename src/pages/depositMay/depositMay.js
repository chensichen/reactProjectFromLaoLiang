import React from 'react';
import {List, Toast, Flex, InputItem, Button, Modal} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './depositMay.css'
import client from "../../frame/client";
import PropTypes from "prop-types";
import {createForm} from 'rc-form';

// 提示弹窗
const alert = Modal.alert;
export default class depositMay extends React.Component {
  constructor(props) {
    document.title = '提现申请';
    super(props);
    this.state = {
      cardName: '',//银行卡名称
      bankNumber: '',//银行卡号
      bankUname: '',//持卡人姓名
      systemInfo: '',//系统参数
      outstandAmount: '',//可提余额
    };
    this.mounted = true;
  }

  componentDidMount() {
    // 1.获取银行卡信息接口
    client.post('api/card/detail.html', {}).then(response => {
      if(this.mounted){
        this.setState({
            cardName: response.bank_name,
            bankNumber: response.bank_number,
            bankUname: response.bank_uname,
        })
      }
      if (this.state.cardName === '') {
        // 提现成功提示框
        Toast.offline('您还没有绑定银行卡！', 3);
        // 返回我的页面
        this.context.router.history.push('/admin/minePage/mine');
        return false;
      } else if (this.state.bankNumber === '') {
        // 提现成功提示框
        Toast.offline('您还没有绑定银行卡！', 3);
        // 返回我的页面
        this.context.router.history.push('/admin/minePage/mine');
        return false;
      } else if (this.state.bankUname === '') {
        // 提现成功提示框
        Toast.offline('您还没有绑定银行卡！', 3);
        // 返回我的页面
        this.context.router.history.push('/admin/minePage/mine');
        return false;
      }
    }).catch(error => {
    });
    // 2.获取系统配置接口
    client.post('api/common/getconfig.html', {
      'keys': 'amount_commission_low,commission_num',
    }).then(response => {
      if(this.mounted){
        this.setState({
            systemInfo: response,
        })
      }
    }).catch(error => {
    });
    //3.获取用户信息接口
    client.post('api/member/detail.html', {}).then(response => {
      if(this.mounted){
        this.setState({
            outstandAmount: response.outstand_amount,
        })
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  /**
   * @module 点击提现按钮，弹出提示框，请求提现申请接口，并跳转到我的页面
   */
  successToast = () => {
    // 获取输入的金额
    let moneyInputNum = this.moneyInput.props.form.getFieldsValue();
    let moneyValue = Number(moneyInputNum.money) //提现金额
    if (moneyValue === undefined || moneyValue === 0 || isNaN(moneyValue)) {
      // 提现成功提示框
      Toast.offline('金额不能为空！', 3);
    } else if (moneyValue < this.state.systemInfo.amount_commission_low - 0) {
      // 提现成功提示框
      Toast.offline('不能低于提现金额！', 3);
    } else {
      //提示是否确认提现
      this.depositRevocation(moneyValue, moneyInputNum);
    }
  }

  /**
   * @module 提现申请按钮二次确认提示框
   * @param Value:提现金额
   * @param Num:备注
   */
  depositRevocation = (Value, Num) => {
    alert('是否确定提现', '', [
      {text: '取消'},
      {text: '确定', onPress: () => this.depositConfirm(Value, Num)},
    ])
  }
  /**
   * @module 点击二次确认按钮后，调用提现申请接口
   * @param Value:提现金额
   * @param Num:备注
   */

  depositConfirm = (Value, Num) => {
    // 提现申请接口
    client.post('api/withdraw/create.html', {
      'amount': Value,
      'remark': Num.remark,
    }).then(response => {
      // 提现成功提示框
      Toast.success('申请提现成功！', 2);
      // 返回我的页面
      setTimeout(() => {
        this.context.router.history.push('/admin/minePage/mine');
      }, 3000);
    }).catch(error => {
      // 提现成功提示框
      Toast.offline(error.message, 3);
    });
  }

  render() {
    const systemInfomation = this.state.systemInfo;
    const outstandAmount = this.state.outstandAmount;
    return (
      <div className='depositMay'>
        {/*顶部用户信息*/}
        <div className="depositMayInfo">
          <div className="depositMayFrom">
            <Flex justify="center">
              <div>
                <Flex justify='center'>
                  <div className="depositMayY">樱</div>
                  <div className="depositMayName">{localStorage.getItem('app_name')}</div>
                </Flex>
              </div>
              <img className="depositMayArrow" src={require('../../image/icon/left.png')} alt=""/>
              <div>
                <Flex justify='center'>
                  <img className="depositMayIcon" src={require('../../image/icon/bank.png')} alt=""/>
                  <div className="depositMayBank">{this.state.cardName}</div>
                </Flex>
              </div>
            </Flex>
          </div>
        </div>
        <div className='depositMayMoneyBody'>
          <span className='depositMayMoneyName'>可提现金额:</span>
          <span className='depositMayMoneyNum'>￥{outstandAmount}</span>
        </div>
        <DepositMayIn wrappedComponentRef={(inst) => {
          this.moneyInput = inst
        }}/>
        <p style={{paddingLeft: '1em', color: '#666666', fontSize: '0.8em'}}>
          <span>每日只可提现{systemInfomation.commission_num}次</span>
        </p>
        <p style={{paddingLeft: '1em', color: '#666666', fontSize: '0.8em'}}>
          <span>每次最低提现金额为{systemInfomation.amount_commission_low}元</span>
        </p>
        <Flex justify="center">
          <Button
            onClick={this.successToast}
            type="warning"
            style={{
              width: '100%',
              height: '2.4em',
              lineHeight: '2.4em',
              backgroundColor: '#D81E06',
              position: 'fixed',
              bottom: '2.8em',
              borderRadius: 0,
            }}
          ><span style={{fontSize: '0.8em'}}>提现申请</span></Button>
        </Flex>
      </div>
    );
  }
}


// input输入框
class depositMayExp extends React.Component {
  state = {
    moneyValue: 0,
    remarkValue: '',
  }
  /**
   * @module 获取输入的金额
   * @param value：输入的值
   */
  hasMoney = (value) => {
    this.setState({
      moneyValue: value,
    })
  }

  hasRemark = (value) => {
    this.setState({
      remarkValue: value,
    })
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div>
        <List className='depositMayMoney'>
          <InputItem
            {...getFieldProps('money', {
              normalize: (v, prev) => {
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
            type='money'
            moneyKeyboardAlign='left'
            onVirtualKeyboardConfirm={v => this.hasMoney(v)}
            clear
          >￥</InputItem>
          <List className='depositMayRemark'>
            <InputItem
              {...getFieldProps('remark')}
              type='text'
              clear
              placeholder="转账备注（选填）"
              onVirtualKeyboardConfirm={v => this.hasRemark(v)}
            />
          </List>
        </List>
      </div>
    );
  }
}

const DepositMayIn = createForm()(depositMayExp);
