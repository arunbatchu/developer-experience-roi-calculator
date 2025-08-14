# Developer Experience ROI Calculator

An interactive dashboard that implements AWS's Cost to Serve Software (CTS-SW) framework for calculating ROI on developer experience investments.

## Project Structure

```
src/
├── components/
│   ├── calculator/     # Main calculator components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # Business logic and calculations
├── types/             # TypeScript interfaces and types
├── utils/             # Utility functions and constants
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Core Data Models

- **Scenario**: Represents a calculation scenario with developer metrics
- **CalculationResults**: Contains ROI calculations and supporting metrics
- **CalculationStep**: Individual steps in the calculation breakdown
- **ValidationErrors**: Input validation error handling

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **PostCSS** for CSS processing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## AWS CTS-SW Framework

This calculator implements Amazon's proven methodology that achieved 15.9% cost reduction:

- **Traditional Business Model**: Cost Avoidance = Total Developer Cost × CTS-SW Improvement %
- **Tech Company Model**: Includes gross margin improvement and profit impact calculations

## Next Steps

1. Implement calculation engine (Task 2)
2. Build input validation system (Task 3)
3. Create UI components (Tasks 4-6)
4. Add scenario management (Tasks 8-9)
5. Implement visualizations (Task 11)