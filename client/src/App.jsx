import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewCars from './pages/ViewCars'
import EditCar from './pages/EditCar'
import CreateCar from './pages/CreateCar'
import CarDetails from './pages/CarDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    { path: '/', element: <CreateCar /> },
    { path: '/customcars', element: <ViewCars /> },
    { path: '/customcars/:id', element: <CarDetails /> },
    { path: '/edit/:id', element: <EditCar /> }
  ])

  return (
    <div className='app'>
      <Navigation />
      {element}
    </div>
  )
}

export default App