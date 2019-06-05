import React from 'react';
import {Route, Switch,Redirect} from "react-router-dom";
import DepositMay from './depositMay'//提现申请
import MinePage from '../mine/MinePage'//QA检索

export default class QARouter extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/*我的页面*/}
          <Route path='/admin/minePage/depositMay' component={DepositMay} />
          {/*我的页面*/}
          <Route path='/admin/minePage/mine' component={MinePage} />
          {/*提现申请*/}
          <Redirect to='/admin/minePage/depositMay' component={DepositMay} />
        </Switch>
      </div>
    )
  }
}