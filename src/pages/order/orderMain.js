import React from 'react';
import {WhiteSpace, Flex,} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './orderForm.css'
import client from "../../frame/client";
import PropTypes from "prop-types";

export default class orderMain extends React.Component {
  constructor(props) {
    document.title = '订单详情'
    super(props);
    this.state = {
      orderMainData: [],//订单详情
      orderMainDataList: [],//商品列表
      mainId: this.props.match.params.mainId,//订单一览页面，点击主订单时，传过来的订单id值
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
   * @module 页面渲染后请求主订单详情接口
   */
  componentDidMount() {
    client.post('api/order/detail.html', {
      'oid': this.state.mainId,//订单ID
    }).then(response => {
      let createtimeQ = response.createtime.substr(0, 16);
      let datetimePayforQ = response.datetime_payfor.substr(0, 16);
      let amountGoodsQ = Number(response.amount_goods).toFixed(2);
      let amountTaxQ = Number(response.amount_tax).toFixed(2);
      let amountFreightQ = Number(response.amount_freight).toFixed(2);
      let amountInsuranceQ = Number(response.amount_insurance).toFixed(2);
      let amountQrderQ = Number(response.amount_order).toFixed(2);
      if(this.mounted){
        //更新数据
        this.setState({
            createtime: createtimeQ,//下单时间
            datetimePayfor: datetimePayforQ,//付款时间
            amountGoods: amountGoodsQ,//商品金额
            amountTax: amountTaxQ,//税费金额
            amountFreight: amountFreightQ,//税费金额
            amountInsurance: amountInsuranceQ,//订单险
            amountQrder: amountQrderQ,//合计金额
            orderMainData: response,//主订单详情
            orderMainDataList: response.goods_info,//主订单商品列表
        });
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }

  orderMainDarw = () => {
    const orderMainDataInfo = this.state.orderMainData;
    const orderMainDataListInfo = this.state.orderMainDataList;
    return (
      <div key={orderMainDataInfo.id}>
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
                  }}>{orderMainDataInfo.send_type === 1 ? '收' : '代'}</span>
                <span className='accountAddLeftName'>{orderMainDataInfo.address_name}</span><span
                className='accountAddLeftName'>{orderMainDataInfo.address_phone}</span>
              </Flex>
              <Flex>
                <img className='accountOrderIcon' src={require('../../image/accountOrder/location.png')} alt='1'/>
                <span style={{fontSize: '1em'}}>{orderMainDataInfo.address}</span>
              </Flex>
            </div>
          </Flex>
        </div>
        <WhiteSpace size="sm"/>
        <div className="orderGoods">
          {
            orderMainDataListInfo.map((item) => {
                return (
                  <div key={item.id} style={{padding: '0 1em 0 0'}} onClick={() =>{this.onDetail(item.gid)}}>
                    <div style={{display: 'flex', padding: '1em 0', justifyContent: 'space-between'}}>
                      <img style={{width: '6em', height: '6em', marginRight: '0.5em', marginLeft: '1em'}}
                           src={item.url_show} alt=""/>
                      <div className='orderMainGoods'>
                        <div className='orderMainGname'>{item.skuname}</div>
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
        <WhiteSpace size="sm"/>
        {/*订单主表状态*/}
        <div className="orderFormPrimary">
          <Flex>
            <span className="orderFormLeft">订单编号：</span>
            <span className="orderFormRight">{orderMainDataInfo.number}</span>
          </Flex>
          <Flex>
            <span className="orderFormLeft">下单时间：</span>
            <span className="orderFormRight">{this.state.createtime}</span>
          </Flex>
          <Flex>
            <span className="orderFormLeft">订单状态：</span>
            <span className="orderFormRight">{orderMainDataInfo.status_text}</span>
          </Flex>
          {orderMainDataInfo.status === 3 ?
            <Flex>
              <span className="orderFormLeft">付款时间：</span>
              <span className="orderFormRight">{this.state.datetimePayfor}</span>
            </Flex> : ''
          }
          <Flex>
            <span className="orderFormLeft">付款方式：</span>
            <span className="orderFormRight">{orderMainDataInfo.payfor_type_text}</span>
          </Flex>
          <Flex>
            <span className="orderFormLeft">发货方式：</span>
            <span className="orderFormRight">{orderMainDataInfo.send_type_text} <span
              className='orderFontred'>({orderMainDataInfo.num_packing})</span></span>
          </Flex>
        </div>
        {/*订单主表金额*/}
        <WhiteSpace size="sm"/>
        <div className="orderFormPrimary">
          {this.state.amountInsurance !== '0.00' ?
            <Flex justify="between">
              <span className="orderFormLeft">订单险额：</span>
              <span className="orderFormLeft">¥{this.state.amountInsurance}</span>
            </Flex> : ''}
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
              style={{color: '#999999', fontWeight: 'normal'}}>(共{orderMainDataInfo.weight_order}kg)</span></span>
            <span className="orderFormLeft">¥{this.state.amountFreight}</span>
          </Flex>
          <Flex justify="end" style={{borderTop: '1px solid #f7f7f7', paddingTop: '0.5em'}}>
            <span className="orderFormLeft">合计：<span className='orderFont'>¥{this.state.amountQrder}</span></span>
          </Flex>
        </div>
        <div style={{width: '100%', height: '3.7em', opacity: 0}}/>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.orderMainDarw()}
      </div>
    )
  }
}