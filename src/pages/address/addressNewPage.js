import React from 'react';
import {Flex, Button, TextareaItem, Toast} from 'antd-mobile';
import client from "../../frame/client";
import 'antd-mobile/dist/antd-mobile.css';
import '../address/addressEditPage.css';
import PropTypes from "prop-types";
import '../../App.css'

export default class addressNewPage extends React.Component {
  constructor(props) {
    document.title = '地址管理'
    super(props);
    let url = window.location.href;
    let type = url.split("type=")[1];
    this.state = ({
      address: '',
      type: type, //判断是从哪个页跳转进来的列表页，1是订单结算页
    })
  }

  // 当前页面路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  //保存收货地址
  saveAddress = () => {
    //判断地址格式是否正确
    // let str = this.state.address;
    if (this.state.address.split(',').length === 3) {
      client.post('api/address/add.html', {
        "address": this.state.address,
      })
        .then(response => {
          this.context.router.history.push('/admin/shopPage/addressSelectPage/type=' + this.state.type + '/fareValue=/payType=1/addType=1');
        })
        .catch(error => {
          Toast.success(error.message, 2);
        });
    } else {
      Toast.success('请按正确格式填写收货信息', 2);
    }
  }

  valueChange = (value) => {
    let toValue = this.ToCDB(value);
    this.setState({
      address: toValue,
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

  render() {
    return (
      <div className='addressEditPage addressNewPage'>
        <Flex className={'accountWidth'}>
          <TextareaItem
            title="收货地址:"
            value={this.state.address}
            placeholder="请注意输入格式为【收货人,收电话,收货地址】。如“张三,13412312345,辽宁省大连市开发区金马路100号和平小区1号楼2单元301”"
            rows={3}
            autoHeight
            onChange={(e) => {
              this.valueChange(e)
            }}
          />
        </Flex>
        <Flex justify="center">
          <Button
            className='baseBtn'
            style={{position: 'fixed'}}
            type="warning" onClick={() => {
            this.saveAddress()
          }}><span style={{fontSize: '0.8em'}}>保存</span></Button>
        </Flex>
      </div>
    )
  }
}