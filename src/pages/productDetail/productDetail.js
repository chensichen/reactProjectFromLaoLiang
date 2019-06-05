import React from 'react';
import {List} from 'antd-mobile';
import client from '../../frame/client';
import ShopTabBar from './shopTabBar';
import DetailSlideBar from './detailSlideBar';
import 'antd-mobile/dist/antd-mobile.css';
import './productDetail.css';
import {Player} from 'video-react';   // 视频播放
import "../../../node_modules/video-react/dist/video-react.css";
import '../../App.css'

const Item = List.Item;
export default class productDetail extends React.Component {
  constructor(props) {
    document.title = '商品详情'
    super(props);
    this.state = {
      dataSlide: [], //轮播图
      dataAll: {},
      dataVideo: '',  //视频
      dataImg: '',    //广告图
      dataSpecification: [],
      dataIntro: [],
      dataId: '',
      dataSkuId: '',
      dataName: '',
      dataPrice: '',
      dataPromotion: '',
      dataUnit: '',
      dataBaseVolume: '',
      url_vedio_img: '',   //视频截图
      isVideo: 'none',  //判断是否显示视频，如果有视频文件，则先显示截图，点击播放按钮在显示视频文件
      dataAdsImg: '', //广告图片
      dataAdsTarget: '',  //广告图链接
      dataStatus: '',
      is_deleted: 0, //判断商品是否删除
      status: 0, //判断商品状态
      stock: 0,  //判断商品库存
      can_buy: 0,    //判断商品购买权限
      unit: '￥',  //当前商品有无购买权限时，单位位置显示的内容
      adsState: 'none',//判断是否有广告图片
    };
    this.mounted = true;
  }

  componentDidMount() {
    //获取商品详情信息
    let url = window.location.href;
    let gid = url.split('productDetail/')[1];
    client.post('api/goods/detail.html', {
      'gid': gid,
    }).then(response => {
      //判断有没有视频url和视频截图,如果二者其中之一没有则不显示视频
      let video = 'none';
      if (response['url_vedio'] || response['url_video_img']) {
        video = 'block';
      }
      //判断商品状态 判断并显示'已下架'（g.is_deleted=1,g.status=2）、'已售罄'（stock=0）、'已超过库存数量'（stock<num）、'无购买权限'，无购买权限时不要显示价格；
      let status = '';
      let price = 0;
      if (response['is_deleted'] === 1 || response['status'] === 2) {
        status = '该商品已下架，非常抱歉！';
      } else if (response['stock'] === 0) {
        status = '该商品已售罄，非常抱歉！';
      } else if (response['can_buy'] === 0) {
        status = '该商品无购买权限，非常抱歉！';
        if(this.mounted){
          this.setState({
              yar: '',
          })
        }
      }
      //如果当前商品无购买权限时价格位置显示的内容为“无购买权限”

      if (this.state.unit.length === 0) {
        price = "无购买权限";
      } else {
        price = response['price'];
      }
      if(this.mounted){
        this.setState({
            dataSlide: response['img_main'],
            dataImg: response['url_show'],
            dataSpecification: response['attr'],
            dataIntro: response['content'],
            dataVideo: response['url_vedio'],
            dataId: gid,
            dataSkuId: response['sku'][0].id,
            dataName: response['name'],
            dataPrice: price,
            dataPromotion: response['promotion'],
            dataUnit: response['unit'],
            dataBaseVolume: response['base_volume'],
            dataAll: response,
            url_vedio_img: response['url_video_img'],
            dataStatus: status,
            is_deleted: response['is_deleted'], //判断商品是否删除
            status: response['status'], //判断商品状态
            stock: response['stock'],  //判断商品库存
            can_buy: response['can_buy'],    //判断商品购买权限
            isVideo: video,
        })
      }
    }).catch(error => {
    });

    //获取广告图数据
    client.post('api/common/ads.html', {
      "page": '2',
    }).then(response => {
      if (response[0]) {
        if(this.mounted){
          this.setState({
              adsState: 'block',
              dataAdsImg: response[0].url_img,
              dataAdsTarget: response[0].url_target
          })
        }
      }
    }).catch(error => {

    });
  }
  componentWillUnmount() {
      this.mounted = false;
  }
  render() {
    const adsState = this.state.adsState;
    return (
      <div className='appBgF'>
        <DetailSlideBar data={this.state.dataSlide}/>
        {/*商品主要参数*/}
        <div className={'productDetail'}>
          <div className={'detailTitle'}>{this.state.dataName}</div>
          <div className={'detailSubtitle'}>
            <span>{this.state.dataPromotion}</span>
            <span>已售{this.state.dataBaseVolume}{this.state.dataUnit}</span>
          </div>
          <div className={'detailPrice'}>
            {this.state.unit}{this.state.dataPrice}
          </div>
        </div>
        {/*广告图*/}
        <div style={{display: (adsState)}}>
          <a href={this.state.dataAdsTarget}>
            <img src={this.state.dataAdsImg ? this.state.dataAdsImg : ''}
                 style={{width: '100%', height: this.state.dataAdsImg ? '11.6em' : '0em'}} alt='1'/>
          </a>
        </div>
        {/*详情参数*/}
        <List className="my-list wrap">
          {this.state.dataSpecification.map((val, i) => (
            <Item
              wrap={true}
              key={i}
              extra={val.remark}
              style={{padding: '0 1em', fontSize: '1em'}}
            >{val.iname}</Item>
          ))}
        </List>
        {/*// 视频容器*/}
        <div style={{display: this.state.isVideo}}>
          <Player
            playsInline
            poster={this.state.url_vedio_img}
            src={this.state.dataVideo}
          />
        </div>
        <div className="detailImgWrap" dangerouslySetInnerHTML={{__html: this.state.dataIntro}}
             style={{overflow: 'hidden'}}/>
        <div style={{height: '4.5em'}}/>

        <ShopTabBar data={this.state.dataAll} dataStatus={this.state.dataStatus}
                    is_deleted={this.state.is_deleted} status={this.state.status} stock={this.state.stock}
                    can_buy={this.state.can_buy}/>
      </div>
    )
  }
}
