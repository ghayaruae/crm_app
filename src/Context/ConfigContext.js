import React, { createContext, useEffect, useState } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [apiURL] = useState('https://crmapis.ghayar.com/');
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [business_salesman_id] = useState(localStorage.getItem("business_salesman_id"));
  const [apiHeaderJson] = useState({ 'Content-Type': "application/json", token: `${token}`, 'business_salesman_id': business_salesman_id, 'user-id': business_salesman_id })
  const [apiHeaderFile] = useState({ 'Content-Type': "multipart/form-data", token: `${token}`, 'business_salesman_id': business_salesman_id, 'user-id': business_salesman_id })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const primaryColor = '#000000';

  const handleUpdateLogin = (data, permissions) => {
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('business_salesman_id', data.business_salesman_id);

  }


  const selectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#000000",
    },
  });

  const selectStyle = {
    control: (styles, state) => {
      return {
        ...styles,
        backgroundColor: "#fff",
      };
    },
  };

  var vals = {
    apiURL,
    token,
    apiHeaderJson,
    apiHeaderFile,
    handleUpdateLogin,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    primaryColor,
    selectStyle,
    selectTheme,
    business_salesman_id,
  };

  return (
    <ConfigContext.Provider value={vals}>
      {children}
    </ConfigContext.Provider>
  );
};
