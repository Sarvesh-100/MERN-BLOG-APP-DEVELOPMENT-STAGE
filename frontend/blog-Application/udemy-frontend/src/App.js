import { BrowserRouter,Routes,Route } from 'react-router-dom'
import AddNewCategory from './component/Category/AddNewCategory';
import HomePage from './component/homePage/HomePage';
import Navbar from './component/Navigation/Navbar';
import Login from './component/Users/Login/Login';
import Register from './component/Users/Register/Register'

function App() {
  return (
    <BrowserRouter >
      <Navbar />
    <Routes>
      <Route path="/add-category" element={<AddNewCategory/>}/>
      <Route path="/" element={<HomePage />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
