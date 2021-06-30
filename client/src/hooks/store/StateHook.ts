import { useState } from 'react';
import * as actionTypes from './actionTypes';

interface IPayload {
  test?: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const StateHook = () => {
  const [test, setTest] = useState(null as unknown as any | null);

  const actions = (action: { type: string; payload: IPayload }) => {
    const { type, payload } = action;

    switch (type) {
      case actionTypes.setTest:
        return setTest(payload.test!);
      case actionTypes.resetState:
        return () => {
          setTest(null);
        };
    }
  };

  const globalState = {
    test
  };

  return { globalState, actions };
};

export default StateHook;
