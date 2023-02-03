import React from 'react';
import { Row, Col, Button, Popover, Input, Space } from "antd"
import { MinusCircleOutlined } from '@ant-design/icons'


class SetInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            variables: props.variables,
            count: Object.keys(props.variables).length,
        }
    }

    changed() {
        let object = this.state.variables
        this.props.handleHeaderChange(object)
    }

    add() {
        let variables = this.props.variables;
        variables.push({ id: this.state.count, key: "", value: "" })
        this.setState({ variables: variables, count: this.state.count + 1 }, this.changed)
    }

    addRandInt(l) {
        let variables = this.props.variables;
        variables.push({ id: this.state.count, key: "rInt"+this.state.count, value: `randomInt(${Math.pow(10, l-1)}, ${Math.pow(10, l)-1})` })
        this.setState({ variables: variables, count: this.state.count + 1 }, this.changed)
    }

    addRandString(l) {
        let variables = this.props.variables;
        variables.push({ id: this.state.count, key: "rStr"+this.state.count, value: `randomLowercase(${l})` })
        this.setState({ variables: variables, count: this.state.count + 1 }, this.changed)
    }


    remove(i) {
        let variables = this.props.variables;
        variables = variables.slice(0, i).concat(variables.slice(i + 1))
        this.setState({ variables: variables }, this.changed)
    }

    setKey(value, i, callback=()=>{}) {
        let variables = this.props.variables;
        variables[i].key = value
        this.setState({ variables: variables }, callback)
    }

    setValue(value, i, callback=()=>{}) {
        let variables = this.props.variables;
        variables[i].value = value
        this.setState({ variables: variables }, callback)
    }

    getContent() {
        return (
            <Row>
                <Space>
            <Button style={{width: "100%"}} type="primary" size='small' ghost block onClick={() => this.addRandInt(5)}>
                random int(5)
            </Button><Button style={{width: "100%"}} type="primary" size='small' ghost block onClick={() => this.addRandString(8)}>
                random string(8)
            </Button></Space>
            </Row>
        )
    }

    render() {
        return (
            <Row>
                {
                    this.props.variables.map((header, i) => {
                        return (
                            <Col span={24} style={{ marginBottom: "0.5%" }} key={header.id}>
                                <Row>
                                    <Col span={8}>
                                        <Input
                                            size='small'
                                            value={header.key}
                                            placeholder="Key"
                                            onChange={(e) => this.setKey(e.target.value, i)} onBlur={() => this.setKey(header.key, i, this.changed)}
                                        />
                                    </Col>
                                    <Col span={14}>
                                        <Input size='small' value={header.value} placeholder="Value" onChange={(e) => this.setValue(e.target.value, i)} onBlur={() => this.setValue(header.value, i, this.changed)} />
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined onClick={() => this.remove(i)} style={{ lineHeight: "110%" }} />
                                    </Col>
                                </Row>
                            </Col>
                        )
                    })
                }
                <Col span={24} style={{ marginBottom: "0.5%" }}>
                    <Popover content={this.getContent()} placement="bottomRight" >
                        <Button type="primary" size='small' ghost block onClick={() => this.add()}>
                            增 加 变 量
                        </Button>
                    </Popover>

                </Col>

            </Row>
        )
    }
}

export default SetInput