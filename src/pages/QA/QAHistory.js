import React from 'react';
import {WhiteSpace, Flex, List, SearchBar, Modal} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './QA.css'
import PropTypes from "prop-types";

// 提示弹窗
const alert = Modal.alert;

export default class QAHistory extends React.Component {
  constructor(props) {
    document.title = 'QA列表';
    super(props);
    this.state = {
      setSearchArr: JSON.parse(localStorage.getItem('search')),//获取本地存储的值
    };
  }

  // 单页路由跳转
  static contextTypes = {
    router: PropTypes.object.isRequired,
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

  onHistory=(value)=>{
    this.context.router.history.push({pathname: '/admin/minePage/QASearch', state: {details: value}});
  }

  componentDidMount() {
    //自动获取焦点
    this.autoFocusInst.focus();
  }

  /**
   * @module 获取本地存储的值，并渲染到页面上
   */
  setSearchDaw = () => {
    let setSearchArray = this.state.setSearchArr;
    let searchDaw = [];
    let setSearchArrayTemp=[];//数组去重
    if (setSearchArray === null ) {
      return
    } else {
      for (let i = 0; i < setSearchArray.length; i++) {
        if(setSearchArrayTemp.indexOf(setSearchArray[i]) === -1){
          setSearchArrayTemp.push(setSearchArray[i]);
        }
      }
    }
    for (let i = 0; i < setSearchArrayTemp.length; i++) {
      searchDaw.push(
        <div key={setSearchArrayTemp[i]} className='historyTag'
             onClick={this.onHistory.bind(this, setSearchArrayTemp[i])}>{setSearchArrayTemp[i]}</div>
      )
    }
    return searchDaw;
  }

  emptyFunc = () => {
    alert('是否清空历史搜索记录？', '', [
      {text: '取消'},
      {text: '确认', onPress: () => this.emptyFuncClear()},
    ])
  }

  emptyFuncClear = () => {
    localStorage.clear();
    this.setState({
      setSearchArr: [],
    })
  }

  render() {
    const Item = List.Item;
    return (
      <div className='history'>
        <div className='search'>
          <SearchBar
            ref={ref => this.autoFocusInst = ref}
            onSubmit={this.onSubmitText}
            placeholder="有问题？搜一下"
          />
        </div>
        <WhiteSpace size='xs'/>
        <Item style={{borderBottom: '1px dashed #cccccc', marginBottom: 16, paddingLeft:'1em'}}>
          <Flex justify="between">
            <div>
              历史搜索
            </div>
            <div onClick={this.emptyFunc}>
              <img className='iconDelete' src={require('../../image/QA/delete.png')} alt=""/>
              <span className='empty'>清空</span>
            </div>
          </Flex>
        </Item>
        <Flex wrap="wrap">
          {this.setSearchDaw()}
        </Flex>
      </div>
    );
  }
}
