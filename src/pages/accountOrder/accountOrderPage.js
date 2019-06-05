import React from 'react';
import {Flex, Modal, Tag, TextareaItem, Toast, Switch} from 'antd-mobile';
import emitter from "../../components/base/ev"
import 'antd-mobile/dist/antd-mobile.css';
import './accountOrderPage.css';
import AccountOrderList from '../../components/base/accountOrderList';
import PropTypes from "prop-types";
import client from "../../frame/client";

const alert = Modal.alert;
let productAll = [];
let productOne = [];
let addressDefaultTel = ''; //  默认电话
let addressDefaultName = '';//默认姓名
let addressDefaultadd = '';//默认地址
let addressId = '';//默认地址id

export default class accountOrderPage extends React.Component {
  constructor(props) {
    document.title = '订单结算';
    super(props);
    productAll = [];
    productOne = [];
    addressDefaultTel = ''; //  默认电话
    addressDefaultName = '';//默认姓名
    addressDefaultadd = '';//默认地址
    addressId = '';//默认地址id
    //当前地址url
    this.url = window.location.href;
    // 判断选没选中订单险
    this.fareValue = this.url.split("fareValue=")[1].split("/payType=")[0];
    if (this.fareValue === 'true') {
      this.fareValue = true;
    } else {
      this.fareValue = false;
    }
    //支付方式和发货信息
    if (this.url.split("/payType=")[1].split("/addType=")[0]) {
      this.tagActionType = parseInt(this.url.split("/payType=")[1].split("/addType=")[0]);
    } else {
      this.tagActionType = 1;  //1是微信支付，2是线下支付
    }
    if (this.url.split("/addType=")[1]) {
      this.tagAddActionType = parseInt(this.url.split("/addType=")[1]);
    } else {
      this.tagAddActionType = 1;  //1是小包裹，2是小包裹代发货
    }
    this.state = ({
      dataAll: [],    //提交订单时返回给后台的所有数据
      modal2: false,
      addStatus: 'hidden',
      openProductType: '展开全部订单',
      tagAction: this.tagActionType === 1 ? '微信支付' : '线下支付',
      tagAddAction: this.tagAddActionType === 1 ? '小包裹' : '小包裹代发货',
      addressDefaultTel: '',
      addressDefaultName: '',
      addressDefaultadd: '',
      addressPeople: '收',
      productList: [],    //包裹列表
      haveOpenbutton: 'none',
      fareValue: this.fareValue,  //是否选中运费险
      addressId: '',  //选中地址Id值
      weight_order: '',    //订单总重量
      amount_goods: 0, //商品金额
      amount_tax: 0,  //税费金额
      amount_freight: 0, //运费
      amount_order: 0,    //总金额
      tagAddActionType: this.tagAddActionType, //包裹状态 10是小包裹，2是小包裹代发货
      tagActionType: this.tagActionType, //支付方式 1是微信支付，2是线下支付
      flag: 0,   //防止重复提交
    });
    this.mounted = true;
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  // 跳转到支付页面
  orderPay = (item) => {
    this.context.router.history.push({pathname: '/admin/minePage/orderPay', state: {order: item}});
  }

  componentWillMount() {
    //根据从地址列表页和购物车页跳转获取cartids值
    let productId = this.url.split("id=")[1].split("/fareValue=")[0];
    if (productId) {
      // productId = productId;
    } else {
      productId = localStorage.getItem("cartids")
    }
    //获取订单险
    client.post('api/common/getconfig.html', {
      "keys": "amount_insurance",
    }).then(response => {
      this.setState({
        amount_insurance: response.amount_insurance,
      });
      //获取所有商品
      client.post('api/order/package.html', {
        "send_type": 1,
        "cartids": productId,
      }).then(response => {
        let productList = [];
        productList[0] = response.goods[0];
        productAll = response.goods;
        productOne = productList;
        //判断一共有多少条订单，订单数据为1时不显示收缩/展开效果
        if (productAll.length > 1) {
          if(this.mounted){
            this.setState({
                haveOpenbutton: 'flex',
            })
          }
        }
        let amount_order = 0;
        if (this.state.fareValue) {
          amount_order = parseFloat(response.amount_order) + parseFloat(this.state.amount_insurance);
        } else {
          amount_order = response.amount_order
        }
        if(this.mounted){
          this.setState({
              dataAll: response,
              productList: productList,
              productNum: response.total,
              productListAll: response.goods, //全部商品
              weight_order: response.weight_order,    //订单总重量
              amount_goods: response.amount_goods, //商品金额
              amount_tax: response.amount_tax,  //税费金额
              amount_freight: response.amount_freight, //运费
              amount_order: amount_order,    //总金额
          })
        }
      }).catch(error => {
        Toast.success(error.message, 2);
        // 跳转到订单页待付款
        setTimeout(() => {
          this.context.router.history.push('/admin/shopPage/shop');
        }, 2000);
      });
    }).catch(error => {
      Toast.success(error.message, 2);
    });

    //获取收货地址信息
    client.post('api/address/getlist.html', {}).then(response => {
      let data = response.list;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 2) {
            addressDefaultTel = data[i].phone; //  默认电话
            addressDefaultName = data[i].name;//默认姓名
            addressDefaultadd = data[i].address;//默认地址
            addressId = data[i].id;//默认地址id
            if(this.mounted){
              this.setState({
                  addressDefaultTel: data[i].phone,
                  addressDefaultName: data[i].name,
                  addressDefaultadd: data[i].address,
                  addressId: data[i].id,
              })
            }
          }
        }
      }
      //当地址栏没有id值时，获取session里的地址信息
      let productId = this.url.split("id=")[1].split("/fareValue=")[0];
      if (productId) {
      } else {
        productId = '';
      }
      if (!productId) {
        if (sessionStorage.getItem("nameItem")) {
          addressDefaultTel = sessionStorage.getItem("phoneItem");
          addressDefaultName = sessionStorage.getItem("nameItem");
          addressDefaultadd = sessionStorage.getItem("addressItem");
          addressId = sessionStorage.getItem("addressIdItem");
          if(this.mounted){
            this.setState({
                addressDefaultTel: sessionStorage.getItem("phoneItem"),
                addressDefaultName: sessionStorage.getItem("nameItem"),
                addressDefaultadd: sessionStorage.getItem("addressItem"),
                addressId: sessionStorage.getItem("addressIdItem"),
            })
          }
        }
      }
      this.setState({})
    }).catch(error => {
    });

    //广告图片
    client.post('api/common/ads.html', {
      "page": 3,//当前页面值
    }).then(response => {
      if(this.mounted){
        this.setState({
            adsImg: response[0].url_img,
            adsTarget: response[0].url_target,
        })
      }
    }).catch(error => {
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    //清空session地址信息
    sessionStorage.setItem("phoneItem", '');
    sessionStorage.setItem("nameItem", '');
    sessionStorage.setItem("addressItem", '');
    sessionStorage.setItem("addressIdItem", '');
  }

  //弹窗
  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
      tagActionType: this.tagActionType,
      tagAddActionType: this.tagAddActionType
    });
  }

  //支付方式选项
  tagsChange = (selected, name) => {
    if (name === 2 && !selected) {
      this.setState({
        tagActionType: 1
      })
    } else if (name === 1 && !selected) {
      this.setState({
        tagActionType: 2
      })
    } else {
      this.setState({
        tagActionType: name
      })
    }
  }

  //配送方式选项
  tagsAddChange = (selected, name) => {
    if (name === '小包裹' && !selected) {
      this.setState({
        tagAddActionType: 2,
        addStatus: 'visible',
      })
    } else if (name === '小包裹代发货' && !selected) {
      this.setState({
        tagAddActionType: 1,
        addStatus: 'hidden',
      })
    } else if (name === '小包裹代发货' && selected) {
      this.setState({
        tagAddActionType: 2,
        addStatus: 'visible',
      })
    } else {
      this.setState({
        tagAddActionType: 1,
        addStatus: 'hidden',
      })
    }
  }
  //跳转到地址页
  myAddressEdit = () => {
    //判断是小包裹还是代发货
    if (this.state.addressPeople === '收') {
      //判断有没有默认收货人,从提交订单页跳转时type=1
      this.context.router.history.push('/admin/shopPage/addressSelectPage/type=1/fareValue=' + this.state.fareValue + '/payType=' + this.tagActionType + '/addType=' + this.tagAddActionType);
    }
  }
  //展开/收缩全部商品按钮
  openProductAll = (open) => {
    if (open === '展开全部订单') {
      this.setState({
        openProductType: '收回全部订单',
        productList: productAll,
      })
    } else {
      this.setState({
        openProductType: '展开全部订单',
        productList: productOne,
      })
    }
  }
  //保存付款和发货方式信息
  modelAddressSave = () => {
    let payType;
    //小包裹代发货
    if (this.state.tagAddActionType === 2) {
      if (this.state.addressValue) {
        this.tagActionType = this.state.tagActionType;
        this.tagAddActionType = this.state.tagAddActionType;
        if (this.state.tagActionType === 1) {
          payType = "微信支付";
        } else {
          payType = "线下支付";
        }
        let str = this.state.addressValue;
        if (str.split(',').length === 3) {
          let strSplit = str.split(',');
          this.setState({
            addressDefaultTel: strSplit[1],
            addressDefaultName: strSplit[0],
            addressDefaultadd: strSplit[2],
            addressPeople: '代',
            tagAddAction: '小包裹代发货',
            tagAction: payType,
          })
          this.onClose('modal2')();
        } else {
          Toast.success('请按照正确格式填写收货信息', 2);
        }
      } else {
        Toast.success('地址必须填写', 2);
      }
    } else {
      this.tagActionType = this.state.tagActionType;
      this.tagAddActionType = this.state.tagAddActionType;
      if (this.state.tagActionType === 1) {
        payType = "微信支付";
      } else {
        payType = "线下支付";
      }
      //小包裹
      if (addressDefaultTel || addressDefaultName || addressDefaultadd || addressId) {
        this.setState({
          addressDefaultTel: addressDefaultTel,
          addressDefaultName: addressDefaultName,
          addressDefaultadd: addressDefaultadd,
          addressId: addressId,
          addressPeople: '收',
          tagAddAction: '小包裹',
          tagAction: payType,
        })
      } else {
        this.setState({
          addressDefaultTel: '',
          addressDefaultName: '',
          addressDefaultadd: '',
          addressId: '',
          addressPeople: '收',
          tagAddAction: '小包裹',
          tagAction: payType,
        })
      }
      this.onClose('modal2')();
    }
  }
  //选择小包裹代发货方式时返回的收货人信息
  valueChange = (value) => {
    let toValue = this.ToCDB(value);
    this.setState({
      addressValue: toValue,
    })
  }
  //全角转半角方法
  ToCDB = (str) => {
    let tmp = "";
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) === 12288) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
        continue;
      }
      if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
      }
      else {
        tmp += String.fromCharCode(str.charCodeAt(i));
      }
    }
    return tmp
  }
  //提交订单
  submit = () => {
    alert('是否提交订单', '', [
      {
        text: '取消', onPress: () => {
        }
      },
      {
        text: '确认', onPress: () => {
          if (this.state.flag === 0) {
            let insurance = '';
            //订单险
            if (this.state.fareValue) {
              insurance = this.state.amount_insurance;
            }
            if (this.state.addressDefaultTel || this.state.addressDefaultName || this.state.addressDefaultadd) {
              client.post('api/order/create.html', {
                "pay_type": this.tagActionType,
                "send_type": this.tagAddActionType,
                "packages": JSON.stringify(this.state.dataAll),
                "address_id": this.state.addressId,
                "address_name": this.state.addressDefaultName,
                "address_phone": this.state.addressDefaultTel,
                "address": this.state.addressDefaultadd,
                "insurance": insurance,
              }).then(response => {
                client.post('api/cart/getlist.html', {}).then(response => {
                  return (emitter.emit("callMe", response.total));
                }).catch(error => {
                });
                if(this.mounted){
                  this.setState({
                      flag: 1,
                  })
                }
                //如果是线下支付则跳转到成功页面
                //重新获取购物车数量
                if (this.tagActionType === 2) {
                  this.context.router.history.push('/admin/shopPage/ShopPaySuccess/');
                } else if (this.tagActionType === 1) {
                  this.orderPay(response.id);
                  //如果是微信支付则调用微信支付接口
                }
              }).catch(error => {
                Toast.success(error.message, 2);
              });
            } else {
              Toast.success('请填写收货信息', 2);
            }
          } else {
            Toast.success('不可重复提交订单', 2);
          }
        }
      },
    ])

  }
  //是否选中运费险
  onClickFare = (value) => {
    if (!this.state.fareValue) {
      let amount_order = parseFloat(parseFloat(this.state.amount_order) + parseFloat(this.state.amount_insurance));
      this.setState({
        amount_order: amount_order.toFixed(2),
      })
    } else {
      let amount_order = parseFloat(parseFloat(this.state.amount_order) - parseFloat(this.state.amount_insurance));
      this.setState({
        amount_order: amount_order.toFixed(2),
      })
    }
    this.setState({
      fareValue: !this.state.fareValue,
    });
  };

  render() {
    return (
      <div style={{background: '#f5f5f9'}}>
        <Flex className={'accountWidth'} onClick={() => {
          this.myAddressEdit()
        }}>
          <div className={'accountAddLeft'}>
            <Flex style={{lineHeader: '1.5em'}}>
              <span style={{
                backgroundColor: '#ffffff',
                color: '#d81e06',
                padding: '0.2em',
                marginRight: '0.5em',
                borderRadius: '0.2em',
                fontSize: '0.8em',
                border: '1px solid #d81e06',
              }}>{this.state.addressPeople}</span>
              <span className='accountAddLeftName'>{this.state.addressDefaultName}</span><span
              className='accountAddLeftName'>{this.state.addressDefaultTel}</span>
            </Flex>
            <Flex>
              <img className='accountOrderIcon' src={require('../../image/accountOrder/location.png')} alt='1'/>
              <span style={{fontSize: '1em'}}>{this.state.addressDefaultadd}</span>
            </Flex>
          </div>
          <div>
            <img src={require('../../image/accountOrder/sel.png')} alt='1'/>
          </div>
        </Flex>
        <div className={'accountOrderLine'}/>
        {/*支付方式选择*/}
        <Flex justify='between' style={{position: 'relative'}} className={'accountWidth'}
              onClick={this.showModal('modal2')}>
          <Flex>
            <div style={{marginRight: '1em'}}>支付-发货方式</div>
            <div>{this.state.tagAction}-{this.state.tagAddAction}</div>
          </Flex>
          <img style={{position: 'absolute', top: '0.6em', right: '0.5em', width: '1em', marginLeft: '0.6em'}}
               src={require('../../image/accountOrder/wechat.png')} alt='1'/>
        </Flex>
        <Flex className={'accountWidth'}>
          <img style={{width: '1em'}} src={require('../../image/accountOrder/warn.png')} alt='1'/>
          <span style={{margin: '0 0 0 0.5em'}}>即将拆分成<span style={{color: '#d81e06'}}>{this.state.productNum}</span>个包裹</span>
        </Flex>
        {/*订单列表*/}
        <AccountOrderList productList={this.state.productList}/>
        {/*展开/收缩订单效果*/}
        <div className='unfoldOrder'
             style={{display: this.state.haveOpenbutton, justifyContent: 'center', color: '#D81E06'}}
             onClick={(open) => {
               this.openProductAll(this.state.openProductType)
             }}>
          <img src={require('../../image/accountOrder/all.png')}
               style={{width: '0.8em', height: '0.55em', padding: '0.3em'}} alt='1'/>
          {this.state.openProductType}
        </div>
        <a href={this.state.adsTarget}>
          <img src={this.state.adsImg} style={{width: '100%', height: '11.6em', marginTop: '0.5em'}} alt='1'/>
        </a>
        <div className="accountWidth" style={{marginBottom: "7em"}}>
          <Flex style={{
            justifyContent: 'space-between',
            borderBottom: '1px dotted #d4cdcd',
            height: '2em',
            lineHeight: '2em'
          }}>
            <div>订单险</div>
            <div className='orderRisks'><span style={{color: '#D81E06'}}>￥{this.state.amount_insurance}</span>
              <Switch style={{margin: '0 0 0 0.5em'}} onClick={(e) => {
                this.onClickFare(e)
              }} color="red" checked={this.state.fareValue}/>
            </div>
          </Flex>
          <Flex style={{
            justifyContent: 'space-between',
            borderBottom: '1px dotted #d4cdcd',
            height: '2em',
            lineHeight: '2em'
          }}>
            <div>商品金额</div>
            <div style={{color: '#D81E06'}}>￥{this.state.amount_goods}</div>
          </Flex>
          <Flex style={{
            justifyContent: 'space-between',
            borderBottom: '1px dotted #d4cdcd',
            height: '2em',
            lineHeight: '2em'
          }}>
            <div>税费金额</div>
            <div style={{color: '#D81E06'}}>￥{this.state.amount_tax}</div>
          </Flex>
          <Flex style={{
            justifyContent: 'space-between',
            borderBottom: '1px dotted #d4cdcd',
            height: '2em',
            lineHeight: '2em'
          }}>
            <div>运费金额<span style={{color: '#999999'}}>（共{this.state.weight_order}kg）</span></div>
            <div style={{color: '#D81E06'}}>￥{this.state.amount_freight}

            </div>
          </Flex>
        </div>
        <div className={"shopTotal"} style={{
          width: '100%',
          position: 'fixed',
          bottom: '3.6em',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: '9',
          backgroundColor: 'white'
        }}>
          <div className={'shopTotal'} style={{
            color: '#D81E06',
            lineHeight: '2.5em',
            fontSize: '1.2em',
            paddingLeft: '0.5em',
            fontWeight: 'bold'
          }}>￥{this.state.amount_order}</div>
          <div className={'shopButton'} style={{height: '3em'}} onClick={() => {
            this.submit()
          }}>
            提交订单
          </div>
        </div>
        {/*//弹出窗口*/}
        <Modal
          className='clearingForm'
          popup
          visible={this.state.modal2}
          transparent
          animationType="slide-up"
          maskClosable={false}
          onClose={this.onClose('modal2')}
          title="支付-发货方式"
          footer={[{
            text: '确定', onPress: () => {
              this.modelAddressSave()
            }
          }]}
        >
          <div className="tag-container">
            <div style={{position: 'absolute', right: '7px', top: '3px', fontSize: '1.5em'}}
                 onClick={this.onClose('modal2')}>
              ×
            </div>
            <Flex>
              <p>
                支付方式：
              </p>
              <Tag onChange={(selected) => {
                this.tagsChange(selected, 1)
              }} selected={this.state.tagActionType === 1} style={{margin: '0 0.3em'}}>
                微信支付
              </Tag>
              <Tag onChange={(selected) => {
                this.tagsChange(selected, 2)
              }} selected={this.state.tagActionType === 2} style={{margin: '0 0.3em'}}>
                线下支付
              </Tag>
            </Flex>

            <Flex>
              <p>
                发货方式：
              </p>
              <Tag onChange={(selected) => {
                this.tagsAddChange(selected, '小包裹')
              }} selected={this.state.tagAddActionType === 1} style={{margin: '0 0.3em'}}>
                小包裹
              </Tag>
              <Tag onChange={(selected) => {
                this.tagsAddChange(selected, '小包裹代发货')
              }} selected={this.state.tagAddActionType === 2} style={{margin: '0 0.3em'}}>
                小包裹代发货
              </Tag>
            </Flex>
            <div style={{visibility: this.state.addStatus, width: '100%'}}>
              <Flex>
                <span style={{marginTop: '-2.8em', color: '#000000'}}>收货地址：</span>
                <TextareaItem
                  style={{color: '#888888'}}
                  rows={3}
                  placeholder="如：张三,18612345678,辽宁省大连市高新园区533号"
                  data-seed="logId"
                  value={this.state.addressValue}
                  onChange={(e) => {
                    this.valueChange(e)
                  }}
                />
              </Flex>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}