import React, { useState } from "react";
import { Button } from "antd";
import { Select } from "antd";
import { Checkbox } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function GeneralTab() {
  const [contracts, setContracts] = useState([
    {
      name: "hợp đồng 1",
      expiry: true,
      mandatory: true,
      verification: false,
      stopService: false,
      insurance: false,
    },
  ]);

  const handleCheckboxChange = (index, field) => {
    const updated = [...contracts];
    updated[index][field] = !updated[index][field];
    setContracts(updated);
  };

  const handleSelectChange = (index, value) => {
    const updated = [...contracts];
    updated[index].name = value;
    setContracts(updated);
  };

  const addContract = () => {
    setContracts([
      ...contracts,
      {
        name: "",
        expiry: false,
        mandatory: false,
        verification: false,
        stopService: false,
        insurance: false,
      },
    ]);
  };

  const removeContract = (index) => {
    const updated = contracts.filter((_, i) => i !== index);
    setContracts(updated);
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button icon={<PlusOutlined />} onClick={addContract}>
          Add Contract
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 2fr 1fr 1fr 2fr 1fr",
          fontWeight: "bold",
          marginBottom: 8,
          backgroundColor:"white",
          padding:"7px"
        }}
      >
        <div>Name</div>
        <div>Expiry / Renewal Date</div>
        <div>Mandatory</div>
        <div>Verification</div>
        <div>Stop Service</div>
        <div>Insurance</div>
        <div>Action</div>
      </div>

      {contracts.map((contract, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 2fr 1fr 1fr 2fr 1fr",
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <Select
            value={contract.name}
            onChange={(value) => handleSelectChange(index, value)}
            style={{ width: "90%" }}
          >
            <Option value="hợp đồng 1">hợp đồng 1</Option>
            <Option value="hợp đồng 2">hợp đồng 2</Option>
          </Select>
          <Checkbox
            checked={contract.expiry}
            onChange={() => handleCheckboxChange(index, "expiry")}
          />
          <Checkbox
            checked={contract.mandatory}
            onChange={() => handleCheckboxChange(index, "mandatory")}
          />
          <Checkbox
            checked={contract.verification}
            onChange={() => handleCheckboxChange(index, "verification")}
          />
          <Checkbox
            checked={contract.stopService}
            onChange={() => handleCheckboxChange(index, "stopService")}
          />
          <Checkbox
            checked={contract.insurance}
            onChange={() => handleCheckboxChange(index, "insurance")}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => removeContract(index)}
            type="text"
            danger
          />
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary">Save</Button>
      </div>
    </div>
  );
}
