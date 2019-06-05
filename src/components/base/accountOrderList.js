import React from 'react';
import {Flex} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './shopList.css';

export default class productList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
    };
    this.mounted = true;
  }

  // 组件渲染之前接收父组件传过来的值
  componentWillReceiveProps(nextProps) {
    if(this.mounted){
      this.setState({
          productList: nextProps.productList,
      });
    }
  }
  componentWillUnmount(){
    this.mounted = false;
  }

  render() {
    return (
      <div>
        {this.state.productList.map((obj, i) => (
          <div style={{padding:'0.5em 0.5em 0.5em 0', background: '#ffffff'}} key={i}>
            <Flex justify='between'>
              <Flex>
                <img style={{height: '6em', width: '6em', margin: '0 0.5em'}} src={obj.url_show} alt=""/>
                <div>
                  <div style={{
                    marginBottom: '1.5em',
                    fontWeight: 'bold',
                  }}>{obj.skuname}</div>
                  <div><span style={{
                    fontSize: '1em',
                    color: '#D81E06',
                    fontWeight: 'bold',
                    display: 'inlineBlock'
                  }}>￥{obj.unit_price}</span></div>
                </div>
              </Flex>
              <div style={{display: 'flex', paddingTop: '4.6em',}}>
                x{obj.num}
              </div>
            </Flex>
          </div>
        ))
        }
      </div>
    )
  };

}