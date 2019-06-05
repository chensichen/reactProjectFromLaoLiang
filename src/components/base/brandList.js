import React from 'react';
import {ListView, Toast} from 'antd-mobile';
import emitter from "./ev"
import 'antd-mobile/dist/antd-mobile.css';
import './productList.css';
import client from "../../frame/client";
import PropTypes from "prop-types";

export default class productList extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
    };
    this.datas = [];//定义商品列表总数组
    this.mounted = true;
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到商品详情页
  myProductDetail = (id) => {
    this.context.router.history.push('/admin/homePage/productDetail/' + id);
  }

  // 组件渲染之前
  componentWillReceiveProps(nextProps) {
    // 将父组件传回的值追加到商品列表总数组中
    this.datas = nextProps.proData;
    if(this.mounted){
      this.setState({
          // cloneWithRows方法,自动提取新数据并进行逐行对比，这样ListView就知道哪些行需要重新渲染了。
          dataSource: this.state.dataSource.cloneWithRows(this.datas),
          isLoading: false,
      });
    }
  }

  //数据都渲染之后，列表被滚动到屏幕最底部时调用
  onEndReached = () => {
    if (this.state.isLoading) {
      return;
    }
    if(this.mounted){
      this.setState({
          isLoading: true,
      });
    }
    //获取父组件触发分页效果时，函数返回的商品列表数据
    this.props.proDataFunc(this.funcCallBack);
  }

  funcCallBack = (result) => {
    // 当列表滚动到屏幕最底部时，调用分页接口，将新的商品列表数据追加到总的商品列表数组中
    this.datas = [...this.datas, ...result.list.reverse()];
    if(this.mounted){
      this.setState({
          // cloneWithRows方法,自动提取新数据并进行逐行对比，这样ListView就知道哪些行需要重新渲染了。
          dataSource: this.state.dataSource.cloneWithRows(this.datas),
          isLoading: false,
      });
    }
  }
  componentWillUnmount() {
      this.mounted = false;
  }
  render() {
    //加入购物车
    const onShopper = (id, sku) => {
      // console.log(sku);
      let skuId;
      for (let i = 0; i < sku.length; i++) {
        if (sku[i].stock > 0) {
          skuId = sku[i].id;
          break;
        }
      }
      if (!skuId) {
        skuId = sku[sku.length - 1].id;
      }
      client.post('api/cart/add.html', {
        "gid": id, //必须是1
        "sku": skuId, //必须是3，4，5，6
        "num": 1,
      }).then(response => {
        Toast.success('加入购物车成功', 1);
        client.post('api/cart/getlist.html', {}).then(response => {
          return (emitter.emit("callMe", response.total))
        }).catch(error => {
          Toast.success(error.message, 2);
        });
      }).catch(error => {
        Toast.success(error.message, 2);
        // console.log(error)
      });
    }
    // separator的值会被渲染在组件的每一行下面
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
      />
    );
    let index = this.datas.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = this.datas.length - 1;
      }
      const obj = this.datas[index--];
      return (
        <div className='brandList' key={rowID} style={{padding: '0 1em 0 0'}}>
          <div style={{display: 'flex', padding: '1em 0', justifyContent: 'space-between'}}>
            <img style={{height: '6em', width: '6em', marginLeft: '0.5em', marginRight: '0.5em'}} src={obj.url_show}
                 alt="" onClick={() => {
              this.myProductDetail(obj.id)
            }}/>
            <div style={{width: '54%'}} onClick={() => {
              this.myProductDetail(obj.id)
            }}>
              <div className='productTitle'>{obj.name}</div>
              <div className='productTap'>{obj.promotion}</div>
              <div className='productMoney'><span>￥{obj.price}</span></div>
              <div className='productDetailNum'>已售{obj.base_volume}{obj.unit}</div>
            </div>
            <img className='productShop'
                 src={require('../../image/icon/shoppingAdd.png')} alt=""
                 onClick={() => {
                   onShopper(obj.id, obj.sku)
                 }}/>
          </div>
        </div>
      );
    };
    return (
      <div className='brandC'>
        <ListView
          dataSource={this.state.dataSource}
          renderFooter={() => (<div style={{fontSize: '0.8em', textAlign: 'center',}}>
            {this.state.isLoading ? '加载更多' : '已到最后一页'}
          </div>)}
          renderRow={row}
          renderSeparator={separator}
          className="am-list"
          pageSize={4}
          useBodyScroll
          onScroll={() => {
          }}
          scrollRenderAheadDistance={50}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div style={{width: '100%', height: '3.5em'}}/>
      </div>
    );
  }
}

