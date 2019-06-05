import React from 'react';
import {Card, WhiteSpace, Toast} from 'antd-mobile';
import ProductList from '../../components/base/productList'
import 'antd-mobile/dist/antd-mobile.css';
import './MinePage.css';
import client from '../../frame/client'
import PropTypes from "prop-types";

export default class minePage extends React.Component {
    constructor(props) {
        document.title = '我的'
        super(props);
        this.state = {
            userInfo: {},//用户信息
            ads: '',//广告图片
            name: '',//广告名
            serveIcon: [],//菜单列表
            goodsList: [],//商品列表
            addGoodsList: [],//分页时的商品列表
            cardName: '',//银行卡名称
            bankNumber: '',//银行卡号
            bankUname: '',//持卡人姓名
            rows: 4,
            adsState: 'none',//广告图片显示状态
            displayState: 'block',//没有商品时显示状态
            displayStateTwo: 'none'//没有商品时显示状态
        };
        this.dataPage = 1;
    }

    // 单页路由跳转
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    // 跳转到佣金一览
    commissionList = () => {
        this.context.router.history.push('/admin/minePage/commission');
    }
    // 跳转到提现一览
    depositSurvey = () => {
        this.context.router.history.push('/admin/minePage/deposit');
    }
    // 跳转到订单页全部订单
    myOrder = () => {
        this.context.router.history.push('/admin/minePage/order/' + 3);
    }
    // 跳转到订单页待付款
    OrderObligation = () => {
        this.context.router.history.push('/admin/minePage/order/' + 0);
    }
    // 跳转到订单页已撤销
    OrderPayment = () => {
        this.context.router.history.push('/admin/minePage/order/' + 1);
    }
    // 跳转到订单页已付款
    OrderRevocation = () => {
        this.context.router.history.push('/admin/minePage/order/' + 2);
    }
    // 跳转到签约信息页面（签约状态为1和4，跳转到申请签约页，签约状态为2和3，跳转到查看签约信息页）
    signInput = () => {
        client.post('api/sign/detail.html', {}).then(response => {
            // console.log('qqq', response.status)
            if (response.status === 1 || response.status === 4) {
                this.context.router.history.push('/admin/sign');
                // console.log('111==444')
            } else if (response.status === 3) {
                this.context.router.history.push('/admin/minePage/signInfo');
                // console.log('333')
            }
        }).catch(error => {

        });
        // this.context.router.history.push(this.state.serveIcon[0].url);
    }
    // 跳转到分销团队
    distributionTeam = () => {
        this.context.router.history.push(this.state.serveIcon[1].url);
    }
    // 跳转到二维码
    ewmCode = () => {
        this.context.router.history.push(this.state.serveIcon[2].url);
    }
    // 跳转到智能匹配
    intelligenMatch = () => {
        this.context.router.history.push(this.state.serveIcon[3].url);
    }
    // 跳转到银行卡
    bankCard = () => {
        this.context.router.history.push(this.state.serveIcon[4].url);
    }
    addressSelectPage = () => {
        this.context.router.history.push(this.state.serveIcon[5].url + '/type=2/fareValue=false/payType=1/addType=1');
    }
    // 跳转到QA首页
    QAPage = () => {
        this.context.router.history.push(this.state.serveIcon[6].url);
    }
    // 跳转到提现一览
    depositList = () => {
        this.context.router.history.push(this.state.serveIcon[7].url);
    }
    // 跳转到提现申请
    depositMay = () => {
        // 5.获取银行卡信息接口
        client.post('api/card/detail.html', {}).then(response => {
            if (this.mounted) {
                this.setState({
                    cardName: response.bank_name,
                    bankNumber: response.bank_number,
                    bankUname: response.bank_uname,
                })
            }
            if (this.state.cardName === '') {
                // 提现成功提示框
                Toast.offline('您还没有绑定银行卡！', 3);
                return false;
            } else if (this.state.bankNumber === '') {
                // 提现成功提示框
                Toast.offline('您还没有绑定银行卡！', 3);
                return false;
            } else if (this.state.bankUname === '') {
                // 提现成功提示框
                Toast.offline('您还没有绑定银行卡！', 3);
                return false;
            } else {
                this.context.router.history.push('/admin/minePage/depositMay');
            }
        }).catch(error => {
        });
    }

    // 组件渲染之后调用接口
    componentDidMount() {
        this.mounted = true;
        //1.获取用户信息接口
        client.post('api/member/detail.html', {}).then(response => {
            // console.log('sss', response)
            if (this.mounted) {
                this.setState({
                    userInfo: response,
                })
            }
        }).catch(error => {
        });
        //2.获取我的服务菜单列表接口
        client.post('api/common/menu', {
            'page': 1,
        }).then(response => {
            if (this.mounted) {
                this.setState({
                    serveIcon: response,
                })
            }
        }).catch(error => {
        });
        //3.获取广告图片接口
        client.post('api/common/ads.html', {
            'page': 4,
        }).then(response => {
            if (response.length === 0) {
                if (this.mounted) {
                    this.setState({
                        adsState: 'none'
                    })
                }
                return false;
            }
            if (this.mounted) {
                this.setState({
                    adsState: 'block',
                    ads: response[0].url_img,
                    name: response[0].name,
                })
            }

        }).catch(error => {
        });
        //4.获取商品列表接口
        client.post('api/goods/getlist.html', {
            'p': 1,
            'rows': this.state.rows,
            "recommend": 1,
        }).then(response => {
            if (response.list.length === 0) {
                if (this.mounted) {
                    this.setState({
                        displayState: 'none',
                        displayStateTwo: 'block',
                    })
                }
            } else {
                if (this.mounted) {
                    this.setState({
                        goodsList: response.list,
                        displayState: 'block',
                        displayStateTwo: 'none',
                    })
                }

            }
        }).catch(error => {
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * @module 商品列表分页效果，接口返回的数据
     * @param callback:回调函数
     */
    newListData = (callback) => {
        this.dataPage = parseFloat(this.dataPage + 1);
        client.post('/api/goods/getlist.html', {
            'p': this.dataPage,
            'rows': this.state.rows,
            "recommend": 1,
        }).then(response => {
            if (callback) {
                callback(response);
            }
        }).catch(error => {
        });
    }

    /**
     * @module 我的服务icon1
     */
    handleOpen = () => {
        let toolsA = [];
        let serveIconArr = this.state.serveIcon
        for (let i = 0; i < serveIconArr.length; i++) {
            if (i < 4) {
                if (i === 0) {
                    toolsA.push(<div key={i} onClick={this.signInput}>
                        <div>
                            <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
                        </div>
                        <span>{serveIconArr[i].name}</span>
                    </div>)
                } else if (i === 1) {
                    toolsA.push(<div key={i} onClick={this.addressSelectPage}>
                        <div>
                            <img src={serveIconArr[5].icon} alt={serveIconArr[5].name} key={serveIconArr[5].name}/>
                        </div>
                        <span>{serveIconArr[5].name}</span>
                    </div>)
                } else if (i === 2) {
                    toolsA.push(<div key={i} onClick={this.QAPage}>
                        <div>
                            <img src={serveIconArr[6].icon} alt={serveIconArr[6].name} key={serveIconArr[6].name}/>
                        </div>
                        <span>{serveIconArr[6].name}</span>
                    </div>)
                } else if (i === 3) {
                    toolsA.push(<div key={i} onClick={this.depositList}>
                        <div>
                            <img src={serveIconArr[7].icon} alt={serveIconArr[7].name} key={serveIconArr[7].name}/>
                        </div>
                        <span>{serveIconArr[7].name}</span>
                    </div>)
                }
            }
        }
        return toolsA;
    }
    /**
     * @module 我的服务icon1
     */
    // handleOpen = () => {
    //   let toolsA = [];
    //   let serveIconArr = this.state.serveIcon
    //   for (let i = 0; i < serveIconArr.length; i++) {
    //     if (i < 4) {
    //       if (i === 0) {
    //         toolsA.push(<div key={i} onClick={this.signInput}>
    //           <div>
    //             <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
    //           </div>
    //           <span>{serveIconArr[i].name}</span>
    //         </div>)
    //       } else if (i === 1) {
    //         toolsA.push(<div key={i} onClick={this.distributionTeam}>
    //           <div>
    //             <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
    //           </div>
    //           <span>{serveIconArr[i].name}</span>
    //         </div>)
    //       } else if (i === 2) {
    //         toolsA.push(<div key={i} onClick={this.ewmCode}>
    //           <div>
    //             <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
    //           </div>
    //           <span>{serveIconArr[i].name}</span>
    //         </div>)
    //       } else if (i === 3) {
    //         toolsA.push(<div key={i} onClick={this.intelligenMatch}>
    //           <div>
    //             <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
    //           </div>
    //           <span>{serveIconArr[i].name}</span>
    //         </div>)
    //       }
    //     }
    //   }
    //   return toolsA;
    // }
    /**
     * @module 我的服务icon2
     */
    handleOpen1 = () => {
        let toolsB = [];
        let serveIconArr = this.state.serveIcon;
        for (let i = 0; i < serveIconArr.length; i++) {
            if (i > 3) {
                if (i === 4) {
                    toolsB.push(<div key={i} onClick={this.bankCard}>
                        <div>
                            <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
                        </div>
                        <span>{serveIconArr[i].name}</span>
                    </div>)
                } else if (i === 5) {
                    toolsB.push(<div key={i} onClick={this.addressSelectPage}>
                        <div>
                            <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
                        </div>
                        <span>{serveIconArr[i].name}</span>
                    </div>)
                } else if (i === 6) {
                    toolsB.push(<div key={i} onClick={this.QAPage}>
                        <div>
                            <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
                        </div>
                        <span>{serveIconArr[i].name}</span>
                    </div>)
                } else if (i === 7) {
                    toolsB.push(<div key={i} onClick={this.depositList}>
                        <div>
                            <img src={serveIconArr[i].icon} alt={serveIconArr[i].name} key={serveIconArr[i].name}/>
                        </div>
                        <span>{serveIconArr[i].name}</span>
                    </div>)
                }
            }
        }
        return toolsB;
    }

    render() {
        const userInformation = this.state.userInfo;
        const displayState = this.state.displayState;
        const displayStateTwo = this.state.displayStateTwo;
        return (
            <div className='Mine baseBgF'>
                {/*顶部用户信息*/}
                <div className="mineInformation">
                    <div className='mineInformationLeft'>
                        <img src={userInformation.headimgurl} className='mineInformationHeader' alt='头像'/>
                    </div>
                    <div className='mineInformationRight'>
                        {/*新增判断用户名是否为空，用户名===""，显示微信名nickname*/}
                        {userInformation.name === '' ?
                            <p style={{fontSize: '1.2em', margin: 0, lineHeight: '1.6em'}}>{userInformation.nickname}</p> :
                            // 用户名不为空时，显示用户名和公司名
                            <div>
                                <p style={{
                                    fontSize: '1.2em',
                                    margin: 0,
                                    lineHeight: '1.6em'
                                }}>{userInformation.name}</p>
                                <p style={{
                                    fontSize: '0.8em',
                                    margin: 0,
                                    lineHeight: '1.2em'
                                }}>{userInformation.company_name}</p>
                            </div>
                        }
                    </div>
                </div>
                {/*佣金账户*/}
                {/*<div className='commissionAccount'>*/}
                {/*<Card>*/}
                {/*<Card.Header className='mineHeader' title="佣金账户"/>*/}
                {/*<Card.Body>*/}
                {/*<div onClick={this.commissionList}>*/}
                {/*<p className='mineUser'>{userInformation.history_amount}</p>*/}
                {/*<span>总佣金</span>*/}
                {/*</div>*/}
                {/*<div onClick={this.depositMay}>*/}
                {/*<p className='mineUser' style={{color: '#D81E06'}}>{userInformation.outstand_amount}</p>*/}
                {/*<span>可提现</span>*/}
                {/*</div>*/}
                {/*<div onClick={this.depositSurvey}>*/}
                {/*<p className='mineUser'>{userInformation.withdrawal_amount}</p>*/}
                {/*<span>已提现</span>*/}
                {/*</div>*/}
                {/*</Card.Body>*/}
                {/*</Card>*/}
                {/*</div>*/}
                {/*分割线样式sm、md、lg*/}
                {/*<WhiteSpace size="sm"/>*/}
                {/*我的订单*/}
                <div className='myOrder'>
                    <Card>
                        <Card.Header className='mineHeader' title="我的订单"/>
                        <Card.Body>
                            <div onClick={this.OrderObligation}>
                                <div>
                                    <img src={require('../../image/icon/obligation.png')} alt="2"/>
                                </div>
                                <span>待付款</span>
                            </div>
                            <div onClick={this.OrderPayment}>
                                <div>
                                    <img src={require('../../image/icon/undone.png')} alt="4"/>
                                </div>
                                <span>已撤销</span>
                            </div>
                            <div onClick={this.OrderRevocation}>
                                <div>
                                    <img src={require('../../image/icon/paid.png')} alt="3"/>
                                </div>
                                <span>已付款</span>
                            </div>
                            <div onClick={this.myOrder}>
                                <div>
                                    <img src={require('../../image/icon/order.png')} alt="5"/>
                                </div>
                                <span>全部订单</span>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                {/*分割线样式sm、md、lg*/}
                <WhiteSpace size="sm"/>
                {/*我的服务*/}
                <div className='myOrder myService'>
                    <Card>
                        <Card.Header className='mineHeader' title="我的服务"/>
                        <Card.Body>
                            <div className='myServiceIcon'>
                                {this.handleOpen()}
                            </div>
                            {/*<div className='myServiceIcon'>*/}
                            {/*{this.handleOpen1()}*/}
                            {/*</div>*/}
                        </Card.Body>
                    </Card>
                </div>
                {/*分割线样式sm、md、lg*/}
                <WhiteSpace size="sm"/>
                <div style={{display: (this.state.adsState)}}>
                    <img style={{width: "100%", marginBottom: '4px'}} src={this.state.ads} alt={this.state.name}/>
                    {/*<WhiteSpace size="sm"/>*/}
                </div>
                {/*商品列表*/}
                <div style={{display: (displayState)}}>
                    <ProductList proData={this.state.goodsList} proDataFunc={this.newListData}/>
                </div>
                <div style={{display: (displayStateTwo)}}>没有任何商品</div>
            </div>
        );
    }
}
