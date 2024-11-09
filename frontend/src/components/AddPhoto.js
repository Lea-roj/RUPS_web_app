import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';

function AddPhoto(props) {
    const userContext = useContext(UserContext); 
    const[name, setName] = useState('');
    const[file, setFile] = useState('');
    const[uploaded, setUploaded] = useState(false);

    const [details, setDetails] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(details);


        const formData = new FormData();
        formData.append('details', details);
        const res = await fetch('http://localhost:3001/orders', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                details: details
            })
        });
        const data = await res.json();
    };




    return (
        <div>

        <h2>Create New Order</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Details</label>
                    <input
                        type="text"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Order</button>
            </form>
        </div>
    )
}

export default AddPhoto;