import './App.css'
import { CalculatorDashboard } from './components/calculator/CalculatorDashboard.js'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <CalculatorDashboard />
      </div>
    </div>
  )
}

export default App
