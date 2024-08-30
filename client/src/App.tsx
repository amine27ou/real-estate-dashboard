import { RouterProvider } from 'react-router-dom'
import './app.css'
import { route } from './router/route'

function App() {

  return (
    <div>
      <RouterProvider router={route} />
    </div>
  )
}

export default App
