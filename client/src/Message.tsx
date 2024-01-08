import React from "react";

function Message(props: { verified: boolean; }) {
  const messageDetails = props.verified ? 'has not' : 'has';

  return (
    <div
      style={{
        color: "red"
      }}
    >
      <div>Your data {messageDetails} been compromised</div>
    </div>
  );
}

export default Message;
