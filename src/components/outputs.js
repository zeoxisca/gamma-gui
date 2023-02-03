import React from 'react';
import { Row, Col, Button, Input } from "antd"
import { MinusCircleOutlined } from '@ant-design/icons'

class OutputInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            outputs: props.outputs,
            count: Object.keys(props.outputs).length,
        }
    }

    // 把更改向上层传递
    changed(e) {
        let object = this.state.outputs
        this.props.handleOutputChange(object)
    }

    add() {
        let outputs = this.props.outputs;
        outputs.push({ id: this.state.count, key: "", value: "" })
        this.setState({ outputs: outputs, count: this.state.count + 1 }, ()=>{this.changed()})
    }

    remove(i) {
        let outputs = this.props.outputs;
        outputs = outputs.slice(0, i).concat(outputs.slice(i + 1))
        this.setState({ outputs: outputs }, this.changed)
    }
    
    changeOutput(pos, value, i, callback=()=>{}) {
        let outputs = this.props.outputs;
        outputs[i][pos] = value
        this.setState({outputs:outputs}, callback)
    }
    

    render() {
        return (
            <Row>
                {
                    this.props.outputs.map((output, i) => {
                        return (
                            <Col span={24} style={{marginTop: "0.5%" }} key={output.id}>
                                <Row>
                                    <Col span={6}>
                                        <Input size='small' value={output.key} placeholder="Output Key" onChange={(e)=>this.changeOutput("key", e.target.value, i)} onBlur={(e)=>{this.changeOutput("key", output.key, i, this.changed)}} />

                                    </Col>
                                    <Col span={1}>
                                        :
                                    </Col>
                                    <Col span={15}>
                                        <Input size='small' value={output.value} placeholder="Output value" onChange={(e)=>this.changeOutput("value", e.target.value, i)} onBlur={()=>{this.changeOutput("value", output.value, i, this.changed)}} />
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined onClick={() => this.remove(i)} />
                                    </Col>
                                </Row>
                            </Col>
                        )
                    })
                }
                <Col span={24} style={{ marginTop: "0.5%" }}>
                    <Button type="primary" size='small' ghost block onClick={() => this.add()}>
                        增 加 输 出
                    </Button>
                </Col>
            </Row>
        )
    }
}

export default OutputInput