import React from 'react';
import {WingBlank, Flex} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './deposit.css'
import client from "../../frame/client";
import PageList from '../../components/pageList'


export default class deposit extends React.Component {
  constructor(props) {
    document.title = '提现一览'
    super(props);
    this.state = {
      depositList: [],//页面加载后的提现一览
      row: 20,//分页传递的参数
      displayState: 'visible',//提现列表有值时,列表的状态
      rows: 0,//当前总页码数
      p: 1,//当前页码
    };
    this.dataPage = 1;//分页默认1开始
    this.mounted = true;
  }

  /**
   * @module 页面渲染后请求提现一览接口
   */
  componentDidMount() {
    client.post('api/withdraw/getlist.html', {
      'rows': this.state.row,
    }).then(response => {
      if(this.mounted){
        this.setState({
            depositList: response.list,
            commissionTotal: response.total,
            rows: Math.ceil(response.total / this.state.row),
        })
      }
      if (response.total === 0) {
        this.setState({
          displayState: 'hidden',
        })
      }
    }).catch(error => {
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  /**
   * @module 提现列表分页效果，接口返回的数据
   * @param callback:用于触发回调函数的参数
   */
  newListData = (callback) => {
    this.dataPage = parseFloat(this.dataPage + 1);
    //当前页码
    let pages = this.dataPage;
    //列表总数除以每页返回的列表数，得到的值向上取整，就是当前总页码数
    let rows = this.state.rows;
    //判断当前页码大于总页码数，方法结束
    if (pages > rows) {
      return;
    }
    client.post('api/withdraw/getlist.html', {
      'rows': this.state.row,
      'p': pages,
    }).then(response => {
      if (callback) {
        callback(response.list);
      }
    }).catch(error => {
    });
  }

  /**
   * @module 提现一览的页面渲染
   * @param obj:
   */
  depositDraw = (obj) => {
    let amountCommission = obj.amount_commission.toFixed(2);
    let createTimeObj = obj.createtime.substr(0, 16);
    if (obj.status === 1) {
      return (
        <div className='depositBg' key={obj.id}>
          <WingBlank size='md'>
            <Flex justify="between">
              <span className='depositState depositG'>提现申请</span>
              <span className='depositMoney'>￥{amountCommission}</span>
            </Flex>
            <Flex justify="between">
              <span className='depositTime'>{createTimeObj}</span>
              <span className='depositRemark'>{obj.remark}</span>
            </Flex>
          </WingBlank>
        </div>
      )
    } else if (obj.status === 2) {
      return (
        <div className='depositBg' key={obj.id}>
          <WingBlank size='md'>
            <Flex justify="between">
              <span className='depositState depositC'>确认提现</span>
              <span className='depositMoney'>￥{amountCommission}</span>
            </Flex>
            <Flex justify="between">
              <span className='depositTime'>{createTimeObj}</span>
              <span className='depositRemark'>{obj.remark}</span>
            </Flex>
          </WingBlank>
        </div>
      )
    } else if (obj.status === 3) {
      return (
        <div className='depositBg' key={obj.id}>
          <WingBlank size='md'>
            <Flex justify="between">
              <span className='depositState depositRed'>拒绝提现</span>
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
  }

  /**
   * @module 当提现一览列表为空时，页面渲染提示获取佣金后即可提现。
   */
  depositHint = () => {
    if (this.state.commissionTotal === 0) {
      return (
        <div className='depositListClass' key='1'>
          <img style={{width: '18%'}} src={require('../../image/icon/noneState.png')} alt="没有数据"/>
          <p style={{fontSize: '0.8em'}}>获取佣金后即可提现。</p>
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
            commissionListArr={this.state.depositList}
            comDataFunc={this.newListData}
            depDataFUNC={this.depositDraw}
            rows={this.state.rows}
            row={this.state.row}
          />
        </div>
        {this.depositHint()}
      </div>
    );
  }
}
