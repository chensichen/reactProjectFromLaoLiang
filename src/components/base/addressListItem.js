import React from 'react';
import {Flex, Radio, Toast, Modal} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import PropTypes from "prop-types";
import client from "../../frame/client";
import './base.css'

const alert = Modal.alert;
export default class addressListItem extends React.Component {
  constructor(props) {
    super(props);
    this.url = window.location.href;
    this.type = this.url.split("type=")[1].split("/fareValue=")[0];
    this.fareValue = this.url.split("/fareValue=")[1].split("/payType=")[0];
    this.payType = '';
    this.addType = '';
    this.state = {
      proChecked: this.props.val.type,
      val: [],
      value: 0,
      type: this.type,  //判断是由哪个页面跳过来的，如果是1就是订单提交页跳进来的，如果是2就是我的页跳进来的
      fareValue: this.fareValue, //判断是否有默认订单险
    };
    this.mounted = true;
  }

  //修改地址选中状态
  addressDefault = (e, aid) => {
    if (e.target.checked) {
      client.post('api/address/setdefault.html', {
        'aid': aid,
      }).then(response => {
        client.post('api/address/getlist.html', {}).then(response => {
          for (let i = 0; i < response.list.length; i++) {
            if (response.list[i].type === 1) {
              response.list[i].checked = false;
            } else {
              response.list[i].checked = true;
            }
          }
          if(this.mounted){
            this.setState({
                addressList: response.list,
            })
          }
          this.props.dataCallBack(response.list);
        }).catch(error => {
        });
      }).catch(error => {
      });
    }
  }
  // 当前页面路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  //修改收货地址
  addressEdit = (id) => {
    this.context.router.history.push('/admin/shopPage/addressEditPage/' + id + '/type=' + this.state.type);
  }
  //删除当前收货地址
  addressDel = (aid) => {
    window.scrollTo(0, 0);
    alert('是否删除该收货地址', '', [
      {
        text: '取消', onPress: () => {
        }
      },
      {
        text: '确认', onPress: () => {
          client.post('api/address/del.html', {
            "aid": aid,
          }).then(response => {
            Toast.success('删除收货地址成功', 2);
            client.post('api/address/getlist.html', {}).then(response => {
              for (let i = 0; i < response.list.length; i++) {
                if (response.list[i].type === 1) {
                  response.list[i].checked = false;
                } else {
                  response.list[i].checked = true;
                }
              }
              if(this.mounted){
                this.setState({
                    addressList: response.list,
                })
              }
              this.props.dataCallBack(response.list);
            }).catch(error => {
            });
          }).catch(error => {
            Toast.success('删除收货地址失败', 2);
          });
        }
      },
    ])


  }
  //选择收货地址
  selAddress = (id, name, phone, address) => {
      if(this.state.type === '1'){
          //跳到订单结算页
          sessionStorage.setItem("nameItem", name);
          sessionStorage.setItem("phoneItem", phone);
          sessionStorage.setItem("addressItem", address);
          sessionStorage.setItem("addressIdItem", id);
          //获取订单页传过来的支付和发货信息
          this.payType = this.url.split("/payType=")[1].split("/addType=")[0];
          this.addType = this.url.split("/addType=")[1];
          this.context.router.history.push('/admin/shopPage/accountOrderPage/id=/fareValue='+this.state.fareValue +'/payType='+this.payType + '/addType='+this.addType);
      }
  }
  componentWillUnmount(){
      this.mounted = false;
  }
  render() {
    return (
      <div className='addressShow' key={1}>
          <div
              onClick={(id, name, phone, address) => {this.selAddress(this.props.val.id, this.props.val.name, this.props.val.phone, this.props.val.address)}}
          >
          <Flex align="baseline">
            <span style={{paddingRight:'1em',fontWeight: 'bold',lineHeight: '1.8em'}}>{this.props.val.name}</span>
            <span style={{fontWeight: 'bold'}}>{this.props.val.phone}</span>
          </Flex>
          <Flex className='addressSelectName'>
            {this.props.val.address}
          </Flex>
        </div>
        <Flex style={{justifyContent: 'space-between',borderTop:'1px solid #ececec',paddingTop:'0.4em'}}>
          <div>
            <Radio className="my-radio" name='address' checked={this.props.val.checked} onChange={(e, id) => {
              this.addressDefault(e, this.props.val.id)
            }}><span style={{fontSize:'0.8em'}}>{this.props.val.checked ? '默认地址' : '设为默认'}</span></Radio>
          </div>
          <Flex wrap="wrap" style={{width:'8em'}}>
            <div style={{paddingRight: '0.2em', marginTop: '0.2em'}}>
              <img src={require('../../image/address/edit.png')} style={{height: '1.2em'}}
                   onClick={(aid) => {
                     this.addressEdit(this.props.val.id)
                   }} alt='编辑'/>
            </div>
            <div style={{paddingRight: '1.5em'}}><span style={{fontSize:'0.8em',lineHeight:'1.2em'}}>编辑</span></div>
            <div style={{paddingRight: '0.2em', marginTop: '0.2em'}}>
              <img src={require('../../image/address/delete.png')} style={{height: '1em'}}
                   onClick={(aid) => {
                     this.addressDel(this.props.val.id)
                   }} alt='删除'/>
            </div>
            <div><span style={{fontSize:'0.8em'}}>删除</span></div>
          </Flex>
        </Flex>
      </div>
    );
  }
}