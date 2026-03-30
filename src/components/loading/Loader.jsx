import { Spin } from "antd";
import { useAxiosLoader } from "../../api/restApi";

export default function Loader() {
  const loading = useAxiosLoader();
  return (
    loading && (
      <div className="loading-main">
        <Spin />
      </div>
    )
  );
}