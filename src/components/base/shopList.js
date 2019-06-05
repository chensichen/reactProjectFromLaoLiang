import React from 'react';
import 'antd-mobile/dist/antd-mobile.css';
import './shopList.css';
import CheckItem from "./checkItem";

export default class productList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  render() {
      return (
          <div style={{marginBottom: '6.4em'}}>
              {this.props.proData.map((val,i) => (
                  <CheckItem key={i} val={val} valAll={this.props.proData} proArr={this.props.proArr} testCallBack={(data1,data2,idArr)=>{
                      this.props.test2CallBack(data1,data2,idArr);
                  }}
                  productCallBakc={(data)=>{
                      this.props.product2CallBack(data);
                  }}
                  productTotalCallBack={(data)=>{
                      this.props.productTotalCallBack2(data);
                  }}
                  />
              ))}
          </div>
      )
    };

}