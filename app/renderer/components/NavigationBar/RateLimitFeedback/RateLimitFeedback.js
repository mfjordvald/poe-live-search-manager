import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";
import { useRateLimitFeedbackStyles } from "./RateLimitFeedback.style";

export default () => {
  const classes = useRateLimitFeedbackStyles;

  const [requestsExhausted, setRequestsExhausted] = useState(false);

  function rateLimitStatusChangeListener(event, currentStatus) {
    setRequestsExhausted(currentStatus);
  }

  useEffect(() => {
    ipcRenderer.on(
      ipcEvents.RATE_LIMIT_STATUS_CHANGE,
      rateLimitStatusChangeListener
    );

    return () =>
      ipcRenderer.removeListener(
        ipcEvents.RATE_LIMIT_STATUS_CHANGE,
        rateLimitStatusChangeListener
      );
  }, []);

  function buildMessage() {
    if (requestsExhausted) {
      return "Requests reached rate limit. There may be a delay in displaying results. You can try to reduce the number of searches or results.";
    }

    return "Requests within rate limit.";
  }

  return (
    <Tooltip title={buildMessage()} sx={ classes.tooltip }>
      {requestsExhausted ? (
        <WarningIcon sx={ classes.warningIcon } />
      ) : (
        <CheckCircleIcon sx={ classes.checkCircleIcon } />
      )}
    </Tooltip>
  );
};
