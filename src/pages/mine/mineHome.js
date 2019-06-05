import React from 'react';
import {Route, Switch,Redirect} from "react-router-dom";
import MinePage from './MinePage' //我的
import OrderRouter from '../order/orderRouter' //订单一览
import SignInfo from '../sign/signInfo' //签约信息
import SignInfoMine from '../sign/signInfoMine' //签约信息
import Team from '../team/team' //分销团队
import Deposit from '../deposit/deposit' //提现一览
import DepositMayRouter from '../depositMay/depositMayRouter' //提现申请
import EwmCode from '../ewmCode/ewmCode' //分销二维码
import Commission from '../commission/commission' //佣金一览
import QARouter from '../QA/QARouter'//QA路由
import BankCardRouter from "../bankCard/bankCardRouter";//银行卡
import IntelligenMatch from "../intelligentMatch/intelligenMatch";//银行卡


export default class mineHome extends React.Component {

  render() {
    return (
      <div>
        <Switch>
          {/*我的页面*/}
          <Route path='/admin/minePage/mine' component={MinePage} />
          {/*订单一览*/}
          <Route path='/admin/minePage/order/:orderState' component={OrderRouter} />
          {/*主订单详情*/}
          <Route path='/admin/minePage/orderMain' component={OrderRouter} />
          {/*子订单详情*/}
          <Route path='/admin/minePage/orderAttached' component={OrderRouter} />
          {/*订单支付*/}
          <Route path='/admin/minePage/orderPay' component={OrderRouter} />
          {/*签约信息*/}
          <Route path='/admin/minePage/signInfo' component={SignInfo} />
          {/*我的签约信息*/}
          <Route path='/admin/minePage/signInfoMine' component={SignInfoMine} />
          {/*分销团队*/}
          <Route path='/admin/minePage/team' component={Team} />
          {/*提现一览*/}
          <Route path='/admin/minePage/deposit' component={Deposit} />
          {/*银行卡首页*/}
          <Route path='/admin/minePage/bankCard' component={BankCardRouter} />
          {/*银行卡编辑*/}
          <Route path='/admin/minePage/bankCardEdit' component={BankCardRouter} />
          {/*分销二维码*/}
          <Route path='/admin/minePage/ewmCode' component={EwmCode} />
          {/*智能匹配*/}
          <Route path='/admin/minePage/intelligenMatch' component={IntelligenMatch} />
          {/*佣金一览*/}
          <Route path='/admin/minePage/commission' component={Commission} />
          {/*QA首页*/}
          <Route path='/admin/minePage/qaPage' component={QARouter} />
          {/*QA一览*/}
          <Route path='/admin/minePage/QAList' component={QARouter} />
          {/*QA检索*/}
          <Route path='/admin/minePage/QASearch' component={QARouter} />
          {/*QA详情*/}
          <Route path='/admin/minePage/QADetails' component={QARouter} />
          {/*QA历史*/}
          <Route path='/admin/minePage/QAHistory' component={QARouter} />
          {/*可提现金额*/}
          <Route path='/admin/minePage/depositMay' component={DepositMayRouter} />
          {/*我的*/}
          <Route path='/admin/minePage/mine' component={DepositMayRouter} />


          {/*我的页面*/}
          <Redirect to='/admin/minePage/mine' component={MinePage} />

        </Switch>
      </div>
    )
  }
}