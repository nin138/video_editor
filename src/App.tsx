import React from 'react';
import './App.css';
import styles from './App.module.css';
import { VideoControl } from './video/VideoControl';
import { AppEventProvider } from './context/AppEvent';
import { EventViewer } from './EventViewer';
import { FileZone } from './projects/File/FileZone';
import { SelectedVideoContextProvider } from './context/VideoUrl';
import { ClipContextProvider } from './context/Clips';

function App() {
  return (
    <div className="App">
      <AppEventProvider>
        <SelectedVideoContextProvider>
          <ClipContextProvider>
            <FileZone />
            <main className={styles.main}>
              <VideoControl />
              <EventViewer />
            </main>
          </ClipContextProvider>
        </SelectedVideoContextProvider>
      </AppEventProvider>
    </div>
  );
}

export default App;
