import logo from './logo.svg';
import './App.css';
import Backendless from 'backendless'
import {useEffect, useState} from "react";

function App() {

    Backendless.serverURL = "https://api.backendless.com";
    Backendless.initApp('7B31A8E3-8458-32C6-FF76-8E255EC2A200', '5796BBB4-5C71-4A34-93E1-E2E1EF3442F1');

    const [currentUser, setCurrentUser] = useState()
    console.log(currentUser)
    useEffect(() => {
        Backendless.UserService.getCurrentUser().then(response => {
            setCurrentUser(response)
        })
    }, [])

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [country, setCountry] = useState("")
    const [gender, setGender] = useState("")
    const [birthday, setBirthday] = useState("")

    const signUp = () => {
        const user = new Backendless.User()
        user.email = email
        user.password = password
        user.name = name
        user.age = age
        user.country = country
        user.gender = gender
        user.birthday = birthday
        user.friends = [{"id": "65EAA0C8-5F1C-4148-A7CD-C243BBDB481C", "accept": true}, {
            "id": "3776B1A1-3B7C-4BC0-9511-A06622D0C330",
            "accept": false
        }]
        Backendless.UserService.register(user).then((response) => {
            Backendless.Files.upload("reg.txt", `users/${name}`)
            Backendless.Files.upload("reg.txt", `users/${name}/sharedWithMe`)
        })
    }

    const [signInEmail, setSignInEmail] = useState("")
    const [signInPassword, setSignInPassword] = useState("")

    const login = () => {
        Backendless.UserService.login(signInEmail, signInPassword, true).then((response) => {
            console.log(response)
        }).catch((e) => {
            Backendless.Logging.getLogger("SingIn").error(e.message)
        })
    }

    const restoreAccount = () => {
        Backendless.UserService.restorePassword(signInEmail.email).then((response) => {
            console.log(response)
        })
    }

    const [image, setImage] = useState("")
    const [deleteFileName, setDeleteFileName] = useState("")
    const [images, setImages] = useState()
    const createFile = () => {
        Backendless.Files.upload(image, `users/${currentUser.name}`).then((response) => {
            console.log(response)
        }).catch((e) => {
            Backendless.Logging.getLogger("createFile").error(e.message)
        })
    }
    const deleteFile = () => {
        Backendless.Files.remove(`users/${currentUser.name}/${deleteFileName}`)
    }
    const getList = () => {
        Backendless.Files.listing(`users/${currentUser.name}`).then((response) => {
            setImages(response)
        })
    }

    const updateUser = () => {
        Backendless.UserService.update(currentUser).then((response) => {
            console.log(response)
        })
    }
    const [point, setPoint] = useState({})
    const saveGeoPoint = () => {
        Backendless.Data.of("Place").save({
            location: `POINT (${point.x} ${point.y})`,
            description: point.description,
            image: point.image
        }).then((response) => {

        }).catch((e) => {
            Backendless.Logging.getLogger("GeoPoint").error(e.message)
        })
    }

    const [findUser, setFindUser] = useState()
    const [userId, setUserId] = useState("")

    const findById = () => {
        Backendless.Data.of("Users").findById({objectId: userId}).then((response) => {
            setFindUser(response)
        })
    }

    return (
        <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="bottom">
                <div>
                    {currentUser ? `${currentUser.email}` : `Вы не авторизованы`}
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    Регистрация
                    <input style={{margin: '10px', width: '10%'}} placeholder="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)}
                           value={password}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="name" onChange={(e) => setName(e.target.value)} value={name}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="age" onChange={(e) => setAge(e.target.value)} value={age}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="country" onChange={(e) => setCountry(e.target.value)} value={country}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="gender" onChange={(e) => setGender(e.target.value)} value={gender}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="birthday" onChange={(e) => setBirthday(e.target.value)} value={birthday}/>
                    <button style={{margin: '10px', width: '10%'}} onClick={signUp}>Reg</button>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div> Вход </div>
                    <input style={{margin: '10px', width: '10%'}} placeholder="email" onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail}/>
                    <input style={{margin: '10px', width: '10%'}} placeholder="password" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword}/>

                        <button style={{margin: '10px', width: '10%'}} onClick={login}>Login</button>
                        {/*<button style={{margin: '10px', width: '10%'}} onClick={restoreAccount}>Восстановить пароль</button>*/}

                </div>
                <div style={{marginBottom: '30px'}}>
                    Создать файл
                    {image && <img src={URL.createObjectURL(image)} className="image" alt=""/>}
                    <input type="file" onChange={
                        (e) => setImage(e.target.files && e.target.files[0])
                    }/>
                    <button onClick={createFile}>Отправить файл</button>
                </div>
                <div>
                    Удалить файл
                    <input placeholder="удалить по имени" value={deleteFileName} style={{marginBottom: '30px'}}
                           onChange={(e) => setDeleteFileName(e.target.value)}/>
                    <button onClick={deleteFile}>Удалить</button>
                </div>
                <div>
                    <button onClick={getList}>Получить файлы</button>
                    {images?.map((item) =>
                        <div>
                            <img className="image" src={item.publicUrl} alt="" style={{width: '100px', height: '30%'}}/>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <div className="bottom">
                    <div className="text" style={{marginBottom: '30px'}}>
                        Обновление профиля
                    </div>
                    {currentUser &&
                    <div>
                        <input value={currentUser.age}
                               onChange={(e) => setCurrentUser({...currentUser, age: e.target.value})}/>
                        <input value={currentUser.country}
                               onChange={(e) => setCurrentUser({...currentUser, country: e.target.value})}/>
                        <input value={currentUser.gender}
                               onChange={(e) => setCurrentUser({...currentUser, gender: e.target.value})}/>
                        <input value={currentUser.name}
                               onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}/>
                        <button onClick={updateUser} className="btn">Обновить профиль</button>
                    </div>
                    }
                    <div className="text">
                        Создать точку на карте
                        <input placeholder="x" value={point.x}
                               onChange={(e) => setPoint({...point, x: e.target.value})}/>
                        <input placeholder="y" value={point.y}
                               onChange={(e) => setPoint({...point, y: e.target.value})}/>
                        <input placeholder="Описание" value={point.description}
                               onChange={(e) => setPoint({...point, description: e.target.value})}/>
                        <input placeholder="Фото" value={point.name}
                               onChange={(e) => setPoint({...point, image: e.target.value})}/>
                        <button onClick={saveGeoPoint}>Создать</button>
                    </div>
                </div>
            </div>
            <div>
                {currentUser &&
                <div className="text">
                    {currentUser.friends?.map((friend) =>
                        <div>
                            Id friend
                            {friend.id}
                            <div>
                                <div>
                                    {friend.accept ? "В друзьях" : "Заявка отправлена"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                }
                <div>
                    Найти пользователя
                    <input className="form-control" placeholder="id пользователя"
                           value={userId} onChange={(e) => setUserId(e.target.value)}/>
                    <button onClick={findById}>Найти</button>
                    {findUser &&
                    <div>
                        <div>Имя {findUser.name} </div>
                        <div>Почта {findUser.email} </div>
                        <div>Гендер {findUser.gender} </div>
                        <div>Возраст {findUser.age} </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
