import React, {useEffect, useState} from "react";
import Backendless from "backendless";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function MainPage(){
    const [image, setImage] = useState("")
    const [deleteFileName, setDeleteFileName] = useState("")
    const [shareFileName, setShareFileName] = useState("")
    const [recipientName, setRecipientName] = useState("")
    const [images, setImages] = useState()
    const [sharedImages, setSharedImages] = useState()
    const [currentUser, setCurrentUser] = useState()
    console.log(currentUser)

    const navigate = useNavigate()

    useEffect(() => {
        Backendless.UserService.getCurrentUser().then(response => {
            setCurrentUser(response)
        })
    }, [])
    const createFile = () => {
        Backendless.Files.upload(image, `users/${currentUser.name}/MyFiles`).then((response) => {
            console.log(response)
        }).catch((e) => {
            Backendless.Logging.getLogger("createFile").error(e.message)
        })
    }

    const deleteFile = () => {
        Backendless.Files.remove(`users/${currentUser.name}/MyFiles/${deleteFileName}`)
    }

    const shareFile = () => {
        Backendless.Files.copyFile(`users/${currentUser.name}/MyFiles/${shareFileName}`,`users/${recipientName}/sharedWithMe`).then((response) => {
            console.log(response)
        }).catch((e) => {
            Backendless.Logging.getLogger("shareFile").error(e.message)
        })
    }

    const getOwnFiles = () => {
        Backendless.Files.listing(`users/${currentUser.name}/MyFiles`).then((response) => {
            setImages(response)
        })
    }
    const getSharedFiles = () => {
        Backendless.Files.listing(`users/${currentUser.name}/sharedWithMe`).then((response) => {
            setSharedImages(response)
        })
    }
    const logout =()=>{
        Backendless.UserService.logout().then((response)=>{
            console.log(response)
            navigate('/login', { replace: true })
        }).catch((e) => {
            Backendless.Logging.getLogger("Logout").error(e.message)
        })
    }
   return (
       <div style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
           <div className="bottom">
               <div>
                   {currentUser ? `${currentUser.email}` : `Вы не авторизованы`}
                   <Link to="/profile"><p>Go to profile</p></Link>
                   <Link to="/friends"><p>My friends</p></Link>
                   <Link to="/geo"><p>Geolocation</p></Link>
               </div>
               <div>
                   <button style={{margin: '10px', width: '10%'}} onClick={logout}>Logout</button>
               </div>
               <div style={{marginBottom: '30px'}}>
                   Create file
                   {image && <img src={URL.createObjectURL(image)} className="image" alt=""/>}
                   <input type="file" onChange={
                       (e) => setImage(e.target.files && e.target.files[0])
                   }/>
                   <button onClick={createFile}>Send File to server</button>
               </div>
               <div>
                   Share file
                   <input placeholder="Recipient name" value={recipientName} style={{marginBottom: '30px'}}
                          onChange={(e) => setRecipientName(e.target.value)}/>
                   <input placeholder="file name" value={shareFileName} style={{marginBottom: '30px'}}
                          onChange={(e) => setShareFileName(e.target.value)}/>
                   <button onClick={shareFile}>Share</button>
               </div>
               <div>
                   Delete file
                   <input placeholder="delete by name" value={deleteFileName} style={{marginBottom: '30px'}}
                          onChange={(e) => setDeleteFileName(e.target.value)}/>
                   <button onClick={deleteFile}>Delete</button>
               </div>
               <div>
                   <button onClick={getOwnFiles} style={{marginTop: '30px'}}>Get my files</button>
                   {images?.map((item) =>
                       <div>
                           <img className="image" src={item.publicUrl} alt="" style={{width: '100px', height: '30%'}}/>
                           <span style={{ marginLeft: '10px' }}>{item.name}</span>
                       </div>
                   )}
               </div>
               <div>
                   <button onClick={getSharedFiles} style={{marginTop: '30px'}}>Get shared files</button>
                   {sharedImages?.map((item) =>
                       <div>
                           <img className="sharedImages" src={item.publicUrl} alt="" style={{width: '100px', height: '30%'}}/>
                           <span style={{ marginLeft: '10px' }}>{item.name}</span>
                       </div>
                   )}
               </div>
           </div>
           <Link to="/feedback" style={{ marginTop: '50px' }}><p>Leave your feedback</p></Link>
       </div>
   )
}
export default MainPage;