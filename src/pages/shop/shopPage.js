import React from 'react';
import {Checkbox, Modal, Toast, Flex, Button} from 'antd-mobile';
import ShopList from '../../components/base/shopList';
import client from '../../frame/client';
import 'antd-mobile/dist/antd-mobile.css';
import './shop.css';
import PropTypes from "prop-types";
import emitter from "../../components/base/ev";//更改购物车数量

const alert = Modal.alert;
export default class shopPage extends React.Component {
  constructor(props) {
    document.title = '购物车';
    super(props);
    this.state = {
      dataProduct: [],    //商品列表
      dataTotal: '0.00',
      accountNum: 0,
      proAllChecked: false,    //当前列表商品是否全选中
      cartids: [],    //向订单结算页面传的id值
      empty: 'none',  //判断当前页是否有数据，如果没有则显示："购物车空空如也，快去选购吧"
      dataSum: 0, //当前页面商品数量
      btnTrue: true,    //判断清空购物车按钮是否可点击
      accountBottom: 'none',    //判断底部结算是否显示
    };
  }

  componentWillMount() {
    //声明一个判断setState变量
    this.mounted = true;
    // 声明一个自定义事件
    //获取商品列表数据
    client.post('api/cart/getlist.html', {})
      .then(response => {
        //判断是否有商品，如果有商品，清空购物车按钮可点击，如果没有商品，清空购物车按钮不可点击
        if (response.list.length > 0 || response.invalid_list.length) {
          if(this.mounted){
            this.setState({
                btnTrue: false,
            })
          }
        }
        //可以购买商品列表 增加checked来判断商品是否选中
        for (let i = 0; i < response.list.length; i++) {
          response.list[i].checked = false;
          response.list[i].delete = false;
          if (response.list[i].num > response.list[i].stock) {
            //增加商品库存不足状态
            response.list[i].stockType = '库存不足,剩余库存:' + response.list[i].stock;
          }
        }
        //失效的购物车商品
        for (let i = 0; i < response.invalid_list.length; i++) {
          response.invalid_list[i].disabled = true;
          //增加右侧修改商品数量位置变为删除按钮判断条件
          response.invalid_list[i].delete = true;
          //判断商品失效状态
          if (response.invalid_list[i].is_deleted === 1 || response.invalid_list[i].status === 2) {
            response.invalid_list[i].stockType = '该商品已下架';
          } else if (response.invalid_list[i].stock === 0) {
            response.invalid_list[i].stockType = '该商品已售罄';
          } else if (response.invalid_list[i].can_buy === 0) {
            response.invalid_list[i].stockType = '该商品无购买权限';
          } else if(response.invalid_list[i].stock < response.invalid_list[i].num){
            response.invalid_list[i].stockType = '该商品已超过库存数量';
          }
        }
        //将三种状态的商品列表合并成一个数组
        let productAll = response.list.concat(response.invalid_list);
        if(this.mounted) {
          this.setState({
              dataProduct: productAll,
              dataSum: response.total,
          })
        }
        if (response.list.length > 0 || response.invalid_list.length) {
          if(this.mounted){
            this.setState({
                empty: 'none',
                accountBottom: 'flex',
            })
          }
        } else {
          if(this.mounted) {
            this.setState({
                empty: 'block',
                accountBottom: 'none',
            })
          }
        }
      }).catch(error => {

    });
  }
  componentWillUnmount() {
      this.mounted = false;
  }
  // 清空购物车数量
  clearShop = () => {
    client.post('api/cart/clean.html', {}).then(response => {
      this.setState({
        btnTrue: true,
      })
      client.post('api/cart/getlist.html', {}).then(response => {
        //清空购物车成功
        //设置页面显示的商品 和页面顶部显示的商品数量
        this.setState({
          dataProduct: response.list,
          dataSum: response.total,
        })
        //判断是否显示购物车页面没有商品时的信息
        if (response.list.length > 0) {
          this.setState({
            empty: 'none',
            accountBottom: 'flex',
          })
        } else {
          this.setState({
            empty: 'block',
            accountBottom: 'none',
          })
        }
        //底部菜单购物车数量清空
        return (emitter.emit("callMe", ''))
      }).catch(error => {

      });
    }).catch(error => {

    });

  }
  //选中全部商品
  onChangeChecked = (e) => {
    if (e.target.checked) {
      let total = 0;
      let data = this.state.dataProduct;
      let accountNum = 0;
      let idAllArr = [];
      for (let i = 0; i < data.length; i++) {
        if (!data[i].disabled) {
          data[i].checked = true;
          total = parseFloat(total + parseFloat(parseFloat(data[i].price) * parseFloat(data[i].num)))
          accountNum = accountNum + parseFloat(data[i].num);
          idAllArr.push(data[i].id)
        }
      }
      //判断如果有商品则可以修改checkbox属性
      if (idAllArr.length > 0) {
        this.setState({
          dataProduct: data,
          dataTotal: total.toFixed(2),
          accountNum: accountNum,
          proAllChecked: true,
          cartids: idAllArr,
        })
      }

    } else {
      let data = this.state.dataProduct;
      for (let i = 0; i < data.length; i++) {
        if (!data[i].disabled) {
          data[i].checked = false;
        }
      }
      this.setState({
        dataProduct: data,
        dataTotal: '0.00',
        accountNum: 0,
        proAllChecked: false,
        cartids: [],
      })
    }
  }
  //获取子组件返回的商品数据及总价及id值
  shopData = (data1, data2, idArr) => {
    let isHaveFalse = false;
    for (let i = 0; i < this.state.dataProduct.length; i++) {
      if (!this.state.dataProduct[i].disabled) {
        if (!this.state.dataProduct[i].checked) {
          isHaveFalse = true;
          break;
        }
      }
    }
    if (!isHaveFalse) {
      this.setState({
        proAllChecked: true
      });
    } else {
      this.setState({
        proAllChecked: false
      });
    }
    this.setState({
      accountNum: data1,
      dataTotal: data2,
      cartids: idArr,
    })
  }
  //当前商品未选中情况下修改数量成功后，重新返回商品列表信息
  productList = (data) => {
    this.setState({
      dataProduct: data,
    })
    if (data.length > 0) {
      this.setState({
        empty: 'none'
      })
    } else {
      this.setState({
        empty: 'block'
      })
    }
  }
  //获取当商品数量减到0时删除商品后的总商品数量
  productTotal = (data) => {
    this.setState({
      dataSum: data,
    })
  }
  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到首页
  homePage = () => {
    sessionStorage.setItem('TabMenu', 'blueTab')
    this.context.router.history.push('/admin/homePage');
  }
  //购物车结算页面跳转
  myaccountOrder = () => {
    let data = this.state.dataProduct;
    let Id = this.state.cartids;
    let flag = '';
    if (this.state.cartids.length > 0) {
      localStorage.setItem('cartids', this.state.cartids);
      for (let j = 0; j < Id.length; j++) {
        for (let i = 0; i < data.length; i++) {
          if (Id[j] === data[i].id) {
            //已下架
            if (data[i].is_deleted === 1 || data[i].status === 2) {
              flag = '已下架';
              break;
            } else if (data[i].stock === 0) {
              //已售罄
              flag = '已售罄';
              break;
            } else if (data[i].can_buy === 0) {
              //无购买权限
              flag = '无购买权限';
              break;
            } else if (data[i].num > data[i].stock) {
              //商品库存不足
              flag = '商品库存不足';
              break;
            }
          }
        }
      }
      if (flag.length > 0) {
        Toast.success('您所选的商品中存在' + flag, 2);
      } else {
        this.context.router.history.push('/admin/shopPage/accountOrderPage/id=' + Id + '/fareValue=' + false + '/payType=1/addType=1');
      }
    } else {
      alert('您还没有选购任何商品', '', [
        {
          text: '取消', onPress: () => {
          }
        },
        {
          text: '确认', onPress: () => {
          }
        },
      ])
    }

  }

  render() {
    return (
      <div>
        <div className={'shopTitle'} style={{
          width: '100%',
          position: 'fixed',
          top: '0em',
        }}>
          <Flex justify='between'>
            <div>购物车共{this.state.dataSum}件宝贝</div>

            <Button size="small" className={this.state.btnTrue === true ? 'clearBtnTrue' : 'clearBtn'}
                    disabled={this.state.btnTrue}
                    onClick={() => (
                      alert('是否确认清空购物车', '', [
                        {
                          text: '取消', onPress: () => {
                          }
                        },
                        {
                          text: '确认', onPress: () => {
                            this.clearShop()
                          }
                        },
                      ])
                    )}
            >清空购物车
            </Button>
          </Flex>
        </div>
        <div className='shopListBody'>
          <ShopList proData={this.state.dataProduct} proArr={this.state.cartids}
                    test2CallBack={(data1, data2, idArr) => {
                      this.shopData(data1, data2, idArr);
                    }}
                    product2CallBack={(data) => {
                      this.productList(data);
                    }}
                    productTotalCallBack2={(data) => {
                      this.productTotal(data);
                    }}
          />
        </div>
        {/*合计部分*/}
        <div className={"shopTotal"} style={{
          display: this.state.accountBottom,
          width: '100%',
          position: 'fixed',
          bottom: '3.6em',
          flexDirection: 'row',
          justifyContent: 'space-between',
          background: 'white',
          pointerEvents: 'visiblepainted',
          zIndex: 9,
        }}>
          <Flex>
            <Checkbox className="my-radio" style={{margin: '-0.1em 0 0 0.5em',}}
                      onChange={(e) => {
                        this.onChangeChecked(e)
                      }} checked={this.state.proAllChecked}
            />
            <span style={{paddingLeft: '0.5em', lineHeight: '3em', fontSize: '0.8em'}}>全部</span>
          </Flex>
          <Flex justify='end'>
            <div className={'shopTotal'} style={{color: '#D81E06', fontSize: '1em', lineHeight: '3em'}}>合计：<span
              style={{fontSize: '1.2em', fontWeight: 'bold'}}>￥{this.state.dataTotal}</span></div>
            <div className={'shopButton'} style={{height: '3em', marginLeft: '0.5em'}} onClick={this.myaccountOrder}>
              结算({this.state.accountNum})
            </div>
          </Flex>

        </div>
        <div style={{textAlign: 'center', display: this.state.empty}}>
          <div className='shopListClass' key='1'>
            <img style={{width: '18%'}} src={require('../../image/icon/shopCar.png')} alt="没有数据"/>
            <p style={{fontSize: '0.8em'}}>购物车空空如也，快去选购吧</p>
            <Flex justify={'center'}>
              <Button onClick={this.homePage} style={{width: '30%', background: '#d81e06'}} type={"warning"}
                      size={"small"}>去挑选</Button>
            </Flex>
          </div>
        </div>
      </div>
    )
  }
}