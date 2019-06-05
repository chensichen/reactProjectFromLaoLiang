import React from 'react';
import {ListView} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

export default class pageList extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
    };
    this.datas = [];//定义商品列表总数组
    this.dataType = this.props.dataType;
    this.mounted = true;
  }

  // 当props发生变化时执行
  componentWillReceiveProps(nextProps) {
    if (this.dataType !== nextProps.dataType) {
      this.datas = [];
      this.dataType = nextProps.dataType;
    } else if (this.datas.length === 0) {

      this.datas = nextProps.commissionListArr;
    }
    let page = Math.floor(this.datas.length / this.props.row) + 1;
    setTimeout(() => {
      // 每次变化都克隆一次父组件传的值
      let newAry = this.datas.map(item => {
        if (this.props.orderId !== undefined && this.props.orderId !== ""
          && item.id === this.props.orderId) {
          return Object.assign({}, item);
        }
        return item;
      });
      this.datas = newAry;
      if (page === 1) {
        // 将父组件传回的值追加到商品列表总数组中
        if(this.mounted){
          this.setState({
              isLoading: false,
              dataSource: this.state.dataSource.cloneWithRows(this.datas),// cloneWithRows方法,自动提取新数据并进行逐行对比，这样ListView就知道哪些行需要重新渲染了。
          });
        }
      } else {
        if(this.mounted){
          this.setState({
              // cloneWithRows方法,自动提取新数据并进行逐行对比，这样ListView就知道哪些行需要重新渲染了。
              dataSource: this.state.dataSource.cloneWithRows(this.datas),
              isLoading: true
          });
        }
      }
    }, 600);
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  // 数据都渲染之后，列表被滚动到屏幕最底部时调用
  onEndReached = () => {
    let page = Math.ceil(this.datas.length / this.props.row) + 1;
    if (page > this.props.rows) {
      // page=this.props.rows, '显示已到最后一页'
      this.setState({isLoading: false});
      return false;
    }
    this.setState({isLoading: true});
    //获取父组件触发分页效果时，函数返回的商品列表数据
    this.props.comDataFunc(this.funcCallBack);
  }

  funcCallBack = (result) => {
    // "分页组件：调用分页接口时返回的值", result
    setTimeout(() => {
      // 当列表滚动到屏幕最底部时，调用分页接口，将新的商品列表数据追加到总的商品列表数组中
      this.datas = [...this.datas, ...result];
      // "分页组件：调用分页接口,将返回值追加到数组里", this.datas
      this.setState({
        // cloneWithRows方法,自动提取新数据并进行逐行对比，这样ListView就知道哪些行需要重新渲染了。
        dataSource: this.state.dataSource.cloneWithRows(this.datas),
      });
    }, 1000);

  }

  render() {
    // separator的值会被渲染在组件的每一行下面
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
      />
    );

    let row = (rowData) => {
      let depDataFUNCObj = this.props.depDataFUNC(rowData);
      return (
        depDataFUNCObj
      )
    };
    return (
      <div style={{width: "100%"}}>
        <ListView
          dataSource={this.state.dataSource}
          renderFooter={() => (<div style={{paddingBottom: 46, textAlign: 'center', fontSize: '0.8em'}}>
            {this.state.isLoading ? '加载更多' : '已到最后一页'}
          </div>)}
          renderRow={row}
          renderSeparator={separator}
          className="am-list"
          pageSize={10}
          useBodyScroll
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>
    );
  }
}

