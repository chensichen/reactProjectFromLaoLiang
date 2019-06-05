import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom"
import 'antd-mobile/dist/antd-mobile.css';
// 底部导航
import TabBar from './components/base/tabBar'
// 我的
import MineHome from './pages/mine/mineHome'
// 首页
import Home from './pages/home/homeRouter'
import HomePage from "./pages/home/homePage";
//购物车
// import ShopPage from "./pages/shop/shopPage";
import ShopHome from "./pages/shop/shopRouter";
import BrandPage from "./pages/brand/brandPage"; //品牌馆
//未签约和拒绝签约
import Sign from "./pages/sign/sign"
//申请签约
import SignInfoMine from "./pages/sign/signInfoMine"
import client from "./frame/client";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // tabBar:'Tab',
    }
  }
  componentWillMount() {
    client.post('api/common/getconfig.html', {
      'keys': 'app_name',
    }).then(response => {
      // console.log(response)
      localStorage.setItem('app_name', response.app_name?response.app_name:'樱淘海外严选');
    }).catch({

    });

  }

  render() {

    return (
      <div>
        <div>
          <Switch>
            {/*首页*/}
            <Route path='/admin/homePage' component={Home}/>
            {/*品牌馆*/}
            <Route path='/admin/brandPage' component={BrandPage}/>
            {/*购物车*/}
            <Route path='/admin/shopPage' component={ShopHome}/>
            {/*我的*/}
            <Route path='/admin/minePage' component={MineHome}/>
            {/*/!*未签约、拒绝签约、签约过期*!/*/}
            <Route path='/admin/sign' component={Sign}/>
            {/*申请签约*/}
            <Route path='/admin/signInfoMine' component={SignInfoMine}/>

            {/*首页*/}
            <Redirect to='/admin/homePage/home' component={HomePage} />
          </Switch>
        </div>
        <TabBar/>
      </div>
    );
  }
}