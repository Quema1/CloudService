import React, {useEffect, useState} from "react";
import Backendless from "backendless";
import { useNavigate } from 'react-router-dom';

function Registration(){

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [country, setCountry] = useState("")
    const [gender, setGender] = useState("")
    const [birthday, setBirthday] = useState("")
    const navigate = useNavigate()
    const signUp = () => {
        const user = new Backendless.User()
        user.email = email
        user.password = password
        user.name = name
        user.age = age
        user.country = country
        user.gender = gender
        user.birthday = birthday
        user.friends = []
        Backendless.UserService.register(user).then((response) => {
            Backendless.Files.upload("reg.txt", `users/${name}`)
            Backendless.Files.upload("reg.txt", `users/${name}/sharedWithMe`)
            Backendless.Files.upload("reg.txt", `users/${name}/MyFiles`)
        })
        navigate('/login', { replace: true })
    }

    return (
        <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="bottom">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    Registration
                    <input style={{margin: '10px', width: '10%'}} placeholder="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)}
                           value={password}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="name" onChange={(e) => setName(e.target.value)} value={name}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="age" onChange={(e) => setAge(e.target.value)} value={age}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="country" onChange={(e) => setCountry(e.target.value)} value={country}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="gender" onChange={(e) => setGender(e.target.value)} value={gender}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="birthday" onChange={(e) => setBirthday(e.target.value)} value={birthday}/>
                    <button style={{margin: '10px', width: '10%'}} onClick={signUp}>Register</button>
                </div>
            </div>
        </div>
    )
}
export default Registration;