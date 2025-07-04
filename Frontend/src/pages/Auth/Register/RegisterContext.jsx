import { createContext, useContext, useState } from 'react';

const RegisterContext = createContext();

export function RegisterProvider({ children }) {
  const [data, setData] = useState({
  /* -------- Account -------- */
  username: '',
  email: '',
  password: '',
  /* -------- Personal -------- */
  firstName: '',
  lastName: '',
  dob: '',
  /* -------- Adresse -------- */
  street: '',
  zip: '',
  city: '',
  country: 'DE',
  /* -------- Führerschein -------- */
  licenseNo: '',
  licenseCountry: 'DE',
  licenseIssue: '',
  licenseExpiry: '',
  licenseFile: null,
  /* -------- Zahlung -------- */
  payType: 'card',   //  card | sepa | paypal
  cardNo: '',
  cardExp: '',
  cardCvc: '',
  iban: '',
  bic: '',
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