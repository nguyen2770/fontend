import { Tooltip, Button, message } from "antd";
import { LinkOutlined } from "@ant-design/icons";

export default function CopyLink({ text, title, detail }) {
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        message.success("Copied");
    };

    return (
        <Tooltip title={title}>
            <Button
               
                type="default"
                icon={<LinkOutlined />}
                onClick={handleCopy}
                className="ml-2 mr-2"
                
            />
            {detail}
        </Tooltip>
    );
}