import React   from "react";
import EmojiIcons from "../../images/emoji.png"
import AtachFileIcons from "../../images/attach-file.png"
import VoiceIcon from "../../images/voice.png"
import SentMessageIcon from "../../images/paper.png"

export default function SentMessageBar(){


    return(
      <section>
       
        <div className="sent-message-bar">
          <div></div>
        <div className="sent-message-section-container">
          <div className="sent-message-section-icons">
            <img src={EmojiIcons} alt="emoji-icon" />
            <img src={AtachFileIcons} alt="atach-file-icon" />
            <img src={VoiceIcon} alt="voice-icon" />
          </div>
          <input
          className="input-sent-message"
            type="text"
            placeholder="Type a message..."
          />
          <div className="sentMessage-icon-cont">
            <img className="sentMessage-icon" src={SentMessageIcon} alt="aent-message-icon" />
          </div>
        </div>
      </div>
      </section>
    );
}