import React from 'react';
import {WhiteSpace, Flex, Toast, Modal} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './orderAttached.css'
import client from "../../frame/client";
import PropTypes from "prop-types";

// 输入弹窗
const prompt = Modal.prompt;

export default class orderAttached extends React.Component {
  constructor(props) {
    document.title = '订单详情';
    super(props);
    this.state = {
      orderData: [],
      orderDataAll: [],
      sonId: this.props.match.params.sonId,//订单一览页面，点击子订单时，传过来的订单id值
    };
    this.mounted = true;
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到商品详情页
  onDetail = (id) => {
    this.context.router.history.push('/admin/homePage/productDetail/'+id);
  }

  /**
   * @module 页面渲染后请求子订单详情接口
   */
  componentDidMount() {
    client.post('api/order/getpackagedetail.html', {
      'pid': this.state.sonId,
    }).then(response => {
      let datetimePayforS = '';
      if (response.datetime_payfor === null) {
        datetimePayforS = '';
      } else {
        datetimePayforS = response.datetime_payfor.substr(0, 16);
      }
      let createtimeQ = response.createtime.substr(0, 16);
      let amountGoodsS = Number(response.amount_goods).toFixed(2);
      let amountTaxS = Number(response.amount_tax).toFixed(2);
      let amountFreightS = Number(response.amount_freight).toFixed(2);
      if(this.mounted){
        //更新数据
        this.setState({
            createtime: createtimeQ,//下单时间
            datetimePayfor: datetimePayforS,//付款时间
            amountGoods: amountGoodsS,//商品金额
            amountTax: amountTaxS,//税费金额
            amountFreight: amountFreightS,//运费金额
            orderDataAll: response,
            orderData: response.children,
        });
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * @module 编辑身份证按钮
   * @param id:子订单id
   */
  cardEdit = (id) => {
    return (
      <img onClick={this.popID.bind(this, id)} style={{width: "0.9em"}} src={require('../../image/icon/editR.png')}
           alt=""/>
    )
  }
  /**
   * @module 编辑身份证弹窗
   * @param id:子订单id
   */
  popID = (id) => {
    window.scrollTo(0, 0);
    prompt('请输入姓名和身份证号', '', [
      {text: '取消'},
      {text: '确定', onPress: value => this.intelligen(id, value)},
    ], 'default', null, ['张媛,210881xxxxxx……'])
  }
  /**
   * @module 身份证匹配
   * @param id:子订单id
   */
  intelligen = (id, value) => {
    // 将输入值的全角逗号转成半角
    let identityCardName = value.replace("，", ",");
    // identityCardName是输入的身份证号和姓名,以逗号分隔字符串
    identityCardName = identityCardName.split(",");
    // 身份证号码校验
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (value === '') {
      // 不符合时弹出提示框
      Toast.offline('请输入姓名和身份证号！', 3);
      this.popID(id);
      return false;
    }
    // 判断输入的身份证号是否符合校验
    if (reg.test(identityCardName[1]) === false) {
      // 不符合时弹出提示框
      Toast.offline('身份证输入不合法！', 3);
      this.popID(id);
      return false;
    }
    client.post('api/order/match', {
      'idcard_number': identityCardName.toString(),
      'pids': id,
    }).then(response => {
      // 匹配成功提示框
      Toast.success('匹配成功！', 2);
      if(this.mounted){
        this.setState({
            intelligeId: id,
        })
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }).catch(error => {
      // 不符合时弹出提示框
      Toast.offline(error.message, 3);
    });
  }

  render() {
    const orderInformation = this.state.orderDataAll;
    const orderDataInformation = this.state.orderData;
    return (
      <div key={orderInformation.id}>
        <div className="orderDeliveryStatus">
          <Flex>
            <div className="orderDelivery orderDeliveryHeader">
              <Flex style={{lineHeader: '1.5em'}}>
                  <span style={{
                    backgroundColor: '#ffffff',
                    color: '#d81e06',
                    padding: '0.2em',
                    marginRight: '0.5em',
                    borderRadius: '0.2em',
                    fontSize: '0.8em',
                    border: '1px solid #d81e06',
                  }}>{orderInformation.send_type === 1 ? '收' : '代'}</span>
                <span className='accountAddLeftName'>{orderInformation.address_name}</span><span
                className='accountAddLeftName'>{orderInformation.address_phone}</span>
              </Flex>
              <Flex>
                <img className='accountOrderIcon' src={require('../../image/accountOrder/location.png')} alt='1'/>
                <span style={{fontSize: '1em'}}>{orderInformation.address}</span>
              </Flex>
            </div>
          </Flex>
        </div>
        {/*订单附表商品列表*/}
        <WhiteSpace size="sm"/>
        <div className="orderGoods">
          {
            orderDataInformation === undefined ? '' :

              orderDataInformation.map((item) => {
                  return (
                    <div style={{padding: '0 1em 0 0'}} key={item.id} onClick={() =>{this.onDetail(item.gid)}}>
                      <div style={{display: 'flex', padding: '1em 0', justifyContent: 'space-between'}}>
                        <img style={{width: '6em', height: '6em', marginRight: '0.5em', marginLeft: '1em'}}
                             src={item.url_show} alt=""/>
                        <div className='orderMainGoods'>
                          <div className='orderMainGname'>{item.gname}</div>
                          <div><span className='orderMainPrice'>￥{item.price}</span></div>
                        </div>
                        <div style={{color: '#999999', display: 'flex', alignSelf: 'flex-end'}}>X{item.num}</div>
                      </div>
                    </div>
                  )
                }
              )
          }

        </div>
        {/*订单附表状态*/}
        <WhiteSpace size="sm"/>
        <div className="orderFormPrimary">
          <Flex>
            <span className="orderFormLeft">订单编号：</span>
            <span className="orderFormRight">{orderInformation.number}</span>
          </Flex>
          <Flex>
            <span className="orderFormLeft">下单时间：</span>
            <span className="orderFormRight">{this.state.createtime}</span>
          </Flex>
          {orderInformation.status === 5 ?
            <Flex>
              <span className="orderFormLeft">订单状态：</span>
              <span className="orderFormRight redState">{orderInformation.status_text}</span>
              {this.cardEdit(orderInformation.id)}
            </Flex> :
            <Flex>
              <span className="orderFormLeft">订单状态：</span>
              <span className="orderFormRight">{orderInformation.status_text}</span>
            </Flex>
          }
          <Flex>
            <span className="orderFormLeft">身份信息：</span>
            <span className="orderFormRight">{orderInformation.idcard_name} {orderInformation.idcard_number}</span>
          </Flex>
          <Flex>
            <span className="orderFormLeft">发货方式：</span>
            <span className="orderFormRight">{orderInformation.send_type_text}</span>
          </Flex>
          <Flex>
            <span className="orderFormLeft">物流信息：</span>
            <span className="orderFormRight">{orderInformation.ename} {orderInformation.courier_number}</span>
          </Flex>
        </div>
        {/*订单附表金额*/}
        <WhiteSpace size="sm"/>
        <div className="orderFormPrimary">
          <Flex justify="between">
            <span className="orderFormLeft">商品金额：</span>
            <span className="orderFormLeft">¥{this.state.amountGoods}</span>
          </Flex>
          <Flex justify="between">
            <span className="orderFormLeft">税费金额：</span>
            <span className="orderFormLeft">¥{this.state.amountTax}</span>
          </Flex>
          <Flex justify="between">
            <span className="orderFormLeft">运费金额：<span
              style={{color: '#999999', fontWeight: 'normal'}}>(共{orderInformation.weight_order}kg)</span></span>
            <span className="orderFormLeft">¥{this.state.amountFreight}</span>
          </Flex>
          <Flex justify="end" style={{borderTop: '1px solid #f7f7f7', paddingTop: '0.5em'}}>
            <span className="orderFormLeft">应付款：<span
              className='orderFont'>¥{orderInformation.amount_order}</span></span>
          </Flex>
        </div>
        <div style={{width: '100%', height: '3.7em'}}/>
      </div>
    )
  }
}