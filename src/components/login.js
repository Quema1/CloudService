import React, {useEffect, useState} from "react";
import Backendless from "backendless";
import {Link, useNavigate} from 'react-router-dom';


function Login(){
    const [signInEmail, setSignInEmail] = useState("")
    const [signInPassword, setSignInPassword] = useState("")
    const [currentUser, setCurrentUser] = useState()
    console.log(currentUser)
    useEffect(() => {
        Backendless.UserService.getCurrentUser().then(response => {
            setCurrentUser(response)
        })
    }, [])
    const login = () => {
        Backendless.UserService.login(signInEmail, signInPassword, true).then((response) => {
            console.log(response)
            navigate('/', { replace: true })
        }).catch((e) => {
            Backendless.Logging.getLogger("SingIn").error(e.message)
        })
    }
    const restoreAccount = () => {
        Backendless.UserService.restorePassword(signInEmail.email).then((response) => {
            console.log(response)
        })
    }
    const navigate = useNavigate()
    return (
        <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="bottom">

                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div> Login </div>
                    <input style={{margin: '10px', width: '10%'}} placeholder="email" onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="password" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword}/>

                    <button style={{margin: '10px', width: '10%'}} onClick={login}>Login</button>
                    <button style={{margin: '10px', width: '10%'}} onClick={restoreAccount}>Restore password</button>
                </div>
                <Link to="/register"><p>Don't have an account? click to Sign up</p></Link>
            </div>
        </div>
    )
}
export default Login;
