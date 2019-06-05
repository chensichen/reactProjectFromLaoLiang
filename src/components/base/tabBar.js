import React from 'react';
import {TabBar} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import PropTypes from 'prop-types';
import emitter from "./ev";
import client from "../../frame/client";

export default class tabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: 0,
      selectedTab: sessionStorage.getItem('TabMenu'),
      SearchState: 'none',
    };
    client.post('api/cart/getlist.html', {}).then(response => {
      this.setState({
        msg: response.total,
      })
    }).catch(error => {
    });
  }
  // 当前页面路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        SearchState: 'block',
      })
    }, 500)

    // 声明一个自定义事件，在组件装载完成以后
    this.eventEmitter = emitter.addListener("callMe", (msg) => {
      this.setState({
        msg
      })
    });
  }

  // 组件销毁前移除事件监听
  componentWillUnmount() {
    //商品加入购物车后改变底部菜单购物车数量
    emitter.removeListener(this.eventEmitter);
  }

  render() {
    const SearchState = this.state.SearchState;
    const selectedTab= sessionStorage.getItem('TabMenu');
    return (
      <div className='tabBar' style={{display: (SearchState), width: '100%', position: 'fixed', bottom: 0}}>
        <TabBar
          unselectedTintColor="#4c4c4c"
          tintColor="#D81E06"
          barTintColor="white"
          tabBarPosition="bottom"
        >
          <TabBar.Item
            title="首页"
            key="home"
            icon={<div style={{
              width: '20px',
              height: '20px',
              background: 'url(/image/tabBar/homeG.svg) center center /  20px 20px no-repeat'
            }}
            />
            }
            selectedIcon={<div style={{
              width: '20px',
              height: '20px',
              background: 'url(/image/tabBar/homeR.svg) center center /  20px 20px no-repeat'
            }}
            />
            }
            selected={selectedTab === 'blueTab'}
            onPress={() => {
              sessionStorage.setItem('TabMenu', 'blueTab')
              this.context.router.history.push('/admin/homePage/home');
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(/image/tabBar/brandG.svg) center center /  22px 22px no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(/image/tabBar/brandR.svg) center center /  22px 22px no-repeat'
              }}
              />
            }
            title="品牌"
            key="Koubei"
            selected={selectedTab === 'redTab'}
            onPress={() => {
              sessionStorage.setItem('TabMenu', 'redTab')
              this.context.router.history.push('/admin/brandPage');
              // this.context.router.history.push('/admin/brandPage/brandPage');
              this.setState({
                selectedTab: 'redTab',
              });
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '20px',
                height: '20px',
                background: 'url(/image/tabBar/shoppingG.svg) center center /  20px 20px no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '20px',
                height: '20px',
                background: 'url(/image/tabBar/shoppingR.svg) center center /  20px 20px no-repeat'
              }}
              />
            }
            title="购物车"
            key="Friend"
            badge={this.state.msg}
            selected={selectedTab === 'greenTab'}
            onPress={() => {
              sessionStorage.setItem('TabMenu', 'greenTab')
              this.context.router.history.push('/admin/shopPage/shop');
              this.setState({
                selectedTab: 'greenTab',
              });
            }}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '20px',
                height: '20px',
                background: 'url(/image/tabBar/mineG.svg) center center /  20px 20px no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: '20px',
                height: '20px',
                background: 'url(/image/tabBar/mineR.svg) center center /  20px 20px no-repeat'
              }}
              />
            }
            title="我的"
            key="me"
            selected={selectedTab === 'yellowTab'}
            onPress={() => {
              sessionStorage.setItem('TabMenu', 'yellowTab')
              this.context.router.history.push('/admin/minePage/mine');
              this.setState({
                selectedTab: 'yellowTab',
              });
            }}
          >
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}