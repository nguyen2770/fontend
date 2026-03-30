import React, { useEffect, useState } from "react";
import * as QRCode from "qrcode"; // dùng kiểu import này để tránh lỗi
import useHeader from "../../../contexts/headerContext";

const QRTest = ({ size = 300 }) => {
  const [qrUrl, setQrUrl] = useState("");
  const data = "ok"; // Dữ liệu mẫu, có thể thay đổi theo nhu cầu
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Notification Configuration")
  }, [])
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(data, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: size,
        });
        setQrUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQR();
  }, [data, size]);

  return qrUrl ? <img src={qrUrl} alt="QR Code" /> : <p>Đang tạo mã QR...</p>;
};

export default QRTest;
