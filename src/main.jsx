import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './routes/Error.jsx'
import Home from './routes/Home.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import { UserProvider } from '../context/UserContext' // Import UserProvider

const router = createBrowserRouter([
  {
    path:'/', element:<App/>,
    errorElement:<Error/>,

    children:[
      {path:'/', element:<Home/>},
      {path:'/register', element:<Register/>},
      {path:'/login', element:<Login/>}
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* Wrap your app with UserProvider */}
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>,
)