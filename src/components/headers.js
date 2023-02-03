import React from 'react';
import { Row, Col, Button, AutoComplete, Input } from "antd"
import {MinusCircleOutlined} from '@ant-design/icons'

const options = [
    {
        value: 'Content-Type',
    },
    {
        value: 'User-Agent',
    },
    {
        value: 'Content-Length',
    },
    {
        value: 'Accept-Encoding',
    },{
        value: 'Accept-Language',
    },{
        value: 'Authorization'
    },{
        value: 'Cookie',
    },{
        value: 'Referer',
    },
    {
        value: 'Connection',
    },
];


class HeaderInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: props.headers,
            count: Object.keys(props.headers).length,
        }
    }

    changed(){
        let object = this.state.headers
        this.props.handleHeaderChange(object)
    }
    
    add() {
        let headers = this.props.headers;
        headers.push({id: this.state.count,key:"", value:""})
        this.setState({headers: headers, count: this.state.count+1}, this.changed)
    }

    remove(i) {
        let headers = this.props.headers;
        headers = headers.slice(0,i).concat(headers.slice(i+1))
        this.setState({headers: headers}, this.changed)
    }

    setKey(value, i, callback=()=>{}) {
        let headers = this.props.headers;
        headers[i].key = value
        this.setState({headers: headers}, callback)
    }

    setValue(value, i, callback=()=>{}) {
        let headers = this.props.headers;
        headers[i].value = value
        this.setState({headers: headers}, callback)
    }

    render() {
        return (
            <Row>
                {
                    this.props.headers.map((header, i) => {
                        return (
                            <Col span={24} style={{marginTop:"0.5%"}} key={header.id}>
                                <Row>
                                    <Col span={6}>
                                        <AutoComplete
                                            style={{width: "100%"}}
                                            size='small'
                                            value={header.key}
                                            options={options}
                                            placeholder="Header Key"
                                            onChange={(e)=>this.setKey(e, i)}  onBlur={()=>this.setKey(header.key, i, this.changed)}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </Col>
                                    <Col span={1}>
                                        :
                                    </Col>
                                    <Col span={16}>
                                        <Input size='small' value={header.value} placeholder="Header Value" onChange={(e)=>this.setValue(e.target.value, i)}  onBlur={()=>this.setValue(header.value, i, this.changed)}/>
                                    </Col>
                                    <Col span={1}>
                                         <MinusCircleOutlined onClick={()=>this.remove(i)}/>
                                    </Col>
                                </Row>
                            </Col>
                        )
                    })
                }
                <Col span={24} style={{marginTop:"0.5%"}}>
                    <Button type="primary" size='small' ghost block onClick={()=>this.add()}>
                        增 加 请 求 头
                    </Button>
                </Col>
            </Row>
        )
    }
}

export default HeaderInput