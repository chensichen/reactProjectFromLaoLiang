import React from 'react';
import {TabBar, Modal, Tag, Flex, Toast, Button, InputItem} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './shopTabBar.css';
import PropTypes from "prop-types";
import emitter from "../../components/base/ev";
import client from "../../frame/client";

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export default class shopTabBar extends React.Component {
  constructor(props) {
    document.title = '商品详情'
    super(props);
    this.state = {
      selectedTab: sessionStorage.getItem('TabMenu'),
      msg: 0,
      tagData: [],  //所有商品标签
      tagAction: '',
      tagImg: '',
      tagName: '',
      tagPrice: '', //商品价钱
      gid: '',
      shopNum: 1,  //改变商品选中数量
      maxNum: 0,   //当前商品最大库存
      shopStatus: 'none',    //判断商品是否可以购买
      btnTrue: true,//判断确认按钮是否可点击
      shopModalBtn: 'shopModalBtn',
    };
    this.mounted = true;
  }

  // 当前页面路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentWillMount() {
    //获取购物车数量
    client.post('api/cart/getlist.html', {}).then(response => {
      if(this.mounted){
        this.setState({
            msg: response.total
        })
      }
    }).catch(error => {
    });
  }

  componentDidMount() {
    // 声明一个自定义事件
    // 在组件装载完成以后
    this.eventEmitter = emitter.addListener("callMe", (msg) => {
      this.setState({
        msg
      })
    });
  }

  renderContent() {
    return (
      <div style={{backgroundColor: '#999999', textAlign: 'center', position: 'relative',}}>

      </div>
    );
  }

  //加入购物车弹窗
  showModal = key => (e) => {
    let selectId = '';
    let maxNum = 0;
    if (this.props.data['stock']) {
      //判断当前商品库存是否大于0
      if (this.props.data['stock'] > 0) {
        //判断当前商品是否有sku信息
        if (this.props.data['sku']) {
          let ifStock = this.props.data['sku'];
          for (let i = 0; i < ifStock.length; i++) {
            if (ifStock[i].stock > 0) {
              //设置默认显示的商品型号和商品最大库存
              selectId = ifStock[i].id;
              maxNum = ifStock[i].stock;
              // stock = ifStock[i].stock;
              break;
            }
          }
        }
      }
      //设置当前型号库存是否大于0
      for (let j = 0; j < this.props.data['sku'].length; j++) {
        if (this.props.data['sku'][j].stock > 0) {
          this.props.data['sku'][j].disabled = false;
          this.setState({
            btnTrue: false,
          })
        } else {
          this.props.data['sku'][j].disabled = true;
        }
      }

      this.setState({
        tagData: this.props.data['sku'],
        tagImg: this.props.data['img_main'][0],
        tagName: this.props.data['name'],
        tagPrice: this.props.data['price'],
        gid: this.props.data['id'],
        tagAction: selectId,
        maxNum: maxNum,
      });
    }
    //显示弹窗
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  //关闭弹窗
  onClose = key => () => {
    this.setState({
      [key]: false,
      shopNum: 1,
    });
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  // 获取父组件传值
  componentWillReceiveProps(nextProps) {
    //判断父组件传的库存数量是否大于0，如果大于0商品可以购物，如果小于0商品则不可以购物
    if (nextProps.dataStatus.length > 0) {
      this.setState({
        shopStatus: 'flex',
      })
    }
  }

  //切换商品
  tagsChange = (selected, id, stock) => {
    let tagAction;
    //如果当前商品库存小于上一次选中的商品库存，则将当前商品显示数量商品为最大库存量
    let stockNum;
    if (selected === false) {
      tagAction = 0;
    } else {
      tagAction = id;
    }
    if (this.state.shopNum > stock) {
      stockNum = stock;
    } else {
      stockNum = this.state.shopNum;
    }
    this.setState({
      tagAction: tagAction,
      maxNum: stock,
      shopNum: stockNum,
    })
  }
  //修改商品数量
  onChangeStepper = (val, stock) => {

    if (val.length > 1 && val.substr(0, 1) === '0') {
      this.setState({
        shopNum: val.substr(1, val.length),
      })
    } else {
      if (val > stock) {
        Toast.success('已超过最大库存', 2);
        this.setState({
          shopNum: this.state.shopNum
        })
      } else {
        this.setState({
          shopNum: val,
        })
      }
    }

  }
  //步进器触发事件,修改商品数量
  onStepper = (val, stock, type) => {
    //定义当前修改商品数量
    let productVal = this.state.shopNum;
    if (type === 1) {
      //增加商品数量
      productVal = parseInt(productVal) - parseInt(1);
    } else if (type === 2) {
      //减少商品数量
      productVal = parseInt(productVal) + parseInt(1);
    } else {
      //input框直接修改商品数量
      if (!val) {
        productVal = 1;
      } else {
        productVal = val;
      }
    }
    if (productVal > stock) {
      this.setState({
        shopNum: this.state.shopNum,
      })
      Toast.success('已超过最大库存', 2);
    } else if (productVal <= 0) {
      this.setState({
        shopNum: 1,
      })
    } else {
      this.setState({
        shopNum: productVal,
      })
    }
  }
  //确定加入购物车
  onPressSave = (is_deleted, status, stock, can_buy) => {
    //判断当前是否选中商品
    if (this.state.tagAction === 0) {
      Toast.success("请选择商品规格", 2);
    } else {
      if (is_deleted === 1 || status === 2) {
        Toast.success('已下架', 2);
      } else if (stock === 0) {
        Toast.success('已售罄', 2);
      } else if (can_buy === 0) {
        Toast.success('无购买权限', 2);
      } else if (this.state.shopNum > this.state.maxNum) {
        Toast.success('无购买权限', 2);
      } else {
        client.post('api/cart/add.html', {
          "gid": this.state.gid,
          "sku": this.state.tagAction,
          "num": this.state.shopNum,
        }).then(response => {
          Toast.success('加入购物车成功', 1);
          client.post('api/cart/getlist.html', {})
            .then(response => {
              if(this.mounted){
                this.setState({
                    msg: response.total,
                    shopNum: 1,
                })
              }

              this.onClose('modal1')()
              return (emitter.emit("callMe", response.total))
            })
            .catch(error => {
            });
        }).catch(error => {
          Toast.success(error.message, 2);
        });
      }
    }

  }
  componentWillUnmount() {
      this.mounted = false;
  }
  render() {
    return (
      <div className='shopTabBar'>
        <div style={{
          width: '100%',
          color: '#fea800',
          position: 'fixed',
          bottom: '3.5em',
          zIndex: 99,
          background: '#fbf9e6',
          textAlign: 'center',
          height: '3em',
          alignItems: 'center',
          justifyContent: 'center',
          display: this.props.dataStatus ? 'flex' : 'none'
        }}>
          {this.props.dataStatus}
        </div>
        <div style={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: '9'
        }}>
          <div style={{flexBasis: '70%'}}>
            <TabBar
              unselectedTintColor="#4c4c4c"
              tintColor="#D81E06"
              barTintColor="white"
              tabBarPosition="bottom"
              hidden={this.state.hidden}
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
                selected={this.state.selectedTab === 'blueTab'}
                onPress={() => {
                  sessionStorage.setItem('TabMenu', 'blueTab')
                  this.context.router.history.push('/admin/homePage/home');
                  this.setState({
                    selectedTab: 'blueTab',
                  });
                }}
                data-seed="logId"
              >
                {this.renderContent('Life')}
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
                    background: 'url(/image/tabBar/brandR.svg) center center /  22px 20px no-repeat'
                  }}
                  />
                }
                title="品牌"
                key="Koubei"
                // badge={'new'}
                selected={this.state.selectedTab === 'redTab'}
                onPress={() => {
                  sessionStorage.setItem('TabMenu', 'redTab')
                  this.context.router.history.push('/admin/brandPage');
                  this.setState({
                    selectedTab: 'redTab',
                  });
                }}
                data-seed="logId1"
              >
                {this.renderContent('Koubei')}
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
                selected={this.state.selectedTab === 'greenTab'}
                onPress={() => {
                  sessionStorage.setItem('TabMenu', 'greenTab')
                  this.context.router.history.push('/admin/shopPage/shop');
                  this.setState({
                    selectedTab: 'greenTab',
                  });
                }}
                data-seed="shopper"
              >
                {this.renderContent('Friend')}
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
                selected={this.state.selectedTab === 'yellowTab'}
                onPress={() => {
                  sessionStorage.setItem('TabMenu', 'yellowTab')
                  this.context.router.history.push('/admin/minePage/mine');
                  this.setState({
                    selectedTab: 'yellowTab',
                  });
                }}
              >
                {this.renderContent('My')}
              </TabBar.Item>
            </TabBar>
          </div>
          <div className={'shopButton'} style={{background: '#bfbfbf', display: this.state.shopStatus}}>
            加入购物车
          </div>
          <div className={'shopButton'} onClick={this.showModal('modal1')}
               style={{display: this.state.shopStatus === 'flex' ? 'none' : 'flex'}}>
            加入购物车
          </div>

          <Modal
            className='shopModal'
            popup
            visible={this.state.modal1}
            transparent
            animationType="slide-up"
            maskClosable={true}
            onClose={this.onClose('modal1')}
            wrapProps={{onTouchStart: this.onWrapTouchStart}}
            style={{zIndex: '99999'}}
          >
            <div className="tag-container">
              <div style={{position: 'absolute', right: '7px', top: '-3px', fontSize: '1.5em'}}
                   onClick={this.onClose('modal1')}>
                ×
              </div>

              <Flex justify='between'>
                <img src={this.state.tagImg} style={{width: '4em', height: '4em'}} alt='1'/>
                <div style={{width: '80%', height: '4em'}}>
                  {/*<p className='shopTabBarTitle'>{this.state.tagName}</p>*/}
                  <span className='shopTabBarTitle'>￥{this.state.tagPrice}</span>
                  <p style={{fontSize: '0.8em', color: '#D81E06'}}>仅剩{this.state.maxNum}件</p>
                </div>
              </Flex>
              <Flex wrap="wrap" style={{marginTop: '1em'}}>
                {this.state.tagData.map((expert, i) => (

                  <Tag key={i} onChange={(selected, id, stock) => {
                    this.tagsChange(selected, expert.id, expert.stock)
                  }} selected={this.state.tagAction === expert.id}
                       disabled={expert.disabled}>
                    {expert.name}
                  </Tag>
                ))}
              </Flex>
              <Flex justify='between'>
                <span style={{fontSize: '0.8em', color: '#000000'}}>数量</span>
                <div>
                  <div className={"am-stepper showNumber"}
                       style={{width: '100%', minWidth: '90px', marginRight: '0.5em',}}>
                    <div className={"am-stepper-handler-wrap"} style={{display: 'flex'}}>
                      <Button className={"am-stepper-handler am-stepper-handler-up "} style={{padding: '0px 8px'}}
                              disabled={this.state.stepperDisabled}
                              onClick={(value, stock, type) => this.onStepper(value, this.state.maxNum, 1)}>
                        -</Button>
                      <div className={"am-stepper-input-wrap stepperInput"}>
                        <InputItem
                          type={'number'}
                          moneyKeyboardAlign={'center'}
                          className={"am-stepper-input"}
                          style={{zIndex: '1', textAlign: 'center', fontSize: '1em !important'}}
                          disabled={this.state.stepperDisabled}
                          value={this.state.shopNum}
                          onBlur={(value, stock, type) => this.onStepper(value, this.state.maxNum, 3)}
                          onChange={(value, stock) => this.onChangeStepper(value, this.state.maxNum)}
                        />
                      </div>
                      <Button className={"am-stepper-handler am-stepper-handler-down"} style={{padding: '0px 8px'}}
                              disabled={this.state.stepperDisabled}
                              onClick={(value, stock, type) => this.onStepper(value, this.state.maxNum, 2)}
                      >+</Button>
                    </div>
                  </div>
                </div>
              </Flex>
            </div>
            <Button disabled={this.state.btnTrue} type={"warning"} className={this.state.shopModalBtn}
                    onClick={this.onPressSave.bind(this, this.props.is_deleted, this.props.status, this.props.stock, this.props.can_buy)}>确定</Button>
          </Modal>
        </div>
      </div>
    )
  }
}