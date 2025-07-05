import { Routes, Route, Navigate } from 'react-router-dom';
import { RegisterProvider } from './RegisterContext.jsx';
import StepAccount  from './StepAccount.jsx';
import StepPersonal from './StepPersonal.jsx';
import StepLicense  from './StepLicense.jsx';
import StepPayment  from './StepPayment.jsx';

export default function RegisterWizard() {
  return (
    <RegisterProvider>
      <div className="flex justify-center py-10">
        <div className="w-full max-w-md bg-white shadow rounded p-6">

          <Routes>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account"  element={<StepAccount />}  />
            <Route path="personal" element={<StepPersonal />} />
            <Route path="license"  element={<StepLicense />}  />
            <Route path="payment"  element={<StepPayment />}  />
          </Routes>

        </div>
      </div>
    </RegisterProvider>
  );
}
