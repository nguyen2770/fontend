import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert, Row, Col, Card, notification } from "antd";
import { Link } from "react-router-dom";
import { LockOutlined, MailOutlined, ApartmentOutlined } from "@ant-design/icons";
import useAuth from "../../contexts/authContext";
import "./auth.scss";
import loginBackground from "../../assets/images/login-background.jpg";
import LogoPng from "../../assets/images/logo2.png";
import * as _unitOfWork from "../../api";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [form] = Form.useForm();
  const { login } = useAuth();

  const onFinish = async (values) => {
    const { username, password, companyCode } = values;
    const payload = {
      username,
      password,
    };
    let res = await _unitOfWork.auth.login({
      ...payload,
    });
    if (res && res.tokens) {
      login(res);
    }
  };

  return (
    <div
      className="account-pages"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="login-card">

        <div className="d-flex justify-center">
          <img src={LogoPng} className="logo-cmms mb-4" />
        </div>
        <div className="pt-0 pt-4 pl-3 pr-3">
          <Form
            labelWrap
            name="login"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* {errorMsg && <Alert className="mb-3" message={errorMsg} type="error" />} */}
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Tên đăng nhập không được để trống!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Tên đăng nhập"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Mật khẩu không được để trống!" },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Ghi nhớ</Checkbox>
            </Form.Item>

            <Form.Item className="mt-3">
              <Button
                block
                size="large"
                className="bt-green"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <div className="mt-4 info justify-center">
            <p className="text-center">© {new Date().getFullYear()}. Created with <i className="mdi mdi-heart text-danger"></i> by MediCMMS</p>
          </div>
        </div>
      </div>

      {/* </Col>
      </Row> */}
    </div>
  );
};

export default Login;
