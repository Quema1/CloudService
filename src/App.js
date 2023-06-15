import logo from './logo.svg';
import './App.css';
import Backendless from 'backendless'
import {useEffect, useState} from "react";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import MainPage from './components/mainPage.js';
import ReactDOM from "react-dom";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
import Registration from "./components/registration";
import Friends from "./components/friends";
import Profile from "./components/profile";
import Login from "./components/login";
import Geolocation from "./components/geolocation";
import Feedback from "./components/feedback";

function App() {

    const [currentUser, setCurrentUser] = useState()
    console.log(currentUser)
    useEffect(() => {
        Backendless.UserService.getCurrentUser().then(response => {
            setCurrentUser(response)
        })
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/register" element={<Registration/>}/>
                    <Route path="/friends" element={<Friends/>}/>
                    <Route path="/geo" element={<Geolocation/>}/>
                    <Route path="/feedback" element={<Feedback/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
