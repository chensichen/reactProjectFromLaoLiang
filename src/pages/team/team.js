import React from 'react';
import {WhiteSpace, List, Flex, Button} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './team.css'
import client from '../../frame/client'
import PropTypes from "prop-types";


export default class team extends React.Component {
  constructor(props) {
    document.title = '我的团队';
    super(props);
    this.state = {
      teamOne: {},//分销团队一级
      teamSecond: [],//分销团队二级
    };
    this.mounted = true;
  }

  /**
   * @module 请求分销团队信息
   */
  componentDidMount() {
    client.post('api/team/detail.html', {
    }).then(response => {
      if(this.mounted){
        this.setState({
            teamOne: response,
            teamSecond: response.members,
        })
      }

    }).catch(error => {
    });
  }
  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  //跳转到二维码页面
  ewmCode = () => {
    this.context.router.history.push('/admin/minePage/ewmCode');
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * @module 请求分销团队一级分销信息
   */
  statusText = () => {
    const teamOneArr = this.state.teamOne;
    const teamOneArrDaw = [];
    if (teamOneArr.status === 3) {
      teamOneArrDaw.push(
        <List className="my-list" key={teamOneArr.id}>
          <List.Item>
            <Flex>
              <img style={{margin: '0 1.5em 0 0.5em'}} src={teamOneArr.headimgurl} alt=""/>
              <div>
                <Flex align="baseline">
                  <span className='teamNickname'>{teamOneArr.name}</span>
                  <span className='teamstatusText'>{teamOneArr.status_text}</span>
                </Flex>
                <p className='teamcompanyName'>{teamOneArr.company_name}</p>
              </div>
            </Flex>
          </List.Item>
        </List>
      )
    }
    return teamOneArrDaw;
  }

  /**
   * @module 请求分销团队二级分销信息
   */
  statusTextTwo = () => {
    const teamOneArr = this.state.teamOne;
    const teamSecondArr = this.state.teamSecond;
    const teamSecondArrDaw = [];

    teamSecondArr.map((info) => {
      if (info.status === 1) {
        teamSecondArrDaw.push(
          <List className="my-list" key={info.id}>
            <List.Item>
              <Flex>
                <img className='teamSecondImg' src={info.headimgurl} alt=""/>
                <div>
                  <Flex align="baseline">
                    <span className='teamNickname'>{info.name}</span>
                    <span className='teamstatusText'>未签约</span>
                  </Flex>
                  <p className='teamcompanyName'>{info.company_name}</p>
                </div>
              </Flex>
            </List.Item>
          </List>
        )
      } else if (info.status === '5') {
        teamSecondArrDaw.push(
          <List className="my-list" key={info.id}>
            <List.Item>
              <Flex>
                <img className='teamSecondImg' src={info.headimgurl} alt=""/>
                <div>
                  <Flex align="baseline">
                    <span className='teamNickname'>{info.name}</span>
                    <span className='teamstatusTextRed'>已过期</span>
                  </Flex>
                  <p className='teamcompanyName'>{info.company_name}</p>
                </div>
              </Flex>
            </List.Item>
          </List>
        )
      } else if (info.status === '3') {
        teamSecondArrDaw.push(
          <List className="my-list" key={info.id}>
            <List.Item>
              <Flex>
                <img className='teamSecondImg' src={info.headimgurl} alt=""/>
                <div>
                  <Flex align="baseline">
                    <span className='teamNickname'>{info.name}</span>
                    <span className='teamstatusText'>已签约</span>
                  </Flex>
                  <p className='teamcompanyName'>{info.company_name}</p>
                </div>
              </Flex>
            </List.Item>
          </List>
        )
      }
      return false;
    })
    if (teamSecondArr.length === 0 && JSON.stringify(teamOneArr) !== '{}') {
      teamSecondArrDaw.push(
        <div key='1' className='shopListClass'>
          <Flex justify='center'>
            <img style={{width: '18%'}} src={require('../../image/icon/team.png')} alt="没有数据"/>
          </Flex>
          <p style={{fontSize:'0.8em'}}>分享二维码给好友，建立专属团队</p>
          <Flex justify={'center'}>
            <Button onClick={this.ewmCode} style={{width: '30%', background: '#d81e06'}} type={"warning"}
                    size={"small"}>去分享</Button>
          </Flex>
        </div>
      )
    }
    return teamSecondArrDaw;
  }

  render() {
    return (
      <div className='team'>
        {this.statusText()}
        <WhiteSpace size="xs"/>
        {this.statusTextTwo()}
      </div>
    );
  }
}
