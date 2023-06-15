import React, {useEffect, useState} from "react";
import Backendless from "backendless";
import {Link, useNavigate} from 'react-router-dom';

function Profile(){
    const [currentUser, setCurrentUser] = useState()
    const [geo, setGeo] = useState({longitude: 0, latitude: 0})
    const navigate = useNavigate()
    console.log(currentUser)
    useEffect(() => {
        Backendless.UserService.getCurrentUser().then(response => {
            setCurrentUser(response)
        })
    }, [])
    const updateUser = () => {
        Backendless.UserService.update(currentUser).then((response) => {
            console.log(response)
        })
    }
    const getGeo = () => {
        const newGeo = {}
        navigator.geolocation.getCurrentPosition(position => {
            Backendless.Data.of('Users').save({
                objectId: currentUser.objectId,
                myLocation: {
                    "type": "Point",
                    "coordinates": [
                        position.coords.longitude,
                        position.coords.latitude
                    ]
                }

            })
            newGeo.longitude = position.coords.longitude
            newGeo.latitude = position.coords.latitude
            setGeo(newGeo)
        })
    }
        useEffect(  () => {

            const fetchData = async () => {
                setInterval(async () => {
                    await getGeo()

                }, 15000)

            }

            fetchData()
        })
    return(
        <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="bottom">
                <div className="text" style={{marginBottom: '30px'}}>
                    My location:
                    <p>Longitude: {geo.longitude}</p>
                    <p>Latitude: {geo.latitude}</p><br />
                </div>
                <div className="text" style={{marginBottom: '30px'}}>
                    Update profile
                </div>
                {currentUser && (
                    <div>
                        <div>
                            <label htmlFor="age">Age:</label>
                            <input
                                id="age"
                                value={currentUser.age}
                                onChange={(e) => setCurrentUser({...currentUser, age: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="country">Country:</label>
                            <input
                                id="country"
                                value={currentUser.country}
                                onChange={(e) => setCurrentUser({...currentUser, country: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="gender">Gender:</label>
                            <input
                                id="gender"
                                value={currentUser.gender}
                                onChange={(e) => setCurrentUser({...currentUser, gender: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                id="name"
                                value={currentUser.name}
                                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                            />
                        </div>
                        <button onClick={updateUser}>Update profile</button>
                    </div>
                )}
            </div>
            <Link to="/"><p>Go back</p></Link>
        </div>
    )
}
export default Profile;