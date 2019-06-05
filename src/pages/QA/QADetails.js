import React from 'react';
import {List} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './QA.css'

export default class QAList extends React.Component {
  constructor(props) {
    document.title = 'QA列表';
    super(props);
    this.state = {
      details:this.props.location.state.details,
    };
  }

  render() {
    const Item = List.Item;
    const detailsArr = this.state.details;
    let name = detailsArr.name.replace(/<.*?>/g, '');
    let answer = detailsArr.answer.replace(/<.*?>/g, '');
    return (
      <div className='QADetails'>
        <Item style={{borderBottom: '1px dashed #cccccc'}}>
          <div dangerouslySetInnerHTML={{__html: name}} />
        </Item>
        <Item wrap className='answer'>
          <div dangerouslySetInnerHTML={{__html: answer}} />
        </Item>
      </div>
    );
  }
}
