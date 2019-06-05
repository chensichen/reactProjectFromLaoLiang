import React from 'react';
import { Button, Toast, Flex} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '../address/addressSelectPage.css';
import AddressListItem from '../../components/base/addressListItem';
import PropTypes from "prop-types";
import client from "../../frame/client";
import '../../App.css'

export default class addressSelectPage extends React.Component {
  constructor(props) {
    document.title = '地址管理';
    super(props);
      this.url = window.location.href;
      this.type = this.url.split("type=")[1];
      this.type = this.type.split("/fareValue=")[0];
    this.state = ({
      addressList: [],
      type: this.type, //判断是从哪个页跳转进来的列表页，1是订单结算页
    });
    this.mounted = true;
  }

  componentWillMount() {
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
      }).catch(error => {
      });
  }

  componentDidMount() {
    this.setState({
      addStatus: 'none',
    })
  }

  // 当前页面路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 新建收货地址
  newAddress = () => {
    this.context.router.history.push('/admin/shopPage/addressNewPage/type='+this.state.type);
  }
  //商品删除成功后，重新返回商品列表信息
  addressList = (data) => {
    this.setState({
      addressList: data,
    })
  }
  componentWillUnmount(){
      this.mounted = false;
  }
  render() {
    return (
      <div className='addressSelect'>
        {this.state.addressList.map((val, i) => (
          <AddressListItem val={val} key={i} dataCallBack={(data) => {
            this.addressList(data);
          }}
          />
        ))}
        <Flex justify="center">
          <Button
            className='baseBtn'
            style={{position: 'fixed'}}
            type="warning" onClick={() => {
            this.newAddress()
          }}><span style={{fontSize: '0.8em'}}>新建收货地址</span></Button>
        </Flex>
        <div style={{width:'100%',height:'7.8em'}}/>
      </div>
    )
  }
}