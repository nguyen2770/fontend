import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import { parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";
const userLocal = JSON.parse(localStorage.getItem("USER"));

const CalibrationWorkComment = () => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const params = useParams();
  const [page] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGetSchedulePreventiveComment();
    const interval = setInterval(() => {
      fetchGetSchedulePreventiveComment();
    }, 20000);

    return () => clearInterval(interval);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const fetchGetSchedulePreventiveComment = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      calibrationWork: params?.id,
    };
    let res = await _unitOfWork.calibrationWork.getCalibrationWorkComments(
      payload
    );
    if (res && res.code === 1) {
      setComments(res.result?.results);
      setTotalRecord(res.result?.totalResults);
    }
  };
  const handleSend = async () => {
    if (!input.trim()) return;
    const payload = {
      calibrationWork: params.id,
      comments: input,
    };
    const res = await _unitOfWork.calibrationWork.createCalibrationWorkComment(
      payload
    );
    if (res && res.code === 1) {
      setInput("");
      fetchGetSchedulePreventiveComment();
    }
  };

  return (
    <div
      style={{
        background: "#f7f9fb",
        borderRadius: 8,
        padding: 16,
        minHeight: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 16,
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {comments &&
          Array.isArray(comments) &&
          [...comments].reverse().map((c) => {
            const isMe = c.createdBy.id === userLocal.id;
            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  marginBottom: 12,
                }}
              >
                <Avatar
                  style={{
                    background: isMe ? "#1677ff" : "#bfbfbf",
                    margin: "0 8px",
                    color: "#fff",
                  }}
                >
                  {c.createdBy?.username?.[0] || ""}
                </Avatar>
                <div
                  style={{
                    maxWidth: 400,
                    background: isMe ? "#4285f4" : "#e6f4ff",
                    color: isMe ? "#fff" : "#222",
                    borderRadius: 12,
                    padding: "10px 16px",
                    position: "relative",
                    wordBreak: "break-word",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 15 }}>{c?.comments}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isMe ? "#e0e0e0" : "#000000",
                      textAlign: "right",
                      marginTop: 4,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>
                      {c.createdBy?.username}
                    </span>{" "}
                    - {parseDateHH(c?.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={inputRef} />
      </div>
      <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
        <Input.TextArea
          rows={2}
          maxLength={500}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("preventive.comment.placeholder")}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ resize: "none" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 8,
            gap: 8,
          }}
        >
          <span style={{ color: "#888", alignSelf: "center" }}>
            {t("preventive.comment.counter", { current: input.length })}
          </span>
          <Button onClick={() => navigate(-1)}>
            {t("preventiveSchedule.buttons.cancel")}
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            {t("preventive.buttons.send")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationWorkComment;
