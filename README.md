# 🌌 Asteroid Impact Simulator

An interactive web application that simulates asteroid impacts using real NASA data and scientific calculations. Explore the devastating effects of asteroids, test mitigation strategies, and visualize impact scenarios in real-time.

![Asteroid Impact Simulator](https://via.placeholder.com/800x400/1e293b/3b82f6?text=Asteroid+Impact+Simulator)

## ✨ Features

### 🎯 Real-Time Simulation
- **Interactive 2D Map**: Click anywhere to change impact location and visualize damage zones
- **3D Orbital Visualization**: Watch asteroid trajectories and orbital mechanics with Three.js
- **Real-Time Calculations**: All metrics update instantly as you adjust parameters

### 📊 Scientific Calculations
- **Impact Energy**: Kinetic energy in megatons of TNT equivalent
- **Crater Dimensions**: Diameter and depth based on empirical formulas
- **Damage Zones**: Shockwave radius (20+ psi) and thermal radiation zones
- **Seismic Effects**: Estimated earthquake magnitude (Richter scale)
- **Population Impact**: Estimated affected population based on location
- **Tsunami Modeling**: Wave height calculations for ocean impacts

### 🛡️ Mitigation Strategies
Test real planetary defense technologies:
- **Kinetic Impactor** (DART-style missions)
- **Nuclear Standoff Burst**
- **Gravity Tractor**
- **Ion Beam Shepherd**

Each strategy includes:
- Success probability calculations
- Trajectory deflection metrics
- Energy reduction estimates
- Required warning time

### 🌍 Real NASA Data
- Integration with NASA NEO (Near-Earth Object) API
- Real asteroid parameters (diameter, velocity, orbital data)
- Historical impact scenarios (Chicxulub, Tunguska, Chelyabinsk, etc.)

### 💾 Data Persistence
- Save and load simulations
- Recent simulations history
- Supabase database integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asteroid-impact-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🎮 How to Use

### Basic Simulation
1. **Adjust Parameters**: Use sliders to modify asteroid diameter, velocity, and entry angle
2. **Choose Location**: Click on the map or use lat/lon sliders to set impact point
3. **View Results**: Check the results panel for detailed impact metrics

### Load Real Asteroids
1. Click on the "Load Real Asteroid Data" dropdown
2. Select from real NEO objects tracked by NASA
3. Parameters will automatically populate with real data

### Test Mitigation
1. Select a mitigation strategy from the dropdown
2. Adjust warning time (years before impact)
3. View success probability and deflection results
4. Watch the 3D visualization show the trajectory change

### Historical Scenarios
1. Click the "History" button
2. Select from famous historical impacts
3. Explore what-if scenarios

### Save & Load
1. Click "Save" to store your simulation
2. Access saved simulations from the "History" panel
3. Load previous simulations to continue exploring

## 🔬 Scientific Basis

### Impact Calculations
- **Mass Calculation**: Based on diameter assuming average asteroid density (3000 kg/m³)
- **Energy Formula**: Kinetic energy E = ½mv² converted to TNT equivalent
- **Crater Scaling**: Based on Collins et al. (2005) empirical relationships
- **Seismic Magnitude**: Correlation with impact energy using established formulas

### Mitigation Models
- **Kinetic Impactor**: Momentum transfer calculations with ejecta factor
- **Nuclear Devices**: Energy coupling efficiency models
- **Gravity Tractor**: Gravitational force calculations over time
- **Ion Beam**: Ablation thrust modeling

### Limitations
These are simplified models for educational purposes. Real impacts would depend on:
- Asteroid composition and structure
- Atmospheric entry effects
- Local geology and topography
- Ocean depth (for water impacts)
- Many other factors

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Leaflet** for 2D interactive maps
- **Three.js** for 3D orbital visualization
- **Lucide React** for icons

### Backend & Data
- **Supabase** for database and real-time data
- **NASA NEO API** for real asteroid data
- PostgreSQL with Row Level Security

### Build Tools
- **Vite** for fast development and optimized builds
- **ESLint** for code quality
- **TypeScript** for type safety

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ControlPanel.tsx    # Parameter controls
│   ├── ResultsPanel.tsx    # Impact metrics display
│   ├── ImpactMap.tsx       # 2D Leaflet map
│   └── OrbitalSimulation.tsx # 3D Three.js visualization
├── services/            # Business logic
│   ├── impactCalculations.ts   # Impact physics
│   ├── mitigationService.ts    # Deflection strategies
│   ├── nasaService.ts          # NASA API integration
│   └── supabaseClient.ts       # Database client
├── App.tsx             # Main application
└── index.css           # Global styles
```

## 🌐 Deployment

This application can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Render**

The Supabase backend is already configured and deployed.

## 📚 Educational Use

This simulator is designed for:
- **STEM Education**: Understanding planetary defense
- **Science Communication**: Visualizing impact scenarios
- **Research**: Exploring mitigation strategies
- **Public Awareness**: Asteroid threat awareness

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- More sophisticated atmospheric entry models
- Enhanced population density maps
- Additional mitigation technologies
- Multi-asteroid scenarios
- Mobile optimization

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **NASA NEO Program** for asteroid data
- **Planetary Defense Community** for impact models
- **DART Mission** for kinetic impactor inspiration
- **Collins et al.** for crater scaling relationships

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Disclaimer**: This is an educational tool using simplified scientific models. Real asteroid impact scenarios would require much more sophisticated analysis by planetary defense experts.

**Data Sources**: NASA NEO API, scientific literature on impact physics and planetary defense.
