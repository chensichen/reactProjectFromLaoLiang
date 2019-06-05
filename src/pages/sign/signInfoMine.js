import React from 'react';
import {WingBlank, List, Flex} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './sign.css'
import client from '../../frame/client'

export default class signInfo extends React.Component {
  constructor(props) {
    document.title = localStorage.getItem('app_name')?localStorage.getItem('app_name'):'樱淘海外严选'
    super(props);
    this.state = {
      signInfoList:{},
      signColor:'',
      signState:'none',
    };
    this.mounted = true;
  }
  /**
   * @module 页面渲染后请求签约信息接口
   */
  componentDidMount() {
    client.post('api/sign/detail.html', {
    }).then(response => {
      if(response.status===2){
        if(this.mounted){
          this.setState({
              signColor:'#d81e06',
              signState:'none',
              signInfoList: response,
          })
        }
      }else if(response.status===3){
        if(this.mounted){
          this.setState({
              signColor:'#008000',
              signState:'block',
              signInfoList: response,
          })
        }
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
      this.mounted = false;
  }
  signDrow=()=>{
    const signInfoListInfo=this.state.signInfoList;
    if(JSON.stringify(signInfoListInfo) !== '{}'){
      return (
        <WingBlank size="lg">
          <List>
            <List.Item>
              <Flex>
                <span className='companyName'>公司名称</span>
                <span className='companyText'>{signInfoListInfo.company_name}</span>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <span className='companyName'>联系人</span>
                <span className='companyText'>{signInfoListInfo.name}</span>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <span className='companyName'>联系电话</span>
                <span className='companyText'>{signInfoListInfo.phone}</span>
              </Flex>
            </List.Item>
            <List.Item>
              <Flex>
                <span className='companyName'>签约类型</span>
                <span className='companyText' style={{color: (this.state.signColor)}}>{signInfoListInfo.status_text}</span>
              </Flex>
            </List.Item>
            <div style={{display: (this.state.signState)}}>
              <List.Item>
                <Flex>
                  <span className='companyName'>截止时间</span>
                  <span className='companyText'>{signInfoListInfo.sign_date_end}</span>
                </Flex>
              </List.Item>
            </div>
          </List>
        </WingBlank>
      );
    }
  }

  render() {
    return(
      <div className='signInfo'>
        {this.signDrow()}
        <div style={{width: '100%', height:'8em', backgroundColor: '#f5f5f9',position: 'fixed',bottom: '0',zIndex:9}}/>
      </div>

    )
  }
}
