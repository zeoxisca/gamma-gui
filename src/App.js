import './App.css';
import 'antd/dist/reset.css';
import './App.css';
import  Home  from './components/home'
import React from 'react';


import {  notification } from 'antd';

const Context = React.createContext({
  name: 'Default',
});

const App = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement, description,type="info") => {
    api[type]({
      message: placement,
      description: description,
      placement: "bottomRight",
    });
  };

  const contextValue = React.useMemo(
    () => ({
      name: 'BigBigForm',
    }),
    [],
  );
  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
  <div className="App">
    <Home notify={(msg, desc, type)=>openNotification(msg, desc, type)}/>
  </div>
</Context.Provider>)
};
export default App;