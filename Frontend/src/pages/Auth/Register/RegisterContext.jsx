import { createContext, useContext, useState } from 'react';

const RegisterContext = createContext();

export function RegisterProvider({ children }) {
  const [data, setData] = useState({
    username: '', email: '', password: '',
    firstName: '', lastName: '', dob: '', phone: '',
    street: '', zip: '', city: '', country: 'DE',
    licenseNo: '', licenseCountry: 'DE',
    licenseIssue: '', licenseExpiry: '', licenseFile: null,
    payType: 'card', cardNo: '', cardExp: '', cardCvc: '', iban: '',
  });

  const update = (partial) => setData((prev) => ({ ...prev, ...partial }));

  return (
    <RegisterContext.Provider value={{ data, update }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {                      // Hook
  const ctx = useContext(RegisterContext);
  if (!ctx) throw new Error('useRegister must be used inside RegisterProvider');
  return ctx;
}