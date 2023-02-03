import React from 'react';
import { Row, Col, Spin, Space, Button, Input, Segmented, Select, Popconfirm } from 'antd';
import yaml from 'js-yaml';
import Rule from './form-rule';
import './form.css';
import SetInput from './variables';
const pp = {
    "全部命中": " && ",
    "命中其一": " || ",
    "自定义": " && ",
}

function getFormSet(variables) {
    let res = {}
    for (let i = 0; i < variables.length; i++) {
        res[variables[i].key] = variables[i].value
    }
    return res
}

function getRuleHeaders(headers) {
    //todo
    let res = {}
    for (let i = 0; i < headers.length; i++) {
        res[headers[i].key] = headers[i].value
    }
    return res
}
function getFormRules(rules) {
    let res = {}
    for (let i = 0; i < rules.length; i++) {
        let r = {}
        let temp = {}
        temp.method = rules[i].method
        temp.path = rules[i].path
        temp.follow_redirects = rules[i].follow_redirects
        if (rules[i].headers.length > 0) {
            temp.headers = getRuleHeaders(rules[i].headers)
        }
        if (rules[i].body !== "") {
            temp.body = rules[i].body
        }
        r.request = temp
        r.expression = rules[i].expression
        if (rules[i].outputs.length > 0) {
            r.output = getRuleHeaders(rules[i].outputs)
        }
        res[rules[i].name] = r
    }
    return res
}

function generateYaml(form) {
    let res = {}
    res.name = form.name
    res.transport = "http"
    if (form.variables.length > 0) {
        res.set = getFormSet(form.variables)
    }
    res.rules = getFormRules(form.rules)
    res.expression = form.expression
    res.detail = form.detail
    let out = yaml.dump(res)
    return out
}



function generateForm(y) {

    let form = {
        name: "poc-yaml-",
        variables: [],
        detail: {
            "author": "f",
            "links": [],
        },
        rules: [
            {
                "id": 0, "method": "GET", "path": "/", "follow_redirects": false, "outputs": [], "body": "", "name": "r0",
                "expression": "response.status == 200",
                "headers": [],
                "comment": "",
            }
        ],
        expression: "",
        expressionState: "全部命中"
    };
    let res = {}
    try {
        res = yaml.load(y)
        for (let key in res) {
            if (key === "rules") {
                let temp = []
                let c = 0
                for (let k in res[key]) {
                    let t = res[key][k]
                    temp.push({
                        "id": c,
                        "method": t.request.method,
                        "path": t.request.path,
                        "follow_redirects": t.request.follow_redirects,
                        "outputs": t.output ? Object.entries(t.output).map((o, i) => ({
                            id: i,
                            key: o[0],
                            value: o[1],
                        })) : [],
                        "body": t.request.body ? t.request.body : "",
                        "name": k,
                        "expression": t.expression ? t.expression : "",
                        "headers": t.request.headers ? Object.entries(t.request.headers).map((o, i) => ({
                            id: i,
                            key: o[0],
                            value: o[1],
                        })) : [],
                        "comment": "",
                    })
                    c += 1
                }
                form["rules"] = temp;
                continue
            }
            if (key === "set") {
                form["variables"] = Object.entries(res[key]).map((o, i) => ({
                    id: i,
                    key: o[0],
                    value: o[1],
                }));
                continue
            }
            form[key] = res[key]
            if (key === "detail") {
                form[key].author = form[key].author ? form[key].author : ""
                form[key].links = form[key].links ? form[key].links : []
            }
        }
    } catch (error) {
        return null
    }
    return form
}

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.form = generateForm(props.code);
        this.state = {
            code: props.code,
            confirm: false,
            name: this.form.name,
            variables: this.form.variables,
            detail: this.form.detail,
            rules: this.form.rules,
            form: this.form,
            disableExpression: true,
            expression: this.form.expression,
            expressionState: "全部命中",
            checkContent: "检 查 规 则"
        }
    }

    checked = () => {
        this.setState({ checkContent: "检 查 规 则" });
    }

    componentWillReceiveProps(nextProps) {
        let form = generateForm(nextProps.code);
    
        this.setState({
            name: form.name,
            variables: form.variables,
            detail: form.detail,
            rules: form.rules,
            form: form,
            expression: form.expression,
            code: nextProps.code
        })
      }


    checkForm = (form) => {
        if (typeof form.name !== "string") {
            return false
        }
        if (!(form.variables instanceof Array)) {
            return false
        }
        if (!(form.detail instanceof Object)) {
            return false
        }
        if (!(form.detail.links instanceof Array)) {
            return false
        }
        if (typeof form.detail.author !== "string") {
            return false
        }
        if (!(form.rules instanceof Array)) {
            return false
        }
        if (!(form.rules[0] instanceof Object)) {
            return false
        }
        if (!(form.rules[0].outputs instanceof Array)) {
            return false
        }

        return true
    }


    copyYaml = (code) => {
        const el = document.createElement("textarea")
        document.body.appendChild(el)
        el.value=code
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        this.props.notify("Success!", "成功复制到剪贴板了")
    }

    formChange = (key, value) => {
        let form = this.state.form
        form[key] = value
        this.setState({ form: form }, this.props.codeUpdate(generateYaml(form)));
    }

    getExpression() {
        let e = this.state.form.rules.map((r) => r.name + "()").join(pp[this.state.expressionState]);
        if (e !== this.state.expression) {
            this.setState({ expression: e }, this.changed("expression", e));
        }
        return e
    }
    generateForm(change) {
        this.form.name = change.name
        this.form.detail = change.detail
        this.form.rules = change.rules
        return this.form
    }
    changed(key, value) {
        this.formChange(key, value)
    }
    setDetail(key, value) {
        let details = this.state.form.detail
        details[key] = value
        this.setState({ detail: details });
    }
    setName(value) {
        value = value.toLowerCase()
        this.setState({ name: value });
    }
    setRule(rule) {
        this.setState({ rules: rule }, () => this.changed("rules", rule))
    }

    setField(id, value) {
        let dom = document.getElementById(id);
        if (dom) {
            dom.value = value
        }
    }

    setVariables(variable) {
        this.setState({ variables: variable }, () => this.changed("variables", variable))
    }


    render() {
        return (
            <>
                <Row style={{ width: '100%', height: '100%', backgroundColor: "white", padding: "1.6% 1.6%", borderRadius: '10px 10px', boxShadow: '1px 1px 2px #888888' }}>
                    <Col span={16} style={{ maxHeight: '100%' }}>
                        <Row style={{ overflow: "auto" }} >
                            <Col span={24} style={{ height: '100%' }} >
                                <Row>
                                    <Col span={24}>
                                        <Input id="name" size="small" value={this.state.name} addonBefore="name" className='single-input' allowClear onChange={(e) => { this.setName(e.target.value) }} onBlur={(e) => {this.changed("name", e.target.value)}}></Input>
                                    </Col>
                                </Row>
                                {/* <Divider orientationMargin="0" orientation="left" style={{ margin: "1% 0"}} plain>Detail</Divider> */}

                                <Row>
                                    <Space.Compact block size="small">
                                        <Input placeholder="作者" style={{ width: "30%" }} id="author" size="small" value={this.state.form.detail.author} allowClear className='single-input' onChange={(e) => { this.setDetail("author", e.target.value) }} onBlur={()=>{this.changed("detail", this.state.detail)}}></Input>

                                        <Select size="small" allowClear children={(<Input addonBefore="test" />)} placeholder="相关链接" mode='tags' maxTagCount="responsive" style={{ width: "100%" }} value={this.state.form.detail.links} options={this.state.form.detail.links.map((link) => ({ label: link, value: link }))} onChange={(e) => { this.setDetail("links", e) }}  onBlur={()=>{this.changed("detail", this.state.detail)}}/>

                                    </Space.Compact>

                                </Row>
                            </Col>
                        </Row>
                        <Row style={{ height: 'calc(100% - 58px - 72px)', marginBottom: '5px', borderRadius: '10px 10px', boxShadow: '1px 1px 1px #2b2b2b2b' }}>
                            <Col span={24} style={{ height: '100%', maxHeight: '100%', borderRadius: '10px 10px', overflowY: 'auto' }}>
                                <Rule handleChange={(e) => this.setRule(e)} rules={this.state.form.rules} notify={this.props.notify}></Rule>
                            </Col>

                        </Row>
                        <Row >
                            <Col span={24} style={{ marginBottom: "8px" }}>
                                <Segmented block options={["全部命中", "命中其一", "自定义"]} onChange={
                                    (e) => {
                                        if (e === "自定义") {
                                            this.setState({ disableExpression: false, expressionState: e })
                                        } else {
                                            let temp = this.state.form.rules.map((r, i) => r.name + "()").join(pp[e]);
                                            this.setState({ disableExpression: true, expressionState: e, expression: temp }, this.changed("expression", temp))
                                        }
                                    }
                                } />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Input value={this.state.expressionState != "自定义" ? this.getExpression() : this.state.expression} addonBefore="expression" disabled={this.state.disableExpression} allowClear className='single-input' onChange={(e) => this.setState({ expression: e.target.value }, this.changed("expression", e.target.value))}></Input>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8} style={{ height: "100%", paddingLeft: 5 }}>
                        <Row style={{
                            height: "calc(100% - 72px)", maxHeight:
                                "calc(100% - 72px)", overflowY: 'auto', marginBottom: '5px'
                        }}>
                            <Col span={24} style={{ paddingBottom: '1%' }}>
                                <SetInput handleHeaderChange={(e) => {
                                    // todo 告诉上级修改了，this.form change , this.changed
                                    this.setVariables(e)
                                }} variables={this.state.form.variables} />
                            </Col>
                        </Row>
                        <Row >
                            <Col span={24}>
                                <Space direction="vertical" style={{ width: '100%', bottom: 0 }}>
                                    <Button danger block onClick={() => { this.setState({ checkContent: <><Spin /></> });this.props.checkYaml(this.checked);}} >{this.state.checkContent}</Button>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="是时候冲了！去CTSTACK提交吧！"
                                        open={this.state.confirm}
                                        onConfirm={() => { window.open("https://stack.chaitin.com/security-challenge/poc/editor") }}
                                        onCancel={() => this.setState({ confirm: false })}
                                    >
                                        <Button onClick={() => { this.setState({ confirm: true }, ()=>{this.copyYaml(this.state.code)}); }} block>
                                            复制 YAML
                                        </Button>
                                    </Popconfirm>

                                </Space>
                            </Col>
                        </Row>
                    </Col>


                </Row>
            </>
        );
    }
}

export default Form;