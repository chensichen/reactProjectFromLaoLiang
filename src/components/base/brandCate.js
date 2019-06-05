import React from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import './brandCate.css';

export default class productList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cateList: [],
      defaultId: '',
      dataVal: [],
    };
    this.mounted = true;
  }

  // 获取父组件传值
  componentWillReceiveProps(nextProps) {
    if(this.mounted){
      this.setState({
          dataVal: nextProps.dataVal, //获取父组件传过来的值
          defaultId: nextProps.defaultId, //获取父组件传过来的默认Id
      })
    }
  }

  onchangeId(id) {
    //切换tab页 调接口取数据
    this.props.callBackId(id);
  }
  componentWillUnmount(){
    this.mounted = false;
  }

  render() {
    return (
      <p
        key={this.state.dataVal.id}
        className={this.state.dataVal.id === this.state.defaultId ? 'brandTitleRed' : 'brandTitle'}
        onClick={(id) => this.onchangeId(this.state.dataVal.id)}
      >
        {this.state.dataVal.name}
      </p>
    );
  }
}

