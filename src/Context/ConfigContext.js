import React, { createContext, useEffect, useState } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [apiURL] = useState('https://crmapis.ghayar.com/');
  const [dcapiurl] = useState('https://dcapi.carz7.com/')
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [business_salesman_id] = useState(localStorage.getItem("business_salesman_id"));
  const [apiHeaderJson] = useState({ 'Content-Type': "application/json", token: `${token}`, 'business_salesman_id': business_salesman_id, 'business-salesman-id': business_salesman_id, business_salesman_id: business_salesman_id })
  const [apiHeaderFile] = useState({ 'Content-Type': "multipart/form-data", token: `${token}`, 'business_salesman_id': business_salesman_id, 'business-salesman-id': business_salesman_id, business_salesman_id: business_salesman_id })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const primaryColor = '#132530';

  const handleUpdateLogin = (data) => {
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('business_salesman_id', data.business_salesman_id);

  }

  const statusOptions = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Assigned" },
    { value: "2", label: "Accepted" },
    { value: "3", label: "Packed" },
    { value: "4", label: "Shipped" },
    { value: "5", label: "Delivered" },
    { value: "6", label: "Cancelled" },
    { value: "7", label: "Returned" },
    { value: "8", label: "Returned Collected" },
    { value: "9", label: "Returned Received" },
  ];

  const selectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#132530",
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
    dcapiurl,
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
    statusOptions
  };

  return (
    <ConfigContext.Provider value={vals}>
      {children}
    </ConfigContext.Provider>
  );
};
