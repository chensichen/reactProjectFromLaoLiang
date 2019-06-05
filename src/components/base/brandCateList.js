import React from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import './brandCate.css';
import BrandCate from '../../components/base/brandCate' //品牌分类

export default class productList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cateList: [],
      defaultId: '',
    };
  }

  // 获取父组件传值
  componentWillReceiveProps(nextProps) {
    this.setState({
      cateList: nextProps.cateList,
      defaultId: nextProps.defaultId,
    })
  }

  render() {
    return (
      <div
        key={"hel"}
        style={{textAlign: 'center'}}>
        {this.state.cateList.map((val, i) => (
          <BrandCate key={i} dataVal={val} callBackId={(id) => {
            this.props.callBackId2(id);
          }} defaultId={this.state.defaultId}/>
        ))}
      </div>
    );
  }
}

