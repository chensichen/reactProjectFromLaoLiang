import React from 'react';
import {Carousel, WingBlank} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './carouselBar.css';

export default class carouselBar extends React.Component {
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
          >
            {this.props.data.map(val => (
              <a
                key={val.id}
                href={val.url_target ? val.url_target : '#'}
                alt={val.name}
                style={{display: 'inline-block', width: '100%'}}
              >
                <img
                  src={val.url_img}
                  alt=""
                  style={{width: '100%', verticalAlign: 'top', height: '16em'}}
                  onLoad={() => {
                    window.dispatchEvent(new Event('resize'));
                    this.setState({imgHeight: 'auto'});
                  }}
                />
              </a>
            ))}
          </Carousel>
        </WingBlank>
      );
    }
  }
}

