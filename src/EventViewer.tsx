import React, { useContext } from 'react';
import { AppEvent, AppEventContext } from './context/AppEvent';
import styles from './EventViewer.module.css';

const Event: React.FC<{ event: AppEvent }> = ({ event }) => {
  return (
    <div className={styles.event}>
      <div className={styles.time}>{event.time.toLocaleTimeString()}</div>
      {event.message}
    </div>
  );
};

export const EventViewer: React.FC = () => {
  const { events } = useContext(AppEventContext);
  return (
    <div className={styles.eventArea}>
      {events.map((it, i) => (
        <Event key={i} event={it} />
      ))}
    </div>
  );
};
