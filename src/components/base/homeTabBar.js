import React from 'react';
import {Tabs, WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './homeTabs.css';

export default class tabBar extends React.Component {
  changeEvent(tab) {
    //切换tab页 调接口取数据
    let recommend = 0;
    if (tab.title === '推荐') {
      recommend = 1;
    }
    this.props.callback(tab.id, recommend);
  }

  render() {
    return (
      <div style={{display: 'flex', overflow: 'hidden !important'}}>
        <WhiteSpace/>
        <Tabs tabs={this.props.data} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6}/>}
              initialPage={1}
              onChange={(tab) => this.changeEvent(tab)}
              swipeable={false}
              destroyInactiveTab={true}
              animated={false}
              tabBarPosition={'top'}
              usePaged={false}
        >
        </Tabs>
        <WhiteSpace/>
      </div>
    );
  }
}