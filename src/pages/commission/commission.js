import React from 'react';
import {Flex, WingBlank} from "antd-mobile";
import 'antd-mobile/dist/antd-mobile.css';
import './commission.css'
import client from "../../frame/client";
import PageList from '../../components/pageList'//分页

export default class commission extends React.Component {
  constructor(props) {
    document.title = '佣金一览';
    super(props);
    this.state = {
      commissionList: [],//页面初始化的佣金列表
      row: 20,//分页传递的参数
      rows: 0,//当前总页码数
      displayState: 'visible',//提现列表有值时,列表的状态
    };
    this.dataPage = 1;//分页默认1开始
    this.mounted = true;
  }

  /**
   * @module 页面渲染后请求提现一览接口
   */
  componentDidMount() {
    client.post('api/team/earninglist.html', {
      'rows': this.state.row,
    }).then(response => {
      if(this.mounted){
        this.setState({
            commissionList: response.list,
            commissionTotal: response.total,
            rows: Math.ceil(response.total / this.state.row),
        })
      }
      if (response.total === 0) {
        if(this.mounted){
          this.setState({
              displayState: 'hidden',
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
   * @module 佣金列表分页效果，接口返回的数据
   */
  newListData = (callback) => {
    this.dataPage = parseFloat(this.dataPage + 1);
    //当前页码
    let pages = this.dataPage;
    //列表总数除以每页返回的列表数，得到的值向上取整，就是当前总页码数
    let rows = Math.ceil(this.state.commissionTotal / this.state.row);
    //判断当前页码大于总页码数，方法结束
    if (pages > rows) {
      return false;
    }
    client.post('api/team/earninglist.html', {
      'rows': this.state.row,
      'p': this.dataPage,
    }).then(response => {
      if (callback) {
        callback(response.list);
      }
    }).catch(error => {
    });
  }

  /**
   * @module 佣金列表页面渲染
   */
  depositDraw = (obj) => {
    let amountCommission = obj.amount_commission.toFixed(2);
    let createTimeObj = obj.createtime.substr(0, 16);
    return (
      <div className='depositBg' key={obj.index}>
        <WingBlank size='md'>
          <Flex justify="between">
            <span className='depositState depositG'>佣金增加</span>
            <span className='depositMoney'>￥{amountCommission}</span>
          </Flex>
          <Flex justify="between">
            <span className='depositTime'>{createTimeObj}</span>
            <span className='depositRemark'>{obj.remark}</span>
          </Flex>
        </WingBlank>
      </div>
    )
  }

  /**
   * @module 当提现一览列表为空时，页面渲染提示获取佣金后即可提现。
   */
  commissionListHint = () => {
    if (this.state.commissionTotal === 0) {
      return (
        <div className='depositListClass' key='1'>
          <img style={{width:'18%'}} src={require('../../image/icon/noneState.png')} alt="没有数据" />
          <p style={{fontSize:'0.8em'}}>分享二维码给好友，获取更多佣金。</p>
        </div>
      )
    }
  }

  render() {
    const displayState = this.state.displayState;
    return (
      <div className='whiteBg'>
        <div style={{visibility: (displayState)}} className="flex-container">
          <PageList
            commissionListArr={this.state.commissionList}
            comDataFunc={this.newListData}
            depDataFUNC={this.depositDraw}
            rows={this.state.rows}
            row={this.state.row}
          />
        </div>
        {this.commissionListHint()}
      </div>
    );
  }
}
