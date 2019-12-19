import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { ipcRenderer } from "electron";
import { genericAsyncActions, genericAsyncReducer } from "../../reducers";

export const useListenToDataUpdatesViaIpc = (receiver, listener) => {
  useEffect(() => {
    ipcRenderer.on(receiver, listener);

    return () => ipcRenderer.removeListener(receiver, listener);
  }, [listener, receiver]);
};

export const useRequestDataViaIpc = receiver => {
  const [state, dispatch] = useReducer(genericAsyncReducer, {
    data: null,
    isLoading: false,
    isErr: false,
  });

  const listener = useCallback((_, payload) => {
    dispatch({ type: genericAsyncActions.END_REQUEST, payload });
  }, []);

  useListenToDataUpdatesViaIpc(receiver, listener);

  const requestDataViaIpc = useCallback((requester, ...args) => {
    dispatch({ type: genericAsyncActions.BEGIN_REQUEST });

    ipcRenderer.send(requester, ...args);
  }, []);

  return [state, requestDataViaIpc];
};

export const useDisable = seconds => {
  const timeoutId = useRef();
  const [isDisabled, setIsDisabled] = useState(false);

  function disable() {
    setIsDisabled(previousIsDisabled => !previousIsDisabled);

    const oneSecondInMilliseconds = 1000;

    timeoutId.current = setTimeout(() => {
      setIsDisabled(previousIsDisabled => !previousIsDisabled);
    }, seconds * oneSecondInMilliseconds);
  }

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  return [isDisabled, disable];
};

export const useDisplay = () => {
  const [elementIsVisible, setShowElement] = useState(false);

  const timeout = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, [timeout]);

  const displayElement = () => setShowElement(true);

  const hideElementAfterMsElapsed = milliseconds => {
    timeout.current = setTimeout(() => {
      setShowElement(false);
    }, milliseconds);
  };

  return [elementIsVisible, displayElement, hideElementAfterMsElapsed];
};
