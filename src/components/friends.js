import React, {useEffect, useState} from "react";
import Backendless from "backendless";
import {Link, useNavigate} from 'react-router-dom';

function Friends(){
    const [currentUser, setCurrentUser] = useState()
    console.log(currentUser)
    useEffect(() => {
        Backendless.UserService.getCurrentUser().then(response => {
            setCurrentUser(response)
        })
    }, [])

    const [friendEmail, setFriendEmail] = useState("")
    const [findUser, setFindUser] = useState()
    const [userId, setUserId] = useState("")
    const [allFriends, setAllFriends] = useState([])
    const navigate = useNavigate()
    const addFriend = async () => {
        try {
            const whereClause = `email = '${friendEmail}'`
            const queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause(whereClause)
            const friend = await Backendless.Data.of('Users').find(queryBuilder)
            const friendData = [...allFriends]
            friendData.push({
                "name": friend[0].email,
                "confirmed": false,
                "friendId": friend[0].objectId
            })
            await Backendless.Data.of('Users').save({
                objectId: currentUser.objectId,
                friends: friendData
            })
            alert('Friend was added')
            setFriendEmail('')
        } catch(err) {
            console.log(err)
        }
    }
    const deleteFriend = async()=>{
        try {

            const currentUserRecord = await Backendless.Data.of('Users').findById(currentUser.objectId);
            const friendList = currentUserRecord.friends || [];

            const friendIndex = friendList.findIndex(friend => friend.friendId === friendEmail);

            if (friendIndex !== -1) {
                friendList.splice(friendIndex, 1);

                await Backendless.Data.of('Users').save({
                    objectId: currentUser.objectId,
                    friends: friendList
                });
                setFriendEmail('')
                alert('Friend was deleted');
            } else {
                alert('Friend not found');
            }
        } catch (err) {
            console.error(err);
        }
    };


    const findById = () => {
        Backendless.Data.of("Users").findById({objectId: userId}).then((response) => {
            setFindUser(response)
        })
    }
    return(
        <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="bottom">
        <div>
            FRIENDS
            {currentUser &&
                <div style={{marginTop: '30px'}}>
                    {currentUser.friends?.map((friend) =>
                        <div>
                            <p>Id friend {friend.friendId}</p>
                            <p>friend name {friend.name}</p>
                            <div>
                                <div>
                                    {friend.confirmed ? "В друзьях" : "Заявка отправлена"}
                                </div>
                            </div>
                            <hr></hr>
                        </div>
                    )}
                    <div>
                        <input value={friendEmail}
                               onChange={(e) => setFriendEmail(e.target.value)}/>
                        <button style={{margin: '10px', width: '10%'}} onClick={addFriend}>Add friend</button>
                        <button style={{margin: '10px', width: '10%'}} onClick={deleteFriend}>Delete friend</button>
                    </div>
                </div>
            }
            <div>
                Find user
                <input className="form-control" placeholder="user id"
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
            <Link to="/"><p>Go back</p></Link>
        </div>
    )
}
export default Friends;