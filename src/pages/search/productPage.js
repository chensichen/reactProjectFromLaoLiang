import React from 'react';
import {SearchBar, Toast} from 'antd-mobile';
import client from '../../frame/client';
import 'antd-mobile/dist/antd-mobile.css';
import ProductList from '../../components/base/productList';
import '../../App.css'

export default class productPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataPage = 1; //页码
    this.state = {
      dataProduct: [], //商品列表
      data1: [],
      dataPage: 1,
      value: '',
      displayState:'none',
      ProductListState:'none',
    };
    this.mounted = true;
  }

  componentDidMount() {
    //获取检索名称
    let url = decodeURI(window.location.href, "UTF-8");
    let name = url.split('search/')[1];
    //获取商品列表数据
    client.post('api/goods/getlist.html', {
      name: name,
    }).then(response => {
      if (response.list.length===0){
        if(this.mounted){
          this.setState({
              value: name,
              displayState:'block',
              ProductListState:'none',
          })
        }
        return false;
      }else {
        if(this.mounted){
          this.setState({
              dataProduct: response.list,
              value: name,
              displayState:'none',
              ProductListState:'block',
          })
        }

      }

    }).catch(error => {
    });

  }

  // 商品列表分页效果，接口返回的数据
  newListData = (callback) => {
    this.dataPage = parseFloat(this.dataPage + 1);
    client.post('/api/goods/getlist.html', {
      'p': this.dataPage,
      'rows': 8,
    }).then(response => {
      if (callback) {
        callback(response);
      }
    }).catch(error => {
    });
  }

  onChange = (value) => {
    this.setState({value: value});
  };
  clear = () => {
    this.setState({value: ''});
  };
  submit = (name) => {
    //页面跳转
    if (name) {
      //输入检索名称时，获取商品列表数据
      client.post('api/goods/getlist.html', {
        'p': 1,
        'rows': 8,
        'name': name,
      }).then(response => {
        if (response.list.length===0){
          if(this.mounted){
            this.setState({
                displayState:'block',
                ProductListState:'none',
            })
          }
          return false;
        }else {
          if(this.mounted){
            this.setState({
                dataProduct: response.list,
                value: name,
                displayState:'none',
                ProductListState:'block',
            })
          }
        }
      }).catch(error => {
      });
    } else {
      Toast.success('请输入要搜索的商品名称', 2);
    }
  }
  componentWillUnmount(){
      this.mounted = false;
  }
  render() {
    const displayState = this.state.displayState;
    const ProductListState = this.state.ProductListState;
    return (
      <div className='appBgF'>
        <div className='search'>
          {/*搜索框*/}
          <SearchBar
            value={this.state.value}
            placeholder="请输入要搜索的商品名称"
            onSubmit={(value) => {
              this.submit(value)
            }}
            onClear={(value) => {
              this.clear(value)
            }}
            onCancel={(value) => {
              this.clear(value)
            }}
            onChange={this.onChange}
          />
        </div>
        {/*商品列表*/}
        <div style={{display: (ProductListState)}}>
          <ProductList proData={this.state.dataProduct} proDataFunc={this.newListData}/>
        </div>

        {/*没有商品时*/}
        <div style={{display: (displayState)}} className='depositListClass' key='1'>
          <img style={{width: '18%'}} src={require('../../image/icon/noShop.png')} alt="没有数据"/>
          <p style={{fontSize: '0.8em'}}>没有任何商品</p>
        </div>
      </div>

    )
  }
}
