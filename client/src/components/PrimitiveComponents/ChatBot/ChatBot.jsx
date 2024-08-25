import React, { useState } from "react";
import "./ChatBot.css";
import { useDispatch } from "react-redux";
import { setChatBotClose } from "../../../reducers/chatBotReducer";
import WindowControlButton from "../WindowControlButton/WindowControlButton";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

export default function ChatBot() {
  const dispatch = useDispatch();
  const [chatBotMinimized, setChatBotMinimized] = useState(false);

  const closeChatBot = () => {
    dispatch(setChatBotClose());
  };

  return (
    <div className="chatBot">
      <ButtonComponent
        type="button"
        action={() => setChatBotMinimized(false)}
        className="default-button chatBot-trigger"
      >
        <span class="material-symbols-outlined">forum</span>
      </ButtonComponent>
      {!chatBotMinimized && (
        <div className="chatBot-content">
          <div className="chatBot-heading">
            <h3>Chat</h3>{" "}
            <div className="chatBot-control-buttons">
              <WindowControlButton
                icon="remove"
                action={() => setChatBotMinimized(true)}
              />
              <WindowControlButton icon="close" action={closeChatBot} />
            </div>
          </div>
          <div className="chatBot-body">
            <span>feature coming soon</span>
          </div>
        </div>
      )}
    </div>
  );
}
