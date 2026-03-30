import { Modal, Button, Tooltip } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import * as _unitOfWork from "../../../api";

const QRCodeModal = ({ id, handleCancel, open }) => {
  const [qrCodeImage, setQrCodeImage] = useState();

  useEffect(() => {
    if(open === true){

      getQrCodeIamgeByID();
    }
  }, [open,id])

  const getQrCodeIamgeByID = async() => {
    const item =  await _unitOfWork.sparePart.getSparePartById({id})
    console.log(id)
    if (item) {
      setQrCodeImage(item.qrCodeImage)
    }
  }

  return (
    <>
      <Modal
        open={open}
        title="QR Code"
        footer={null}
        onCancel={handleCancel}
      >
        {qrCodeImage ? (
          <img
            src={qrCodeImage}
            alt="QR Code"
            style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}
          />
        ) : (
          <p>Không có mã QR.</p>
        )}
      </Modal>
    </>
  );
};

export default QRCodeModal;
