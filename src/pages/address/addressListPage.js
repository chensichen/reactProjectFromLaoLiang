import React from 'react';
import {Flex, Button, TextareaItem, WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '../accountOrder/accountOrderPage.css';
import '../address/addressEditPage.css';
import PropTypes from "prop-types";

export default class addressListPage extends React.Component {
  constructor(props) {
    document.title = '地址管理';
    super(props);
    this.state = ({})
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
  //保存收货地址
  saveAddress = () => {
    this.context.router.history.push('/admin/shopPage/accountOrderPage');
  }

  render() {
    return (
      <div>
        <Flex className={'accountWidth'}>
          <TextareaItem
            style={{color: '#888888'}}
            title="收货地址:"
            placeholder="请填写收货人地址"
            data-seed="logId"
            autoHeight
          />
        </Flex>
        <div style={{
          padding: '0px 2%',
          bottom: '3em',
          position: 'fixed',
          width: '96%'
        }}>
          <Button type="warning" onClick={() => {
            this.saveAddress()
          }}>保存</Button><WhiteSpace/>
        </div>
      </div>
    )
  }
}