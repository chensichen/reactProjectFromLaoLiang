import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import Order from './order' //订单一览
import OrderMain from './orderMain' //订单主表
import OrderAttached from './orderAttached' //订单附表
import OrderPay from './orderPay';

export default class orderRouter extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/*订单一览*/}
          <Route path='/admin/minePage/order/:orderState' component={Order}/>
          {/*主订单*/}
          <Route path='/admin/minePage/orderMain/:mainId' component={OrderMain}/>
          {/*子订单*/}
          <Route path='/admin/minePage/orderAttached/:sonId' component={OrderAttached}/>
          {/*微信支付*/}
          <Route path='/admin/minePage/orderPay' component={OrderPay}/>
          {/*我的页面*/}
          <Redirect to='/admin/minePage/order/:orderState' component={Order}/>
        </Switch>
      </div>
    )
  }
}