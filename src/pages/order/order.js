import React from 'react';
import {Tabs, Flex, Button, Modal, Toast} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './order.css'
import client from "../../frame/client";
import PropTypes from "prop-types";
import PageList from '../../components/pageList'//分页

const tabs = [
  {title: '待付款'},
  {title: '已撤销'},
  {title: '已付款'},
  {title: '全部订单'},
];
// 提示弹窗
const alert = Modal.alert;

export default class order extends React.Component {
  constructor(props) {
    document.title = '订单管理';
    super(props);
    this.state = {
      orderTabsActive: 'orderTabsActive',
      tabIndex: 0,//顶部tab的状态
      row: 10,//分页传递的参数
      rows: 0,//当前总页码数
      orderList: [],//后台返回的订单列表的数组
      orderListTotal: 0,//后台返回的订单列表总数
      orderState: this.props.match.params.orderState,//从我的页面跳转带回来的参数tabs 值：0/1/2/3
      orderSmallState: false,
      orderId: 0,
      intelligeId: 0,//匹配成功后的子订单id
      orderDown: 'orderDown',
      displayState: 'visible',//订单列表有值时,列表的状态
      visibleState: 'hidden',//订单列表有值时,列表的状态
    };
    this.dataPage = 1;//分页默认1开始
    this.mounted = true;
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到主订单页面详情
  mainOrderDetails = (item) => {
    this.context.router.history.push('/admin/minePage/orderMain/' + item);
  }
  // 跳转到子订单页面详情
  sonOrderDetails = (id) => {
    this.context.router.history.push('/admin/minePage/orderAttached/' + id);
  }

  /**
   * @module 页面渲染后请求订单列表接口
   */
  componentDidMount() {
    this.orderListAll(this.state.orderState);
  }

  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * @module 请求订单列表接口
   * @param orderIndex:上一页带过来的订单状态，或当前页顶部tab触发onChange时的订单状态 0/1/2/3 number
   */
    //请求订单列表接口
  orderListAll = (orderIndex) => {
    this.loadingToast();
    this.dataPage = 1;//分页默认1开始
    let orderIndexNum = orderIndex - 0 + 1;
    //页面渲染后,将顶部tab的状态setState成当前订单状态
    if(this.mounted){
      this.setState({
          tabIndex: orderIndexNum,
      })
    }

    client.post('api/order/getlist.html', {
      'status': orderIndexNum,
    }).then(response => {
      if(this.mounted){
        this.setState({
            orderList: response.list,
            orderListTotal: response.total,
            rows: Math.ceil(response.total / this.state.row),
        })
        if (response.total === 0) {
            this.setState({
                displayState: 'hidden',
                visibleState: 'visible',
            })
        } else {
            this.setState({
                displayState: 'visible',
                visibleState: 'hidden',
            })
        }
      }

    }).catch(error => {
    });
  }

  /**
   * @module 点击主订单下包含的子订单，显示/隐藏该主订单下的所有子订单
   * @param id:主订单id
   */
  orderChildrenBtn = (id) => {

    if (id !== this.state.orderId) {
      if(this.mounted){
        this.setState({
            orderSmallState: true,
            orderId: id,
        })
      }
    } else {
      if(this.mounted){
        this.setState({
            orderSmallState: !this.state.orderSmallState,
            orderId: id,
        })
      }
    }
  }

  /**
   * @module 订单列表分页效果，接口返回的数据
   * @param callback:当列表滚动到屏幕最底部时，调用分页接口
   */
  newListData = (callback) => {
    this.dataPage = parseFloat(this.dataPage + 1);
    // 顶部tab触发onChange时的订单状态 0/1/2/3 number
    let tabIndexStatus = this.state.tabIndex - 0;
    //当前页码
    let pages = this.dataPage;
    //列表总数除以每页返回的列表数，得到的值向上取整，就是当前总页码数
    let rows = Math.ceil(this.state.orderListTotal / this.state.row);
    //判断当前页码大于总页码数，方法结束
    if (pages > rows) {
      return false;
    }
    client.post('api/order/getlist.html', {
      'status': tabIndexStatus,//onChange的返回值,订单状态
      'p': pages,
    }).then(response => {
      if (callback) {
        callback(response.list);
      }
    }).catch(error => {
    });
  }

  /**
   * @module 订单状态为<全部订单>时返回的订单列表渲染
   * @param obj:子组件的全部订单列表
   */
  orderListMain = (obj) => {
    const orderStyle = {
      display: this.state.orderSmallState ? 'block' : 'none'
    };
    // 所有的子订单数组
    let orderChildrenArr = obj.children;
    // 判断主订单状态===待付款，底部添加支付和撤销按钮
    if (obj.status === 1) {
      return (
        <div key={obj.id} style={{marginTop: '0.5em'}}>
          <div className="order">
            <div className="sizeLg"/>
            <div className="flex-container">
              <Flex justify="between" className='orderNum'>
                <div className="orderNumOne" onClick={this.mainOrderDetails.bind(this, obj.id)}>{obj.number}</div>
                <div className="orderNumOneState">{obj.status_text}</div>
                <div className="orderNumOneMoney">￥{obj.amount_order}</div>
              </Flex>
              <div className="orderChildStatus">
                <div>
                  <Flex justify='between'>
                    <div className="orderStatus" onClick={this.orderChildrenBtn.bind(this, obj.id)}>
                      <img style={{width: '1em'}} src={require('../../image/accountOrder/wechat.png')} alt="2"/>
                      <span> {obj.send_type_text} </span>
                      <span className="orderChild">({orderChildrenArr.length})</span>
                    </div>
                    {/*判断支付方式如果===1，添加支付和撤销按钮*/}
                    <div style={{padding: '0.5em', fontSize: '1em'}}>
                      {obj.payfor_type === 1 ? this.orderBtn(obj.id) : '线下支付'}
                    </div>

                  </Flex>
                </div>
                {/*子订单*/}
                <div className='sonBorder' style={orderStyle}>
                  {
                    // 循环所有子订单
                    orderChildrenArr.map((item) => {
                      if (obj.id === this.state.orderId) {
                        return (
                          <div key={item.id} className="orderSmall">
                            <Flex justify="between">
                              <div className="orderNumOne"
                                   onClick={this.sonOrderDetails.bind(this, item.id)}>{item.number}</div>
                              <div className="orderNumOneState">{item.status_text}</div>
                              <div style={{color: '#000000', fontWeight: 'inherit',}}
                                   className="orderNumOneMoney">￥{item.amount_order}</div>
                            </Flex>
                          </div>
                        )
                      }
                      return false;
                    })
                  }
                </div>
              </div>
              {/*子订单结束*/}
            </div>
          </div>
        </div>
      )
    } else {// 判断主订单状态!==待付款，底部没有按钮
      return (
        <div key={obj.id} style={{marginTop: '0.5em'}}>
          <div className="order">
            <div className="sizeLg"/>
            <div className="flex-container">
              <Flex justify="between" className='orderNum'>
                <div className="orderNumOne" onClick={this.mainOrderDetails.bind(this, obj.id)}>{obj.number}</div>
                <div className="orderNumOneState">{obj.status_text}</div>
                <div className="orderNumOneMoney">￥{obj.amount_order}</div>
              </Flex>
              <div className="orderChildStatus">
                <div onClick={this.orderChildrenBtn.bind(this, obj.id)}>
                  <Flex align="baseline">
                    <div className="orderStatus">
                      <img style={{width: '1em'}} src={require('../../image/accountOrder/wechat.png')} alt="2"/>
                      <span> {obj.send_type_text} </span>
                      <span className="orderChild">({orderChildrenArr.length})</span>
                    </div>
                  </Flex>
                </div>
                {/*子订单*/}
                <div className='sonBorder' style={orderStyle}>
                  {
                    orderChildrenArr.map((item) => {
                      if (obj.id === this.state.orderId) {
                        if (item.status === 5) {
                          return (
                            <Flex justify="between" key={item.id} className="orderSmall">
                              <div className="orderNumOne"
                                   onClick={this.sonOrderDetails.bind(this, item.id)}>{item.number}</div>
                              <div className="orderNumOneState redState">{item.status_text}</div>
                              <div style={{color: '#000000', fontWeight: 'inherit',}}
                                   className="orderNumOneMoney">￥{item.amount_order}</div>
                            </Flex>
                          )
                        } else {
                          return (
                            <Flex justify="between" key={item.id} className="orderSmall">
                              <div className="orderNumOne"
                                   onClick={this.sonOrderDetails.bind(this, item.id)}>{item.number}</div>
                              <div className="orderNumOneState">{item.status_text}</div>
                              <div style={{color: '#000000', fontWeight: 'inherit',}}
                                   className="orderNumOneMoney">￥{item.amount_order}</div>
                            </Flex>
                          )
                        }
                      }
                      return false;
                    })
                  }
                </div>
              </div>
              {/*子订单结束*/}
            </div>
          </div>
        </div>
      )
    }
  }

  /**
   * @module 撤销按钮提示框
   * @param id:主订单id
   */
  orderRevocation = (id) => {
    window.scrollTo(0, 0);
    alert('确定撤销吗？', '', [
      {text: '取消'},
      {text: '确定', onPress: () => this.revocation(id)},
    ])
  }

  /**
   * @module 支付和撤销按钮
   * @param id:主订单ID
   */
  orderBtn = (id) => {
    return (
      <Flex justify="end" className='orderBtnState'>
        <Button className="orderBtnR" type="warning" size="small" inline onClick={this.toPay.bind(this, id)}>支付</Button>
        <Button onClick={this.orderRevocation.bind(this, id)} className="orderBtnW" size="small" inline>撤销</Button>
      </Flex>
    )
  }

  toPay = (oid) => {
    this.context.router.history.push({pathname: '/admin/minePage/orderPay', state: {order: oid}});
  }

  /**
   * @module 页面加载提示
   */
  loadingToast = () => {
    Toast.loading('Loading...', 1);
  }
  /**
   * @module 点击确定撤销时请求撤销接口
   * @param id:主订单id
   */
  revocation = (id) => {
    client.post('api/order/cancel.html', {
      'oid': id,
    }).then(response => {
      // 订单取消提示框
      Toast.success('订单已取消！', 2);
      setTimeout(() => {
        this.orderListAll(this.state.tabIndex - 1)
      }, 3000);
    }).catch(error => {
    });
  }

  /**
   * @module 当订单一览列表为空时，页面渲染提示获取佣金后即可提现。
   */
  depositHint = () => {
    if (this.state.orderListTotal === 0) {
      return (
        <div className='shopListClass' key='1'>
          <img style={{width: '18%'}} src={require('../../image/icon/noneState.png')} alt="没有数据"/>
          <p style={{fontSize: '0.8em'}}>您还没有相关订单</p>
        </div>
      )
    }
  }

  render() {
    const displayState = this.state.displayState;
    const visibleState = this.state.visibleState;
    let stateO = this.state.orderState - 0;
    return (
      <div className="orderBody">
        <Tabs
          tabs={tabs}
          initialPage={stateO}
          onChange={(tab, index) => {
            this.setState({
              tabIndex: index,
            })
            // tab变化时调用请求列表的接口
            this.orderListAll(index)
          }}
        >
        </Tabs>
        <div style={{visibility: (displayState), marginTop: '3.6em'}}>
          <PageList
            commissionListArr={this.state.orderList}
            comDataFunc={this.newListData}
            depDataFUNC={this.orderListMain}
            rows={this.state.rows}
            row={this.state.row}
            orderId={this.state.orderId}
            dataType={this.state.tabIndex}
          />
        </div>
        <div style={{visibility: (visibleState)}}>
          {this.depositHint()}
        </div>
      </div>
    )
  }
}