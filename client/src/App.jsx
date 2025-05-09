import { Routes , Route } from "react-router-dom";
import "./app.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./Layout";
import axios from 'axios';
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";


axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function app() {
 
  return (
    <UserContextProvider>
       <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<IndexPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/account' element={<ProfilePage/>}/>
      <Route path='/account/places' element={<PlacesPage/>}/>
      <Route path='/account/places/new' element={<PlacesFormPage/>}/>
      <Route path='/account/places/:id' element={<PlacesFormPage/>}/>
      <Route path='/place/:id' element={<PlacePage/>}/>
      {/* <Route path='/account/bookings' element={<AccountPage/>}/>
      <Route path='/account/places' element={<AccountPage/>}/> */}
      </Route>
    </Routes>

    </UserContextProvider> 
  );
}

export default app;
