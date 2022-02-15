import React from 'react';
import './App.css';
import { AppEventProvider } from './context/AppEvent';
import { FileZone } from './projects/File/FileZone';
import { ClipContextProvider } from './context/ClipsContext';
import { Main } from './projects/Main';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WorkspaceProvider } from './context/workspace/WorkspaceContext';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { theme } from './theme';

function App() {
  return (
    <div className="App">
      <AppEventProvider>
        <ThemeProvider theme={theme}>
          <ClipContextProvider>
            <WorkspaceProvider>
              <DndProvider backend={HTML5Backend}>
                <FileZone />
                <Main />
              </DndProvider>
            </WorkspaceProvider>
          </ClipContextProvider>
        </ThemeProvider>
      </AppEventProvider>
    </div>
  );
}

export default App;
