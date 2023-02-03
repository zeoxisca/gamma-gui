import React from 'react';
import { Collapse, Button, Input, Row, Col, Radio, Switch, Divider, AutoComplete } from 'antd';
import CombineForm from './form-combine';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import HeaderInput from './headers';
import OutputInput from './outputs';
import RefAutoComplete from 'antd/es/auto-complete';

const { Panel } = Collapse;
const { TextArea } = Input;

const options = [{value: 'response.status == 200'},
{value: 'response.status == 302'},
{value: 'response.status == 500'},
{value: '"root:.*?:[0-9]*:[0-9]*:".matches(response.body_string)'},
{value: 'response.body_string.contains("for 16-bit app support")'},
{value: 'response.content_type.contains("json")'},
{value: 'response.body_string.contains(string(s1 - s2))'},
{value: 'response.body_string.contains(md5(s1))'},
{value: 'response.body_string.contains(md5(string(rand)))'},
{value: 'reverse.wait(5)'},
{value: 'response.body_string.contains(string(s1 + s2))'},
{value: 'response.status == 200 && "root:.*?:[0-9]*:[0-9]*:".matches(response.body_string)'},
{value: 'response.status == 200 && response.body_string.contains("for 16-bit app support")'},
{value: 'response.status == 200 && response.body_string.contains(md5(s1))'},
{value: 'response.status == 200 && response.body_string.contains(string(s1 - s2))'},
{value: 'response.status == 200 && response.body_string.contains(md5(string(rand)))'}];
class Rule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rules: props.rules,
            counts: 1,
            activeKey: ['0'],
        }
    }

    changed() {
        this.props.handleChange(this.state.rules)
    }

    add() {
        let rule = this.props.rules;
        if (this.props.rules.length == 5){
            this.props.notify("温馨提示", "前端是安全工程师写的，超过5个Rule表单再改动可能会变卡！", "warning")
        }
        let current = 0;
        for (let i=0; i<rule.length; i++){
            if (rule[i].name[0] == 'r') {
                let b = parseInt(rule[i].name.slice(1))
                if (b || b === 0) {
                    current = Math.max(current, b)
                }
            } 
        }
        rule.push({
            "id": this.state.counts,
            "method": "GET",
            "path": "/",
            "follow_redirects": false,
            "outputs": [],
            "body": "",
            "expression": "",
            "headers": [],
            "name": this.getValue(current+1),
            "comment": "",
        })
        this.setState({
            rules: rule,
            activeKey: [...this.state.activeKey, this.state.counts],
            counts: this.state.counts + 1,
        }, () => {
            this.changed()
            const dom = document.getElementById('scroll-bottom')
            dom.scrollIntoView()
        })
    }
    handleChange(v) {
        this.setState({ activeKey: v })
    }
    remove(r) {
        if (this.props.rules.length == 1) {
            // todo raise warning
            return
        }
        var rule = this.props.rules;
        let t = -1;
        for (let i = 0; i < rule.length; i++) {
            if (rule[i].id == r) {
                t = i;
                break
            }
        }
        if (t >= 0) {
            rule = rule.slice(0, t).concat(rule.slice(t + 1))
        }
        this.setState({
            rules: rule
        }, this.changed
        )

    }
    changeMethod(e, i) {
        this.setRuleValue(e.target.value, i, "method", this.changed)
    }
    setPath(e, i, callback=null) {
        this.setRuleValue(e, i, "path", callback)

    }
    setRuleValue(e, i, key, callback) {
        let rad = this.props.rules[i]
        rad[key] = e
        let rules = this.props.rules
        rules[i] = rad
        this.setState({
            rules: rules
        }, callback)
    }

    setOutputs(e, i, callback=null) {
        this.setRuleValue(e, i, "outputs", callback)
    }

    setRedirect(e, i) {
        this.setRuleValue(!e, i, "follow_redirects", this.changed)
    }
    setComment(e, i, callback=null) {
        this.setRuleValue(e, i, "comment", callback)
    }
    setBody(e, i, callback=null) {
        this.setRuleValue(e,i, "body", callback)
    }

    setExpression(e, i, callback=null) {
        this.setRuleValue(e,i, "expression", callback)
    }
    setName(e, i, callback=null) {
        this.setRuleValue(e, i, "name", callback)
    }

    getValue(d) {
        return "r" + d
    }
    getHeader(rule, i) {
        let d = rule.id
        let jj = <MinusCircleOutlined onClick={() => this.remove(d)} />
        if (this.props.rules.length == 1) {
            jj = ""
        }
        return (
            <>
                <Row>
                    <Col span={5}>
                        <Input addonBefore="Rule" placeholder='名称' size="small" value={rule.name} style={{ paddingRight: 0 }} onChange={(e)=>this.setName(e.target.value, i)} onBlur={(e) => {this.setName(e.target.value, i, this.changed);}} />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={14}>
                        <Input placeholder='点击输入注释' bordered={false} size="small" style={{ paddingRight: 0 }} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={2}>{jj}</Col>
                </Row>
            </>
        )
    }
    render() {
        return (
            <>
                <Collapse activeKey={this.state.activeKey} onChange={(v) => this.handleChange(v)}>
                    {
                        this.props.rules.map((rule, i) => {
                            return (
                                <Panel
                                    header={
                                        this.getHeader(rule, i)
                                    }
                                    key={rule.id}
                                    collapsible="icon"
                                    style={{ backgroundColor: "#f7f7f7" }}
                                >
                                    <Divider orientationMargin="0" orientation="left" style={{ margin: "1% 0"}} plain>Request</Divider>

                                    <Row>
                                        <Col span={24} style={{ textAlign: "left" }}>
                                            <Radio.Group value={rule.method} buttonStyle="solid" size="small" onChange={(e) => this.changeMethod(e, i)}>
                                                <Radio.Button value="GET">GET</Radio.Button>
                                                <Radio.Button value="POST">POST</Radio.Button>
                                                <Radio.Button value="PUT">PUT</Radio.Button>
                                                <Radio.Button value="OPTIONS">OPTIONS</Radio.Button>
                                                <Radio.Button value="DELETE">DELETE</Radio.Button>
                                                <Radio.Button value="CONNECT">CONNECT</Radio.Button>
                                                <Radio.Button value="TRACE">TRACE</Radio.Button>
                                                <Radio.Button value="PATCH">PATCH</Radio.Button>
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: '1%' }}>
                                        <Col span={18}>
                                            <Input style={{marginBottom:"0.5%"}} addonBefore="path" size='small' value={rule.path} className='single-input' allowClear defaultValue="/" onChange={(e) => this.setPath(e.target.value, i)} onBlur={(e) => {this.setPath(e.target.value, i, this.changed);}}></Input>

                                        </Col>
                                        <Col span={6}>
                                            <Switch checkedChildren="跟随重定向" unCheckedChildren="不跟随重定向" checked={rule.follow_redirects}  onChange={(e) => this.setRedirect(!e, i)} />
                                        </Col>
                                    </Row>
                                    {/* <Divider orientationMargin="40px" orientation="left" style={{ margin: "1% 0" }} plain>Headers</Divider> */}
                                    <Row>
                                        <Col span={24}>
                                            <HeaderInput handleHeaderChange={(e) => {
                                                // todo 告诉上级修改了，this.form change , this.changed
                                                this.setRuleValue(e, i, "headers",this.changed)

                                            }} headers={rule.headers}
                                            />
                                        </Col>
                                    </Row>
                                    {/* <Divider orientationMargin="40px" orientation="left" style={{ margin: "1% 0" }} plain>Request Body</Divider> */}
                                    <Row>
                                        <Col span={24}>
                                            <TextArea value={rule.body} placeholder='请求体（body）' rows={4} onChange={(e)=>this.setBody(e.target.value, i)} onBlur={(e) => {this.setBody(e.target.value, i, this.changed);}} style={{margin:"1% 0"}} />
                                        </Col>
                                    </Row>
                                    <Divider orientationMargin="0" orientation="left" style={{ margin: "0" }} plain>Expression</Divider>

                                    <Row style={{ marginTop: '1%' }}>
                                        <Col span={24}>
                                            <AutoComplete
                                                value={rule.expression}
                                                onChange={(e)=>this.setExpression(e, i)}
                                                onBlur={(e) => {this.setExpression(e.target.value, i, this.changed);}}
                                                children={
                                                    <Input />
                                                }
                                                style={{ width: "100%" }}
                                                options={options}
                                                placeholder="表达式"
                                                filterOption={(inputValue, option) =>
                                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Divider orientationMargin="0" orientation="left" style={{ margin: "1% 0" }} plain>Output</Divider>
                                    <Row>
                                        <Col span={24}>
                                            <OutputInput handleOutputChange={(e) => {
                                                // todo 告诉上级修改了，this.form change , this.changed
                                                this.setRuleValue(e, i, "outputs",this.changed)

                                            }} outputs={rule.outputs} />
                                        </Col>
                                    </Row>
                                </Panel>
                            )
                        })
                    }
                </Collapse>
                <Button id='scroll-bottom' type="primary" block icon={<PlusOutlined />} onClick={() => this.add()} style={{ marginTop: '-7px', borderRadius: "0 0" }}>增 加 规 则</Button>
            </>

        )
    }
}

export default Rule