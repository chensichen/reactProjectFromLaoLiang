import React from 'react';
import {Route, Switch,Redirect} from "react-router-dom";
import BankCard from './bankCard'//银行卡首页
import BankCardEdit from './bankCardEdit'//银行卡编辑


export default class bankCardRouter extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/*银行卡首页*/}
          <Route path='/admin/minePage/bankCard' component={BankCard} />
          {/*银行卡编辑*/}
          <Route path='/admin/minePage/bankCardEdit' component={BankCardEdit} />

          {/*银行卡首页*/}
          <Redirect to='/admin/minePage/bankCard' component={BankCard} />
        </Switch>
      </div>
    )
  }
}