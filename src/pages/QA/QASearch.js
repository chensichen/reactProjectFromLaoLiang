import React from 'react';
import {List, SearchBar, WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './QA.css'
import client from "../../frame/client";
import PropTypes from "prop-types";


export default class QASearch extends React.Component {
  constructor(props) {
    document.title = '商品列表'
    super(props);
    this.state = {
      QASearchArr: [],
      QASearch: this.props.location.state.details,
      displayState: 'none',//没有数据时显示
    };
    this.mounted = true;
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  // 跳转到详情
  QADetails = (info) => {
    this.context.router.history.push({pathname: '/admin/minePage/QADetails', state: {details: info}});
  }

  onChange = (value) => {
    this.setState({
      QASearch: value,
    })
  };

  // 跳转到QA搜索列表页面
  onSubmitText = (value) => {
    // 本地存值，先获取本地存储的值并转换成数组
    let arr = JSON.parse(localStorage.getItem('search')) || [];
    // 将输入的值追加到数组里
    arr.push(value);
    //将value值存到本地
    localStorage.setItem('search', JSON.stringify(arr));
    // 获取时间戳

    client.post('api/qa/search.html', {
      'keywords': value,
      'p': 1,
      'rows': 1000,
    }).then(response => {
      if (response.list.length === 0) {
        if(this.mounted){
          this.setState({
              displayState: 'block',
              QASearchArr: response.list,
          })
        }
      } else {
        if(this.mounted){
          this.setState({
              displayState: 'none',
              QASearchArr: response.list,
          })
        }
      }
    }).catch(error => {
    });
    this.context.router.history.push({pathname: '/admin/minePage/QASearch', state: {details: value}});
  }

  /**
   * @module 请求QA列表信息
   */
  componentDidMount() {

    client.post('api/qa/search.html', {
      'keywords': this.state.QASearch,
      'p': 1,
      'rows': 1000,
    }).then(response => {
      if (response.list.length === 0) {
        if(this.mounted){
          this.setState({
              displayState: 'block',
              QASearchArr: response.list,
          })
        }
      } else {
        if(this.mounted){
          this.setState({
              displayState: 'none',
              QASearchArr: response.list,
          })
        }
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * @module 请求QA列表页面渲染
   */
  QASearchFunc = () => {
    const Item = List.Item;
    let QASearchArrDaw = [];
    //如果QA列表返回的数组不为空，循环并渲染QA列表
    if (this.state.QASearchArr.length === 0) {
      return false;
    }
    for (let i = 0; i < this.state.QASearchArr.length; i++) {
      QASearchArrDaw.push(
        <Item key={this.state.QASearchArr.id} arrow="horizontal"
              onClick={this.QADetails.bind(this, this.state.QASearchArr[i])}>
          <div dangerouslySetInnerHTML={{__html: this.state.QASearchArr[i].name}}/>
        </Item>
      )
    }
    return QASearchArrDaw;
  }

  render() {
    const displayState = this.state.displayState;
    return (
      <div className='SearchBody'>
        <div className='search'>
          <SearchBar
            onChange={this.onChange}
            onSubmit={this.onSubmitText}
            placeholder='有问题？搜一下'
            value={this.state.QASearch}
          />
        </div>
        <WhiteSpace size='xs'/>
        {this.QASearchFunc()}
        <div style={{display: (displayState)}} className='depositListClass' key='1'>
          <img style={{width: '18%'}} src={require('../../image/icon/noneState.png')} alt="没有数据"/>
          <p style={{fontSize:'0.8em'}}>找不到相关信息。</p>
        </div>
      </div>
    );
  }
}
