import React from 'react';
import client from '../../frame/client';
import 'antd-mobile/dist/antd-mobile.css';
import './brandPage.css';
import Search from '../../components/base/search';
import BrandCate from '../../components/base/brandCateList';
import BrandList from '../../components/base/brandList';

export default class brandPage extends React.Component {
  constructor(props) {
    document.title = '品牌馆'
    super(props);
    this.dataPage = 1; //页码
    this.state = {
      dataProduct: [], //商品列表
      show: false,
      cateList: [], //商品分类列表
      tabsType: '', //商品分类Id
      haveProduct: 'none', //前分类有商品
      displayState: 'none',//分类没有商品时
    };
    this.mounted = true;
  }

  componentDidMount() {
    //品牌分类
    client.post('api/goods/brand.html', {
      'p': '1',
      'rows': '1000',
    }).then(response => {
      if(this.mounted){
        this.setState({
            cateList: response.list,
            tabsType: response.list[0].id,
        })
      }

      //根据品牌分类的第一个id，获取商品列表
      client.post('api/goods/getlist.html', {
        'p': 1,
        'rows': 10,
        "brand": this.state.cateList[0].id,
      }).then(response => {
        if (response.list.length > 0) {
          if(this.mounted){
            this.setState({
                dataProduct: response.list.reverse(),
                haveProduct: 'block',
                displayState: 'none',
            })
          }
        } else if (response.list.length === 0) {
          if(this.mounted){
            this.setState({
                haveProduct: 'none',
                displayState: 'block',
            })
          }
        }
      }).catch(error => {
      });
    }).catch(error => {
    });
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  callBackId = (id) => {
    // setState方法,修改tabstype的值,值是由child里面传过来的
    //为调用this.newListData接口传tabstype值
    this.setState({
      tabsType: id,
    });
    //获取商品列表数据
    client.post('api/goods/getlist.html', {
      'p': 1,
      'rows': 8,
      "brand": id,
    }).then(response => {
      if (response.list.length > 0) {
        if(this.mounted){
          this.setState({
              dataProduct: response.list.reverse(),
              haveProduct: 'block',
              displayState: 'none',
          })
        }
      } else if (response.list.length === 0) {
        if(this.mounted){
          this.setState({
              haveProduct: 'none',
              displayState: 'block',
          })
        }
      }
    }).catch(error => {
    });
  }
  // 3商品列表分页效果，接口返回的数据
  newListData = (callback) => {
    this.dataPage = parseFloat(this.dataPage + 1);
    client.post('api/goods/getlist.html', {
      'p': this.dataPage,
      'rows': 8,
      "brand": this.state.tabsType,
    }).then(response => {
      if (callback) {
        callback(response);
      }
    }).catch(error => {
    });
  }

  render() {
    const displayState = this.state.displayState;
    const haveProduct = this.state.haveProduct;
    return (
      <div className='brandPage'>
        <Search/>
        <div style={{display: 'flex'}}>
          <div className={'BrandCateLeft'}>
            <BrandCate cateList={this.state.cateList} callBackId2={this.callBackId} defaultId={this.state.tabsType}/>
            <div style={{height:'3.2em'}}/>
          </div>
          {/*商品列表*/}
          <div className={'BrandList'} style={{display: (haveProduct)}}>
            <BrandList proData={this.state.dataProduct} proDataFunc={this.newListData}/>
          </div>
          {/*没有商品时*/}
          <div style={{display: (displayState)}} className='depositListClass brandListClass' key='1'>
            <img style={{width: '18%'}} src={require('../../image/icon/noShop.png')} alt="没有数据"/>
            <p style={{fontSize: '0.8em'}}>没有任何商品</p>
          </div>
        </div>
      </div>
    )
  }

}
