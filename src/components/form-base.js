import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
const BaseForm = (props) => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onValuesChange = (values) => {
    props.onName(values[props.labelName])
  }
  return (
    <Form
      name="basic"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 20,
      }}
      initialValues={{"Name":"poc-yaml-"}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      onValuesChange={onValuesChange}
      labelAlign="left"
    >
      <Form.Item
        label={props.labelName}
        name={props.labelName}
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
        
      >
        <Input  />
      </Form.Item>
    </Form>
  );
};
export default BaseForm;