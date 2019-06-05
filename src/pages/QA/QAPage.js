import React from 'react';
import {Flex, WhiteSpace, List, SearchBar} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './QA.css'
import PropTypes from "prop-types";
import client from "../../frame/client";


export default class QAList extends React.Component {
  constructor(props) {
    document.title = 'QA列表'
    super(props);
    this.state = {
      QAList: [],// QA首页列表
      QAService: '',//QA客服电话
      displayState: 'none',//底部电话是否显示
    };
    this.mounted = true;
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到QA一览
  QAList = (item) => {
    this.context.router.history.push({pathname: '/admin/minePage/QAList', state: {list: item}});
  }
  // 跳转到QA详情
  QADetails = (info) => {
    this.context.router.history.push({pathname: '/admin/minePage/QADetails', state: {details: info}});
  }
  // 跳转到QA历史
  QAHistory = () => {
    this.context.router.history.push('/admin/minePage/QAHistory');
  }

  /**
   * @module 请求QA列表信息
   */
  componentDidMount() {
    client.post('api/qa/getlist.html', {
      'rows': 100,
    }).then(response => {
    if(this.mounted){
      this.setState({
        QAList: response.list,
        displayState: 'block',
      })
    }

    }).catch(error => {
    });
    // 2.获取系统配置接口
    client.post('api/common/getconfig.html', {
      'keys': 'customer_phone',
    }).then(response => {
      if(this.mounted){
        this.setState({
          QAService: response.customer_phone,
        })
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * @module QA列表信息渲染
   */
  QAPage = () => {
    const QAListArr = this.state.QAList;
    const Item = List.Item;
    let QAPageArr = [];
    for (let i = 0; i < QAListArr.length; i++) {
      let QAListChildrenArr = QAListArr[i].children;
      QAPageArr.push(
        <div key={QAListArr[i].id}>
          <WhiteSpace size='xs'/>
          <Flex justify="between">
            <div className='qaName' onClick={this.QAList.bind(this, QAListArr[i].id)}>
              <Flex justify="center">
                <img className='qaIcon' src={require('../../image/QA/QA1.png')} alt=""/>
              </Flex>
              <Flex justify="center">
                <span className='qaNameTextLeft'>{QAListArr[i].name}</span>
              </Flex>
            </div>
            <div className='qaNameList'>
              {
                QAListChildrenArr.map((item) => {
                    return (
                      <Item key={item.id} className='qaNameListText'
                            onClick={this.QADetails.bind(this, item)}>{item.name}</Item>
                    )
                  }
                )
              }

            </div>
          </Flex>
        </div>
      )
    }
    return QAPageArr;
  }

  render() {
    const displayState = this.state.displayState;
    return (
      <div className='QAPage' style={{display: (displayState)}}>
        <div className='search'>
          <SearchBar
            // 通过父组件点击QA首页获取焦点时，传回的方法
            onFocus={this.QAHistory}
            placeholder="有问题？搜一下"
          />
        </div>
        <div>
          {this.QAPage()}
          <WhiteSpace size='xs'/>
          <Flex justify="center" className='qaRelation'>
            没找到相关问题？联系客服 {this.state.QAService}
          </Flex>
          <div style={{width: '100%', height: '3.7em', backgroundColor: '#ffffff'}}/>
        </div>
      </div>
    );
  }
}
