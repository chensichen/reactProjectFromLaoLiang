import React from 'react';
import {Button, Flex, InputItem, List, WhiteSpace, Toast} from "antd-mobile";
import 'antd-mobile/dist/antd-mobile.css';
import './intelligenMatch.css'
import client from "../../frame/client";
import '../../App.css'

export default class intelligenMatch extends React.Component {
  constructor(props) {
    document.title = '智能匹配'
    super(props);
    this.state = {
      intelligenMatch: {},//包裹列表身份证
      intelligenMatchArr: [],//点击确认后，成功匹配的包裹列表
      intelligenMatchAll: [],//点击确认后，所有包裹列表
      identityCard: '',//身份证和姓名
      currentIndex: 'hidden',//当前金额和剩余金额的状态<占位隐藏>
      ConfirmBtn: 'block',//确认按钮的状态<显示>
      saveBtn: 'none',//保存按钮的状态<隐藏>
      intelligenSum: 0,//剩余余额
      idcardNumber: '',//身份证号码
      idcardName: '',//身份证姓名
      packageIds: [],//包裹id
      disabledState: true,//提交按钮状态
      intelligenOrder: 'none',//订单显示状态
      tellState: 'none',//没有订单时显示状态
      tellStateText: '',//没有订单时返回的错误
    };
    this.mounted= true;
  }

  /**
   * @module 页面渲染后请求身份证验证接口
   * @param type:无
   */
  componentDidMount() {
    // 获取焦点
    client.post('api/member/valid.html', {}).then(response => {
      if(this.mounted){
        this.setState({
            intelligenOrder: 'block',
            disabledState: false,
            intelligenMatch: response,//身份证验证接口返回的所有数据
            intelligenMatchArr: response.list,//身份证验证接口返回的列表值
        })
      }
    }).catch(error => {
      if (error) {
        if(this.mounted){
          this.setState({
              intelligenOrder: 'none',
              disabledState: true,
              tellState: 'block',
              tellStateText: error.message,
          })
        }
        return false;
      }
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }

  /**
   * @module 输入身份证号和姓名时触发的事件
   * @param value:输入的值
   */

  affirmBtn = (value) => {
    this.setState({
      identityCard: value,
    })
  }

  /**
   * @module 点击【确认】按钮后，调用身份证验证接口
   */
  affirmValueBtn = () => {
    // 将输入值的全角逗号转成半角
    let identityCardName = this.state.identityCard.replace("，", ",");
    // 以逗号分隔字符串
    identityCardName = identityCardName.split(",");
    // 身份证号码校验
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (this.state.identityCard === '') {
      // 不符合时弹出提示框
      Toast.offline('请输入姓名和身份证号！', 3);
      return false;
    }

    // 判断输入的身份证号是否符合校验
    if (reg.test(identityCardName[1]) === false) {
      // 不符合时弹出提示框
      Toast.offline('身份证输入不合法！', 3);
      return false;
    }
    client.post('api/member/valid.html', {
      'idcard_number': identityCardName.toString(),
    }).then(response => {
      //点击【确认】后，将包裹ID转换成数组
      let packageIds = response.package_ids.split(",");
      //获取包裹ID转换成数组的length长度
      let packageIdsLenght = packageIds.length;
      if(this.mounted){
        this.setState({
            currentIndex: 'visible',//当前金额和剩余金额的状态<占位显示>
            ConfirmBtn: 'none',//确认按钮隐藏
            saveBtn: 'block',//保存按钮显示
            intelligenMatch: response,//身份证验证接口返回的所有数据
            intelligenMatchAll: response.list,//身份证验证接口返回的所有列表值，
            intelligenMatchArr: response.list.slice(0, packageIdsLenght),//身份证验证接口返回的列表值，只获取数组长度的列表
            idcardNumber: response.idcard.idcard_number,
            idcardName: response.idcard.idcard_name,
            packageIds: response.package_ids,
        })
      }
    }).catch(error => {
      // 不符合时弹出提示框
      Toast.offline(error.message, 3);
      if(this.mounted){
        this.setState({
            identityCard: '',
        })
      }
    });
  }
  /**
   * @module 点击【保存】按钮后，调用身份证匹配接口
   */
  saveBtnFunc = () => {
    client.post('api/order/match.html', {
      'idcard_number': this.state.idcardNumber,
      'idcard_name': this.state.idcardName,
      'pids': this.state.packageIds,
      'packages': this.state.intelligenMatchAll,
    }).then(response => {
      // 匹配成功提示框
      Toast.success('匹配成功！', 2);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }).catch(error => {
      // 不符合时弹出提示框
      Toast.offline(error.message, 3);
    });
  }

  render() {
    const intelligenMatch = this.state.intelligenMatch;
    const intelligenMatchArr = this.state.intelligenMatchArr;
    const limitMoneyDay = this.state.intelligenMatch.limit_money_day;//当前可用余额
    const totalMoney = this.state.intelligenMatch.total_money;//包裹订单总金额
    let mayMoney = (limitMoneyDay - totalMoney).toFixed(2);

    return (
      <div className="baseBgF flex-container">
        {/*<WingBlank size="md">*/}
          {/*顶部输入框*/}
          <div className='intelligenMatch'>
            <Flex justify='center'>
              <div className='intelligenMatchInput'>
                <List>
                  <InputItem
                    style={{color: '#333333', fontSize: '0.8em'}}
                    placeholder="请输入1张身份证如张媛,210881xxxxxx……"
                    onChange={this.affirmBtn}
                    value={this.state.identityCard}
                  />
                </List>
                <div style={{visibility: (this.state.currentIndex), width: '90%', margin: '0 auto'}}>
                  <Flex justify="between">
                    <span className='intelligenMatchMoney'>当前额度:{limitMoneyDay}元</span>
                    <span className='intelligenMatchMoney'>剩余额度:{mayMoney}元</span>
                  </Flex>
                </div>
                <Flex justify="center">
                  <Button
                    size='small'
                    onClick={this.affirmValueBtn}
                    type="warning"
                    style={{display: (this.state.ConfirmBtn)}}
                    disabled={this.state.disabledState}
                  ><span>提交</span></Button>
                  <Button
                    size='small'
                    onClick={this.saveBtnFunc}
                    type="warning"
                    style={{display: (this.state.saveBtn)}}
                  ><span>保存</span></Button>
                </Flex>
              </div>
            </Flex>
            <Flex wrap="wrap" className='intelligenMatchTag'>
              <div>
                <p>按要求输入身份证信息，注意用逗号分开;</p>
                <p>点击提交按钮，查看系统推荐的匹配方案;</p>
                <p>确认无误后点击保存按钮，完成匹配动作;</p>
              </div>
            </Flex>
          </div>
          {/*订单信息*/}
          <div style={{display: this.state.intelligenOrder}}>
            {/*<WhiteSpace size='sm'/>*/}
            <div className="intelligenMatchHeader">
              <Flex justify="between">
                <div style={{width: '75%'}}>附单号(商品重量)</div>
                <div>金额(元)</div>
              </Flex>
            </div>
            {
              intelligenMatchArr.map((item) => {
                if (intelligenMatch.idcard.length === 0) {
                  return (
                    <div key={item.id}>
                      <WhiteSpace size='xs'/>
                      <div className="intelligenMatchOrder">
                        <Flex justify="between">
                          <div className="intelligenNum"><span>{item.number}</span><span>({item.weight_order}kg)</span>
                          </div>
                          <div>{item.amount_goods}</div>
                        </Flex>
                        <Flex justify="between">
                          <div className='intelligenRed'>{item.idcard_name} {item.idcard_number}</div>
                        </Flex>
                      </div>
                    </div>
                  )
                } else if (intelligenMatch.idcard.length !== 0) {
                  return (
                    <div key={item.id}>
                      <WhiteSpace size='xs'/>
                      <div className="intelligenMatchOrder">
                        <Flex justify="between">
                          <div className="intelligenNum"><span>{item.number}</span><span>（{item.weight_order}kg）</span>
                          </div>
                          <div>{item.amount_goods}</div>
                        </Flex>
                        <Flex justify="between">
                          <div
                            className='intelligenGreen'>{intelligenMatch.idcard.idcard_name} {intelligenMatch.idcard.idcard_number}</div>
                        </Flex>
                      </div>
                    </div>
                  )
                }
                return false;
              })
            }
          </div>

          <div style={{display: this.state.tellState}} className='shopListClass' key='1'>
            <img style={{width: '18%'}} src={require('../../image/icon/noneState.png')} alt="没有数据"/>
            <p style={{fontSize: '0.8em'}}>{this.state.tellStateText}</p>
          </div>
          {/*订单信息*/}
        {/*</WingBlank>*/}
        <div className='body'/>
      </div>
    );
  }
}
