import React from 'react';
import emitter from "./ev"
import {Checkbox, Modal, Button, Toast,Flex, InputItem} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './shopList.css';
import client from "../../frame/client";
import PropTypes from "prop-types";

const alert = Modal.alert;
let idArr = []; //当前已选中的商品id
export default class checkItem extends React.Component {
  constructor(props) {
    super(props);
    idArr = []; //当前已选中的商品id
    this.state = {
      proChecked: this.props.val.checked, //设置商品选中状态
      num: 0, //stepper记数器显示数量
      stock: 0,  //父组件传值库存数量
      stepperDisabled: false, //步进器是否可点击
    };
  }

  // 获取父组件传值
  componentWillReceiveProps(nextProps) {
    this.setState({
      proChecked: nextProps.val.checked,
      num: this.props.val.num,
    })
  }

  componentWillMount() {}

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到商品详情页
  onDetail = (id) => {
    this.context.router.history.push('/admin/homePage/productDetail/'+id);
  }

  //修改商品选中状态
  onCheckbox = (val, id) => {
    //取出父父组件传过来的所有商品信息
    let fatherData = this.props.valAll;
    //自定义商品数量和商品总价
    let accountNum = 0;
    let accountTotal = 0;
    //自定义要返回给父父组件的商品列表
    let dataAll = [];
    //自定义要返回给父父组件的已选中商品的id
    idArr = [];
    for (let i=0;i<fatherData.length;i++){
        if(fatherData[i]['id'] === id){
            fatherData[i]['checked'] = val.target.checked;
        }
        dataAll.push(fatherData[i]);
    }
      //获取所有商品列表
      for (let i = 0; i < dataAll.length; i++) {
          if(dataAll[i]['checked']){
              accountTotal = parseFloat(accountTotal + parseFloat(parseFloat(dataAll[i].price) * parseFloat(parseFloat(dataAll[i].num))))
              accountNum = accountNum + parseFloat(parseFloat(dataAll[i].num));
              idArr.push(dataAll[i].id)
          }
      }
      //商品数量，总价，和选中商品id传给父父组件
      this.props.testCallBack(accountNum, accountTotal.toFixed(2), idArr);
      //商品列表传给父父组件
      this.props.productCallBakc(dataAll);

      //设置当前商品的选中状态
      this.setState({
          proChecked: val.target.checked,
      })
      //给父组件返回购物车数量、结算数量、价格
      this.props.testCallBack(accountNum, accountTotal.toFixed(2), idArr);
      //给父父组件返回当前商品列表
      this.props.productCallBakc(dataAll);
  }

  //删除商品
  onDel = (id, gid, skuid) => {
    alert('是否删除该商品', '', [
      {
        text: '取消', onPress: () => {
        }
      },
      {
        text: '确认', onPress: () => {
          client.post('api/cart/del.html', {
            'gid': gid,
            'sku': skuid
          }).then(response => {
            Toast.success('删除成功', 2);
              //获取父组件传过来的商品列表
              let fatherData = this.props.valAll;
              //自定义要返回给父父组件的商品列表
              let dataAll = [];
              //自定义要返回给父父组件的已选中商品的id
              idArr = [];
              //自定义商品数量和商品总价
              let accountNum = 0;
              let accountTotal = 0;
              for (let i = 0; i < fatherData.length; i++) {
                  //判断商品列表中不包括已经删除商品，对其进行计算
                  if (fatherData[i]['id'] !== id) {
                      if(fatherData[i]['checked']){
                          accountTotal = parseFloat(accountTotal + parseFloat(parseFloat(fatherData[i].price) * parseFloat(fatherData[i].num)))
                          accountNum = accountNum + parseFloat(fatherData[i].num);
                          idArr.push(fatherData[i]['id']);
                      }
                      dataAll.push(fatherData[i]);
                  }
              }
              //商品数量，总价，和选中商品id传给父父组件
              this.props.testCallBack(accountNum, accountTotal.toFixed(2), idArr);
              //商品列表传给父父组件
              this.props.productCallBakc(dataAll);
              //给父组件返回商品数量
              this.props.productTotalCallBack(dataAll.length);
              //将购物车数量返回给tabBar组件显示值
              return (emitter.emit("callMe", dataAll.length))
          }).catch(error => {
          })
        }
      }
    ])
  }
  //修改商品数量
  onChangeStepper = (val,stock) =>{
    if(val.length > 1 && val.substr(0, 1) === '0'){
      this.setState({
          num: val.substr(1, val.length),
      })
    }else{
        if(val > stock){
            Toast.success('已超过最大库存', 2);
            this.setState({
                num: this.state.num,
            })
        }else{
            this.setState({
                num: val,
            })
        }
    }

  }
  //步进器触发事件,修改商品数量
  onStepper = (val, id, gid, skuid, proChecked, price, num, stock,type) =>{
      //自定义商品数量和商品总价
      let accountNum = 0;
      let accountTotal = 0;
      //自定义父组件传过来的商品列表
      let fatherData = this.props.valAll;
      //自定义要返回给父父组件的商品列表
      let dataAll = [];
      //自定义要返回给父父组件的已选中商品的id
      idArr = [];
      //定义当前修改商品数量
      let productVal = this.state.num;
      if(type === 1){
          //增加商品数量
          productVal = parseInt(productVal) - parseInt(1);
      }else if(type === 2){
          //减少商品数量
          productVal = parseInt(productVal) + parseInt(1);
      }else{
          //input框直接修改商品数量
          if(!val){
              productVal = 1;
          }else{
            productVal = val;
          }
      }
      if (productVal > stock) {
          this.setState({
              num: this.state.num,
          })
          Toast.success('已超过最大库存', 2);
      }else if(productVal <= 0){
          //删除当前商品
          window.scrollTo(0, 0);
          alert('是否删除该商品', '', [
              {
                  text: '取消', onPress: () => {
                      //取消删除当前商品，当前商品数量自动变为1
                      for (let i = 0; i < fatherData.length; i++) {
                          if(fatherData[i]['checked']){
                              //判断当前商品数量自动变为1
                              if(fatherData[i]['id'] === id){
                                  fatherData[i]['num'] = 1;
                              }
                              accountTotal = parseFloat(accountTotal + parseFloat(parseFloat(fatherData[i].price) * parseFloat(parseFloat(fatherData[i].num))))
                              accountNum = accountNum + parseFloat(parseFloat(fatherData[i].num));
                              idArr.push(fatherData[i]['id']);
                          }
                          dataAll.push(fatherData[i]);
                      }
                      //商品数量，总价，和选中商品id传给父父组件
                      this.props.testCallBack(accountNum, accountTotal.toFixed(2), idArr);
                      //商品列表传给父父组件
                      this.props.productCallBakc(dataAll);
                  }

              },
              {
                  text: '确认', onPress: () => {
                      //修改商品数量
                      client.post('api/cart/modify.html', {
                          'gid': gid,
                          'sku': skuid,
                          'num': productVal,
                      }).then(response => {
                          Toast.success('删除成功', 2);
                          for (let i = 0; i < fatherData.length; i++) {
                              //判断商品列表中不包括已经删除商品，对其进行计算
                              if (fatherData[i]['id'] !== id) {
                                  if(fatherData[i]['checked']){
                                      accountTotal = parseFloat(accountTotal + parseFloat(parseFloat(fatherData[i].price) * parseFloat(fatherData[i].num)))
                                      accountNum = accountNum + parseFloat(fatherData[i].num);
                                      idArr.push(fatherData[i]['id']);
                                  }
                                  dataAll.push(fatherData[i]);
                              }
                          }
                          //商品数量，总价，和选中商品id传给父父组件
                          this.props.testCallBack(accountNum, accountTotal.toFixed(2), idArr);
                          //商品列表传给父父组件
                          this.props.productCallBakc(dataAll);
                          //给父组件返回商品数量
                          this.props.productTotalCallBack(dataAll.length);
                          //将购物车数量返回给tabBar组件显示值
                          return (emitter.emit("callMe", dataAll.length))
                      }).catch(error => {
                      })
                  }
              },
          ])

      }else{
          //调接口之前设置修改数量三个按钮不可编辑
          this.setState({
              stepperDisabled: true,
          })
          client.post('api/cart/modify.html', {
              'gid': gid,
              'sku': skuid,
              'num': productVal,
          }).then(response => {
              this.setState({
                  stepperDisabled: false,
                  // num: productVal,
              })
              for (let i = 0; i < fatherData.length; i++) {
                  //判断商品是否是选中状态，如果是选中状态则修改商品数量、总价和id数组
                  if(fatherData[i]['checked']){
                      if(fatherData[i]['id'] === id){
                          //判断当前修改商品数量变化
                          fatherData[i]['num'] = productVal;
                      }
                      accountTotal = parseFloat(accountTotal + parseFloat(parseFloat(fatherData[i].price) * parseFloat(fatherData[i].num)))
                      accountNum = accountNum + parseFloat(fatherData[i].num);
                      idArr.push(fatherData[i]['id']);
                  }else{
                      //判断当前修改商品数量变化
                      if(fatherData[i]['id'] === id){
                          fatherData[i]['num'] = productVal;
                      }
                  }
                  dataAll.push(fatherData[i]);
              }
              //商品数量，总价，和选中商品id传给父父组件
              this.props.testCallBack(accountNum, accountTotal.toFixed(2), idArr);
              //商品列表传给父父组件
              this.props.productCallBakc(dataAll);
          }).catch(error => {
              this.setState({
                  stepperDisabled: false,
              })
              Toast.success(error.message, 2);
          });

      }
  }

  render() {
    // idArr = this.props.proArr;
    return (
      <div className='checkItem' style={{
        paddingRight: '0.5em',
        boxSizing: 'border-box',
        borderBottom: '1px solid #e7e7e7',
        background: this.props.val.disabled === true ? "#f2f2f2" : "white"
      }}>
        <div style={{background: this.props.val.disabled === true ? "#f2f2f2" : "white"}}>
          <Flex justify='between'>
            <Flex>
              <Checkbox
                onChange={(e, id) => {
                  this.onCheckbox(e, this.props.val.id)
                }} checked={this.state.proChecked} disabled={this.props.val.disabled}
                style={{padding: '0 0.5em'}}
              >
              </Checkbox>
              <div style={{display: 'flex', padding: '1em 0 0.5em 0', justifyContent: 'space-between'}} onClick={() =>{this.onDetail(this.props.val.gid,)}}>
                <img style={{height: '6em', width: '6em',minWidth: '6em'}} src={this.props.val.url_show} alt=""/>
                <div style={{overflow: 'hidden', padding: '0 0.5em', fontSize: '1em'}}>
                  <div style={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    width: '100%',
                    height: '3.8em',
                    lineHeight: '1.3em',
                    marginBottom: '1em',
                  }}>
                    {this.props.val.skuname}
                  </div>
                  <span style={{
                    fontSize: '1.1em',
                    color: '#D81E06',
                    fontWeight: 'bold',
                    display: 'inlineBlock'
                  }}>￥{this.props.val.price}</span>
                </div>
              </div>
            </Flex>
            <div
              style={{alignSelf: 'center', display: this.props.val.delete === true ? 'block' : 'none'}}>
              <Button style={{
                height: '2.2em',
                lineHeight: '2.2em',
                padding: '0 2em',
                fontSize: '0.8em',
                border: '1px solid #d81e06',
                color: '#d81e06',
                marginTop: '-3.6em'
              }} onClick={(id, skuid) => {
                this.onDel(this.props.val.id, this.props.val.gid, this.props.val.skuid)
              }}>删除</Button>
            </div>
            <div
              style={{alignSelf: 'center', display: this.props.val.delete === true ? 'none' : 'block'}}>
                <div className={"am-stepper showNumber"} style={{width: '100%', minWidth: '90px', marginTop: '-4.5em', marginRight: '0.5em',}}>
                    <div className={"am-stepper-handler-wrap"} style={{display: 'flex'}}>
                        <Button className={"am-stepper-handler am-stepper-handler-up "} style={{ padding: '3px 6px'}}
                             disabled={this.state.stepperDisabled}
                              onClick={(val, id, gid, skuid, proChecked, price, num, stock,type) => this.onStepper(val, this.props.val.id, this.props.val.gid, this.props.val.skuid, this.state.proChecked, this.props.val.price, this.props.val.num, this.props.val.stock,1)}>
                            -</Button>

                        <div className={"am-stepper-input-wrap stepperInput"}>
                            <InputItem
                                type={'number'}
                                moneyKeyboardAlign={'center'}
                                className={"am-stepper-input"}
                                style={{zIndex: '1',textAlign: 'center',fontSize: '1em !important'}}
                                disabled={this.state.stepperDisabled}
                                value={this.state.num}
                                onBlur={(value, id, gid, skuid, proChecked, price, num, stock,type) => this.onStepper(value, this.props.val.id, this.props.val.gid, this.props.val.skuid, this.state.proChecked, this.props.val.price, this.props.val.num, this.props.val.stock,3)}
                                onChange={(value,stock) => this.onChangeStepper(value,this.props.val.stock)}
                            />
                        </div>

                        <Button className={"am-stepper-handler am-stepper-handler-down"} style={{ padding: '3px 6px'}}
                             disabled={this.state.stepperDisabled}
                              onClick={(val, id, gid, skuid, proChecked, price, num, stock,type) => this.onStepper(val, this.props.val.id, this.props.val.gid, this.props.val.skuid, this.state.proChecked, this.props.val.price, this.props.val.num, this.props.val.stock,2)}
                        >+</Button>
                    </div>
                </div>
            </div>
          </Flex>
        </div>
        <div style={{width: '100%', color: '#D81E06', textAlign: 'center', marginBottom: '0.5em', fontSize: '0.8em',}}>
          {this.props.val.stockType}
        </div>
      </div>
    );
  }
}