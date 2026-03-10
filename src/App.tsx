/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ModelTrainingForm from './components/ModelTrainingForm';
import TrainingHistory from './components/TrainingHistory';
import TrainingLogs from './components/TrainingLogs';
import TrainingChart from './components/TrainingChart';
import ProductRemodelingDashboard from './components/ProductRemodelingDashboard';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-50 p-8">
        <ProductRemodelingDashboard />
        <ModelTrainingForm />
        <TrainingChart />
        <TrainingHistory />
        <TrainingLogs />
      </div>
    </ToastProvider>
  );
}
