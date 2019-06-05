import React from 'react';
import { SearchBar, Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import 'antd-mobile/dist/antd-mobile.css';
import './search.css';

export default class search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }
    onChange= (value) => {
        this.setState({ value:value });
    };
    clear = () => {
        this.setState({ value: '' });
    };
    // 当前页面路由跳转
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    submit = (name) => {
        //页面跳转
        if(name){
            this.context.router.history.push('/admin/homePage/search/'+ encodeURI(name));
        }else{
            Toast.success('请输入要搜索的商品名称', 2);
        }

    }
    render() {
        return (<div className='search'>
            <SearchBar
                value={this.state.value}
                placeholder="请输入要搜索的商品名称"
                onSubmit={(value) => {this.submit(value)}}
                onClear={(value) => {this.clear(value)}}
                onCancel={(value) => {this.clear(value)}}
                onChange={this.onChange}
            />
        </div>);
    }
}

