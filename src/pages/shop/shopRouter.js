import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import ShopPage from './shopPage'
import AccountOrderPage from '../accountOrder/accountOrderPage' //结算订单页
import AddressEditPage from '../address/addressEditPage' //收货地址编辑页
import AddressSelectPage from '../address/addressSelectPage' //收货地址选择页
import AddressNewPage from '../address/addressNewPage' //收货地址新建页
import ShopPaySuccess from '../shop/shopPaySuccess' //收货地址新建页

export default class shopRouter extends React.Component {

  render() {
    return (
      <div>
        <Switch>
          {/*购物车*/}
          <Route path='/admin/shopPage/shop' component={ShopPage}/>
          {/*订单结算页*/}
          <Route path='/admin/shopPage/accountOrderPage/:id/:fareValue/:payType/:addType' component={AccountOrderPage}/>
          {/*收货地址编辑页*/}
          <Route path='/admin/shopPage/addressEditPage/:id:type' component={AddressEditPage}/>
          {/*新建收货地址页*/}
          <Route path='/admin/shopPage/addressNewPage/:type' component={AddressNewPage}/>
          {/*收货地址选择页*/}
          <Route path='/admin/shopPage/addressSelectPage/:type/:fareValue/:payType/:addType'
                 component={AddressSelectPage}/>
          {/*/!*订单提交成功跳转页*!/*/}
          <Route path='/admin/shopPage/shopPaySuccess' component={ShopPaySuccess}/>
          {/*首页*/}
          <Redirect to='/admin/shopPage/shop' component={ShopPage}/>
        </Switch>
      </div>
    )
  }
}