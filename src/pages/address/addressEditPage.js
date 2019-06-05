import React from 'react';
import {Flex, Button, TextareaItem, Toast} from 'antd-mobile';
import client from "../../frame/client";
import 'antd-mobile/dist/antd-mobile.css';
import '../address/addressEditPage.css';
import PropTypes from "prop-types";
import '../../App.css'

export default class addressEditPage extends React.Component {
  constructor(props) {
    document.title = '地址管理';
    super(props);
      this.url = window.location.href;
      let type = this.url.split("type=")[1].split("/fareValue=")[0];
    this.state = ({
      address: '',
      type: type, //判断是从哪个页跳转进来的列表页，1是订单结算页
    });
    this.mounted = true;
  }

  componentWillMount() {
    this.setState({
      addStatus: 'none',
    })
    let url = window.location.href.split('addressEditPage/')[1];
    let id = url.split('type=')[0];
    if (id) {
      client.post('api/address/detail.html', {
        "aid": id,
      }).then(response => {
        if(this.mounted){
          this.setState({
              address: response.name + ',' + response.phone + ',' + response.address,
          })
        }
      }).catch(error => {
          Toast.success(error.message, 2);
      });
    }
  }

  // 当前页面路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  //保存收货地址
  saveAddress = () => {
    let url = window.location.href;
    let aid = url.split('addressEditPage/')[1];
    client.post('api/address/modify.html', {
      "aid": aid,
      "address": this.state.address,
    }).then(response => {
      Toast.success('修改收货地址成功', 2);
      this.context.router.history.push('/admin/shopPage/addressSelectPage/type='+this.state.type + '/fareValue=false/payType=1/addType=1');
    }).catch(error => {
      Toast.success('修改收货地址失败', 2);
    });

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
  componentWillUnmount(){
      this.mounted = false;
  }
  render() {
    return (
      <div className='addressEditPage'>
        <Flex className={'accountWidth'}>
          <TextareaItem
            title="收货地址:"
            value={this.state.address}
            placeholder="请填写收货人地址"
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