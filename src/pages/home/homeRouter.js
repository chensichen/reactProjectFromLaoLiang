import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import HomePage from './homePage' //首页
import ProductDetail from '../productDetail/productDetail' //商品详情
import Search from '../search/productPage' //检索商品列表

export default class homeRouter extends React.Component {

  render() {
    return (
      <div>
        <Switch>
          {/*首页*/}
          <Route path='/admin/homePage/home' component={HomePage}/>
          {/*商品详情页面*/}
          <Route path='/admin/homePage/productDetail/:detailState' component={ProductDetail}/>
          {/*检索商品列表页*/}
          <Route path='/admin/homePage/search/:name' component={Search}/>
          {/*首页*/}
          <Redirect to='/admin/homePage/home' component={HomePage}/>
        </Switch>
      </div>
    )
  }
}