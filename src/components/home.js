import React from 'react';
import { Layout, Menu } from 'antd';
import './home.css';
import Edit from "./editor"
import Form from "./form"
import axios from 'axios'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { QuestionCircleOutlined, SyncOutlined, SaveOutlined, FormOutlined,RollbackOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';



const { Header, Content, Footer, Sider } = Layout;


// const items1= ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));


function getSavedState(pos="poc") {
  let res = {
    code: `name: ${pos}-yaml-
transport: http
rules:
  r0:
    request:${pos=="finger"?`\n      cache: true`:``}
      method: GET
      path: /
      follow_redirects: false
    expression: response.status == 200
expression: r0()
detail:
  author: ''
  links: []
  ${pos=="finger"?`fingerprint:\n    infos:\n      - type: web_application\n`:``}      `,
  }
  let t = localStorage.getItem(pos+"SaveStatus")
  if (t != null && t != "") {

    res.code = JSON.parse(t).code
  }
  res.pos = pos
  return res
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...getSavedState(window.location.pathname==="/"?"poc":"finger"),
      editChanged: false,
      steps: [],
    }
  }


  checkYaml = (code, after = null) => {
    axios.post("/check", {
      "gamma": btoa(code)
    }).then((res => {
      if (after !== null) {
        after()
      }
      if (res.status !== 200) {
        console.log("failed")
        this.props.notify("Failed!", "网络错误，无法校验！")
      }
      let data = res.data
      if (data.code === -1) {
        console.log("failed")
        this.props.notify("Failed!", "格式有误，无法校验 ↓", "error")
        this.props.notify("Note:", res.data.msg, "error")

      } else if (data.code === 0) {
        console.log("right")
        this.props.notify("Success!", "格式正确，没有重复！快去交！", "success")
      } else {
        this.props.notify("Incorrect!", "有点问题，赶紧修 ↓", "warning")
        let sCount = 0
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].startsWith("Get similar poc")) {
            sCount += 1
            continue
          }
          let t = res.data.data[i].split(":")
          this.props.notify(`Note ${t[0]}`, t[1], "error")
        }
        if (sCount > 0) {
          this.props.notify("Note:", `有${sCount}个poc和你的作品很像！`, "warning")
        }
      }

    })).catch(() => { after(); this.props.notify("Error:", `网络请求失败`, "error") })
  }

  updateSteps = (code) => {
    let steps = this.state.steps;
    steps.push(code);
    if (steps.length >= 30) {
      steps = steps.slice(1)
    }
    return steps;
  }

  loadLastStep = () => {
    let steps = this.state.steps;
    if (steps.length <= 0) {
      return
    }
    let t = steps[steps.length - 1]
    this.setState({ code: t, steps: steps.slice(0, steps.length - 1) })
  }

  codeUpdate = (code) => {
    this.setState({ code: code, steps: this.updateSteps(this.state.code) })
  }

  items1 = [{
    "key": "base",
    label: `XRAY 规则实验室`,
  },{
    "key": "poc",
    label: <Link to="/" onClick={()=>{this.codeUpdate(getSavedState()["code"]);this.setState({pos:"poc", steps:[]})}}>写poc</Link>,
  },{
    "key": "new",
    label: <a href="https://stack.chaitin.com/tool/detail?id=96" target="_blank"> 试试本地版 </a>
  }
  ]

  render() {
    return (
      <BrowserRouter>
      <Layout style={{ height: '100%' }}>
        <Header className="header" style={{ height: "6%" }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={this.items1} />
        </Header>
        <Content style={{ padding: '0 2%', height: '100%' }}>
          <Layout className="site-layout-background" style={{ padding: '1% 0', height: '100%' }}>

            <Content style={{ minHeight: 280, height: '100%', marginRight: '0.5%' }}  >

              <Routes>
                <Route path="/" element={<Form notify={this.props.notify} code={this.state.code} codeUpdate={this.codeUpdate} checkYaml={(after) => this.checkYaml(this.state.code, after)} ></Form>} />
                {/*<Route path="/finger" element={<FormFinger notify={this.props.notify} code={this.state.code} codeUpdate={this.codeUpdate} checkYaml={(after) => this.checkYaml(this.state.code, after)} ></FormFinger>} />*/}
              </Routes>
              {/* <Form notify={this.props.notify} code={this.state.code} codeUpdate={this.codeUpdate} checkYaml={(after) => this.checkYaml(this.state.code, after)} ></Form> */}
            </Content>
            <Sider theme="light" className="site-layout-background" width={"35%"} style={{ height: '100%', borderRadius: '10px 10px', boxShadow: '1px 1px 2px #888888', overflow: "hidden auto" }}>
              <Edit code={this.state.code} finishYaml={this.codeUpdate} />
            </Sider>
          </Layout>
        </Content>
        <FloatButton.Group shape="square" style={{ right: 40, bottom: 40 }}>
          <FloatButton icon={<RollbackOutlined />} tooltip="回到上一次同步" onClick={() => { this.loadLastStep();}} />
          <FloatButton icon={<QuestionCircleOutlined />} tooltip="看看教程" target="_blank" href="https://docs.xray.cool/#/guide/high_quality_poc" />
          <FloatButton icon={<FormOutlined />} tooltip="我要反馈" target="_blank" href="https://stack.chaitin.com/tool/detail?id=91" />
          <FloatButton icon={<SyncOutlined />} tooltip="重置页面" onClick={() => { localStorage.removeItem(this.state.pos+"SaveStatus"); window.location.reload(); }} />
          <FloatButton icon={<SaveOutlined />} tooltip="暂时保存" onClick={() => { localStorage.setItem(this.state.pos+"SaveStatus", JSON.stringify({ code: this.state.code })); this.props.notify("保存成功"); }} />
        </FloatButton.Group>
        <Footer style={{ height: '2%', textAlign: 'center', paddingTop: '0', paddingBottom: '1%' }}>Xray Team@Chaitin Tech</Footer>
      </Layout>
      </BrowserRouter>

    )
  }
}

export default Home;
