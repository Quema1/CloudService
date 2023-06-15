import React, {useState} from "react";
import Backendless from "backendless";
import '../styles/form-styles.css';
import { useNavigate } from 'react-router-dom';

function Feedback() {

    const [emailTitle, setEmailTitle] = useState('')
    const [emailText, setEmailText] = useState('')
    const navigate = useNavigate()

    const report = 'Report'
    const advice = 'Advice'

    const send = async () => {
        try {
            const text = new Backendless.Bodyparts()
            text.textmessage = emailText
            await Backendless.Messaging.sendEmail(emailTitle, text, ['oleksii.morochkovskyi@nure.ua'])
            alert('Your message was sent')
            navigate('/', { replace: true })
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className="form-container"  style={{padding: '15px', backgroundColor: '#CFE2F5'}}>
            <div className="form">
                <h2>Feedback</h2>
                <div className="form-content">
                    <input type="radio" value={report} onChange={event => setEmailTitle(event.target.value)}/>
                    <p>Report</p>
                    <input type="radio" value={advice} onChange={event => setEmailTitle(event.target.value)}/>
                    <p>Advice</p>
                </div><br />
                <div className="form-content">
                    <p>Your text</p>
                    <textarea cols="30" rows="10" value={emailText} onChange={event => setEmailText(event.target.value)}>

                    </textarea>
                </div><br />
                <div className="form-content">
                    <button onClick={send}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Feedback