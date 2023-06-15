import React, {useEffect, useState} from "react";
import Backendless from "backendless";
import '../styles/geolocation-styles.css';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
import {Link} from "react-router-dom";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

function Geolocation() {

    const [user, setUser] = useState({})
    const [geolocations, setGeolocations] = useState([])
    const [description, setDescription] = useState('')
    const [longitude, setLongitude] = useState('')
    const [latitude, setLatitude] = useState('')
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });


    function handleMoveEnd(position) {
        setPosition(position);
    }

    const getUser = async () => {
        try{
            setUser(await Backendless.UserService.getCurrentUser())
        } catch(err) {
            console.error(err)
        }
    }

    const fetchData = async () => {
        const data = await Backendless.Data.of('Place').find()
        data.forEach(place => {
            if(user.objectId === place.ownerId) {
                place.isOwn = true
            }
        })
        setGeolocations(data)
        console.log(data)
    }
    const [point, setPoint] = useState({})
    const addPlace = async () => {
        try {
            const geoData = {
                "type": "Point",
                "coordinates": [
                    longitude,
                    latitude
                ]
            }
            await Backendless.Data.of("Place").save({location: `POINT (${point.x} ${point.y})`, description: point.description, x: point.x, y: point.y})

            setDescription('')
            setLongitude('')
            setLatitude('')
        } catch(err) {
            Backendless.Logging.setLogReportingPolicy( 1, 1 );
            Backendless.Logging.getLogger('add-geo-place').error(err.message)
            console.log(err)
        }
    }

    const findByDescription = async () => {
        try {
            const whereClause = `description = '${point.description}'`
            const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause)
            const data = await Backendless.Data.of('Place').find(queryBuilder)
            setGeolocations(data)
            setDescription('')
        } catch(err) {
            console.log(err)
        }
    }

    const deletePlace = async (placeId, placeOwner) => {
        try {
            console.log(user.objectId, placeOwner)
            if(user.objectId === placeOwner) {
                const res = await Backendless.Data.of('Place').remove({objectId: placeId})
                alert('Place was removed')
            } else {
                alert('You are not a owner of this place')
            }
        } catch(err) {
            console.log(err)
        }
    }

    const likePlace = async objectId => {
        try {
            const place = geolocations.filter(place => place.objectId === objectId)
            await Backendless.Data.of('Place').save({
                objectId,
                likes: place[0].likes + 1
            })
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser()
    })

    return (
        <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="bottom">
                <Link to="/"><p>Go back</p></Link>
                <div className="geolocations-container">
                    <div className="content">
                        <div className="">
                            <label htmlFor="description">Description</label>
                            <input placeholder="description" type="text" value={point.description} onChange={(e) => setPoint({...point, description: e.target.value})}/><br /><br />

                            <label htmlFor="longitude">Longitude</label>
                            <input placeholder="x" type="text" value={point.x} onChange={(e) => setPoint({...point, x: e.target.value})}/><br /><br />

                            <label htmlFor="latitude">Latitude</label>
                            <input placeholder="y" type="text" value={point.y} onChange={(e) => setPoint({...point, y: e.target.value})}/><br /><br />

                        </div>
                        <div className="buttons">
                            <button onClick={addPlace}>Add</button>
                            <button onClick={findByDescription}>Find by description</button>
                            <button onClick={fetchData}>Get places</button>
                        </div>
                        <div className="place-container">
                            {geolocations.map((geolocation, index) => {
                                return (
                                    <div>
                                        <div className="place-content" key={index}>
                                            <div>{geolocation.isOwn? 'Own': ''}</div>
                                            <div>{geolocation.description}</div>
                                            <div className="geo-data">
                                                <div>Longitude: {geolocation.x}</div>
                                                <div>Latitude: {geolocation.y}</div>
                                            </div>
                                            <button onClick={() => deletePlace(geolocation.objectId, geolocation.ownerId)}>Delete</button>
                                            <button onClick={() => likePlace(geolocation.objectId)}>Like It</button>
                                            <div>
                                                <p>Likes - {geolocation.likes}</p>
                                            </div>
                                        </div>
                                        <ComposableMap>
                                            <ZoomableGroup
                                                zoom={position.zoom}
                                                center={position.coordinates}
                                                onMoveEnd={handleMoveEnd}
                                            >
                                                <Geographies geography={geoUrl}>
                                                    {({ geographies }) =>
                                                        geographies.map(geo => (
                                                            <Geography key={geo.rsmKey} geography={geo} />
                                                        ))
                                                    }
                                                </Geographies>
                                                <Marker coordinates={[geolocation.x, geolocation.y]}>
                                                    <circle r={4} fill="#F53" />
                                                </Marker>
                                            </ZoomableGroup>
                                        </ComposableMap>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Geolocation