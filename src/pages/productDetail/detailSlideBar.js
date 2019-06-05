import React from 'react';
import {Carousel, WingBlank} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

export default class detailSlideBar extends React.Component {
  render() {
    if (this.props.data.length === 0) {
      return false;
    } else {
      return (
        <WingBlank>
          <Carousel
            dotStyle={{width: '8px',height:'2px',borderRadius:'0em',marginTop:'-6px'}}
            dotActiveStyle={{ width: '5px',height:'5px',background: 'transparent',border:'2px solid #cccccc'}}
            autoplay={true}
            infinite
            beforeChange={(from, to) => {}}
            afterChange={index => {}}
          >
            {this.props.data.map(val => (
              <img
                key={1}
                src={val}
                alt=""
                style={{width: '100%', verticalAlign: 'top', height: '16em'}}
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'));
                  this.setState({imgHeight: 'auto'});
                }}
              />
            ))}
          </Carousel>
        </WingBlank>
      );
    }
  }
}

