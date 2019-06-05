import React from 'react';
import {List, Flex} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './bankCard.css'
import client from "../../frame/client";
import PropTypes from "prop-types";

export default class bankCardEdit extends React.Component {
  constructor(props) {
    document.title = '银行卡';
    super(props);
    this.state = {
      bankText: {},//获取银行卡信息
    };
  }

  /**
   * @module 请求银行卡信息
   */
  componentDidMount() {
    client.post('api/card/detail.html', {
    }).then(response => {
      this.setState({
        bankText: response,
      })
    }).catch(error => {
    });
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 点击编辑按钮，可以编辑页面
  handleClick = () => {
    this.context.router.history.push('/admin/minePage/bankCard');
  }

  render() {

    if (JSON.stringify(this.state.bankText) === "{}") {
      return false;
    } else {
      const bankTextObj = this.state.bankText;
      let bankNum = String(bankTextObj.bank_number);
      let bankNumber = bankNum.replace(/(.{4})/g, "$1 ")
      return (
        <div className='bankCardEdit' onClick={this.handleClick}>
          <Flex justify="center">
            <div className='bankCardEditBG'>
              <Flex>
                  <div className='bankCardLogo'>樱</div>
                  <List>
                    <p className='bankCardP'>
                      {bankTextObj.bank_name}
                    </p>
                    <p className='bankCardNumber'>
                      {bankNumber}
                    </p>
                    <p className='bankCardUName'>
                      {bankTextObj.bank_uname}
                    </p>
                  </List>

              </Flex>

            </div>
          </Flex>
        </div>
      );
    }
  }
}
