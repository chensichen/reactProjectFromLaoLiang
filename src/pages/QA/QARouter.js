import React from 'react';
import {Route, Switch,Redirect} from "react-router-dom";
import QAPage from './QAPage'//QA首页
import QAList from './QAList'//QA一览
import QASearch from './QASearch'//QA检索
import QADetails from './QADetails'//QA详情
import QAHistory from './QAHistory'//QA历史



export default class QARouter extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {/*QA首页*/}
          <Route path='/admin/minePage/QAPage' component={QAPage} />
          {/*QA一览*/}
          <Route path='/admin/minePage/QAList' component={QAList} />
          {/*QA检索*/}
          <Route path='/admin/minePage/QASearch' component={QASearch} />
          {/*QA详情*/}
          <Route path='/admin/minePage/QADetails' component={QADetails} />
          {/*QA历史*/}
          <Route path='/admin/minePage/QAHistory' component={QAHistory} />

          {/*QA首页*/}
          <Redirect to='/admin/minePage/QAPage' component={QAPage} />
        </Switch>
      </div>
    )
  }
}