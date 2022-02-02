import React, { useState } from 'react';

export interface AppEvent {
  time: Date;
  message: string;
}

interface Context {
  events: AppEvent[];
  dispatch: (message: string) => void;
}

export const AppEvents = {
  WriteFileFromURL: {
    message: '動画データの読み取り開始',
  },
  ClipVideo: {
    message: '動画データの切り抜き開始',
  },
  ReadFile: {
    message: '動画データの引き出し開始',
  },
  Error: {
    message: 'エラー起きちゃった',
  },
};

export const AppEventContext = React.createContext<Context>({
  events: [],
  dispatch: () => {},
});

export const AppEventProvider: React.FC = ({ children }) => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const context: Context = {
    events,
    dispatch: (message) =>
      setEvents((events) => [...events, { message, time: new Date() }]),
  };
  return (
    <AppEventContext.Provider value={context}>
      {children}
    </AppEventContext.Provider>
  );
};
