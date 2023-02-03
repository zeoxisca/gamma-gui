import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import React from 'react';

const CombineForm = (props) => {
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  return (
    <>
      <Form name="dynamic_form_nest_item" onFinish={onFinish} onChange={onFinish} autoComplete="off">
        <Form.List name="sets">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, props.firstname]}
                    rules={[
                      {
                        required: true,
                        message: 'Missing ' + props.firstname,
                      },
                    ]}
                    style={{
                      display: 'flex',
                      marginBottom: 0,
                      marginTop: 0,
                    }}
                  >
                    <Input placeholder={props.firstname} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, props.secondname]}
                    rules={[
                      {
                        required: true,
                        message: 'Missing ' + props.secondname,
                      },
                    ]}
                    style={{
                      display: 'flex',
                      marginBottom: 5,
                      marginTop: 0,
                    }}
                  >
                    <Input placeholder={props.secondname} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" onClick={() => {
                  add();
                }
                } block icon={<PlusOutlined />}>
                  {props.buttonLabel}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      <div id="scroll-line"></div>
    </>
  );
};

export default CombineForm;