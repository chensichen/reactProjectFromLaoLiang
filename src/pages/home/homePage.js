import React from 'react';
import client from '../../frame/client';
import 'antd-mobile/dist/antd-mobile.css';
import HomeSearch from './homeSearch';
import CarouselBar from '../../components/base/carouselBar';
import HomeTabBar from '../../components/base/homeTabBar';
import ProductList from '../../components/base/productList';
import '../../App.css'

export default class homePage extends React.Component {
  constructor(props) {
    document.title = localStorage.getItem('app_name') ? localStorage.getItem('app_name') : '樱淘海外严选'
    super(props);
    this.dataPage = 1; //页码
    this.state = {
      dataProduct: [], //商品列表
      data1: [],
      dataSlide: [], //轮播图
      dataCategory: [], //tabs页标签
      dataAdsImg: '', //广告图图片
      dataAdsTarget: '', //广告图url
      tabsType: '', //商品分类Id
      dataPage: 1,
      recommend: 1,
      haveProduct: 'none', //前分类有商品
      displayState: 'none',//分类没有商品时
      haveAds: 'none', //判断是否有广告图片
      SearchState: 'none',//搜索栏是否显示
    };
  }

  componentDidMount() {
    this.mounted = true;
    //获取轮播图数据
    client.post('api/common/banner.html', {}).then(response => {
      for (let i = 0; i < response.length; i++) {
        response[i].id = i;
      }
      if(this.mounted){
        this.setState({
            dataSlide: response,
            SearchState: 'block',//搜索栏显示
        })
      }
    }).catch(error => {
    });
	
    //获取类别列表数据
    client.post('api/common/category.html', {}).then(response => {
      response.list.unshift({
          id: '',
          title: '全部',
        },
        {
          id: '',
          title: '推荐',
        });
      if(this.mounted){
        this.setState({
            dataCategory: response.list
        })
      }
    }).catch(error => {
    });	  

    //获取广告图数据
    client.post('api/common/ads.html', {
      "page": 1,
    }).then(response => {
      if (JSON.stringify(response[0]) === undefined) {
        return false;
      } else if (response[0]) {
        if(this.mounted){
          this.setState({
              haveAds: 'block',
              dataAdsImg: response[0].url_img,
              dataAdsTarget: response[0].url_target
          })
        }
      }
    }).catch(error => {
    });
    //获取商品列表数据
    client.post('api/goods/getlist.html', {
      'p': 1,
      'rows': 4,
      "cate": this.state.tabsType,
      "recommend": this.state.recommend,
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
  componentWillUnmount() {
      this.mounted = false;
  }
  callback = (id, recommend) => {
    // setState方法,修改tabstype的值,值是由child里面传过来的
    //为调用this.newListData接口传tabstype值
    this.dataPage = 1;
    this.setState({
      tabsType: id,
      recommend: recommend,
    });
    //获取商品列表数据
    client.post('api/goods/getlist.html', {
      'p': 1,
      'rows': 4,
      "cate": id,
      "recommend": recommend,
    }).then(response => {
      if (response.list.length > 0) {
        if(this.mounted){
          if(this.mounted){
            this.setState({
                dataProduct: response.list.reverse(),
                haveProduct: 'block',
                displayState: 'none',
            })
          }
        }
      } else if (response.list.length === 0) {
        if(this.mounted){
          if(this.mounted){
            this.setState({
                haveProduct: 'none',
                displayState: 'block',
            })
          }
        }
      }
    }).catch(error => {

    });
  }

  // 3商品列表分页效果，接口返回的数据
  newListData = (callback) => {
    this.dataPage = parseFloat(this.dataPage + 1);
    client.post('/api/goods/getlist.html', {
      'p': this.dataPage,
      'rows': 4,
      "cate": this.state.tabsType,
      "recommend": this.state.recommend,
    }).then(response => {
      if (callback) {
        callback(response);
      }
    }).catch(error => {
    });
  }  
  
  render() {

	const haveAds = this.state.haveAds;
    const displayState = this.state.displayState;
    const haveProduct = this.state.haveProduct;
    const SearchState = this.state.SearchState;
   	return (
      <div className='homePage'>
        {/*搜索框*/}
        <div style={{display: (SearchState)}}>
          <HomeSearch/>
        </div>
        {/*轮播图*/}
        <CarouselBar data={this.state.dataSlide}/>
        {/*tabs标签*/}
        <HomeTabBar data={this.state.dataCategory} callback={this.callback}/>
        {/*<HomeProductList />*/}
		{/*广告图*/}
        <div style={{display: (haveAds)}}>
          <a href={this.state.dataAdsTarget ? this.state.dataAdsTarget : '#'}>
            <img src={this.state.dataAdsImg ? this.state.dataAdsImg : ''}
                 style={{width: '100%', height: this.state.dataAdsImg ? '11.6em' : '0em'}} alt='1'/>
          </a>
        </div>
        {/*商品列表*/}
        <div style={{display: (haveProduct)}}>
          <ProductList proData={this.state.dataProduct} proDataFunc={this.newListData}/>
        </div>
        {/*没有商品时*/}
        <div style={{display: (displayState)}} className='depositListClass' key='1'>
          <img style={{width: '18%'}} src={require('../../image/icon/noShop.png')} alt="没有数据"/>
          <p style={{fontSize: '0.8em', background: '#ffffff'}}>没有任何商品</p>
          <div style={{width: '100%', height: '3em'}}/>
        </div>
      </div>
    )
  }
}
