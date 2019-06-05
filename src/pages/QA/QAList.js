import React from 'react';
import {List, SearchBar, WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './QA.css'
import PropTypes from "prop-types";
import client from "../../frame/client";

export default class QAList extends React.Component {
  constructor(props) {
    document.title = 'QA列表'
    super(props);
    this.state = {
      QAListId: this.props.location.state.list,//QA首页点击QA分类是传过来的商品id值
      QAListArr: [],
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
  // 跳转到QA搜索列表页面
  onSubmitText = (value) => {
    // 本地存值，先获取本地存储的值并转换成数组
    let arr = JSON.parse(localStorage.getItem('search')) || [];
    // 将输入的值追加到数组里
    arr.push(value);
    //将value值存到本地
    localStorage.setItem('search', JSON.stringify(arr));

    this.context.router.history.push({pathname: '/admin/minePage/QASearch', state: {details: value}});
  }

  /**
   * @module 请求QA列表信息
   */
  componentDidMount() {
    client.post('api/qa/detail.html', {
      'qid':this.state.QAListId,
      'p': 1,
      'rows':100,
    }).then(response => {
      if(this.mounted){
        this.setState({
            QAListArr: response.children.list,
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
  QAListFunc = () => {
    const Item = List.Item;
    const QAListArrInfo = this.state.QAListArr;
    let QAListArr = [];
    for (let i = 0; i < QAListArrInfo.length; i++) {
      QAListArr.push(
        <Item key={i} arrow="horizontal"
              onClick={this.QADetails.bind(this, QAListArrInfo[i])}>{QAListArrInfo[i].name}</Item>
      )
    }
    return QAListArr;
  }

  render() {
    return (
      <div className='QAList'>
        <div className='search'>
          <SearchBar
            onSubmit={this.onSubmitText}
            placeholder="有问题？搜一下"
          />
        </div>
        <WhiteSpace size='xs'/>
        {this.QAListFunc()}
      </div>
    );
  }
}
