import React, { useState } from "react";
import { Select, Input, Button, Space, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../helper/search-select-helper";

const CustomSelectAdd = ({
    value,
    onChange,
    options = [],
    placeholder,
    onAdd,
    loading = false,
    disabled = false,
    labelKey = "name",
    valueKey = "id",
    maxLength = 250,
    allowClear = true,
    ...rest
}) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        if (inputValue.trim()) {
            onAdd(inputValue);
            setInputValue("");
        }
    };

    return (
        <Select
            {...rest}
            value={value}
            onChange={onChange}
            disabled={disabled}
            loading={loading}
            allowClear={allowClear}
            showSearch
            placeholder={placeholder}
            filterOption={filterOption}
            options={options?.map((item) => ({
                value: item[valueKey] || item.value,
                label: item[labelKey] || item.label,
            }))}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <div style={{ padding: "0 8px 4px" }}>
                        <Space>
                            <Input
                                placeholder={t("assetModel.model.fields.add_new")}
                                value={inputValue}
                                maxLength={maxLength}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Button
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                disabled={!inputValue.trim()}
                            >
                            </Button>
                            <div>{`${inputValue.length}/${maxLength}`}</div>
                        </Space>
                    </div>
                </>
            )}
        />
    );
};

export default CustomSelectAdd;