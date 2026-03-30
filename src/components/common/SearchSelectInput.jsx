import { Input, Select, Form, Space } from "antd";
import { filterOption } from "../../helper/search-select-helper";

const SearchSelectInput = ({
  form,
  name = "searchValue",
  fieldValue,
  onFieldChange,
  options,
  placeholderMap,
  selectWidth = "35%",
  inputWidth = "65%",
}) => {
  return (
    <Space.Compact block>
      <Select
        value={fieldValue}
        style={{ width: selectWidth }}
        onChange={(value) => {
          onFieldChange(value);
          form?.setFieldValue(name, "");
        }}
        options={options}
        allowClear
        filterOption={filterOption}
        showSearch={true}
      />

      <Form.Item name={name} noStyle>
        <Input
          style={{ width: inputWidth }}
          placeholder={placeholderMap?.[fieldValue]}
        />
      </Form.Item>
    </Space.Compact>
  );
};

export default SearchSelectInput;
