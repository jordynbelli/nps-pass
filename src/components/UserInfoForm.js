import React, { useState } from 'react';

const UserInfoForm = () => {
    const [updateType, setUpdateType] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleUpdate = async (event) => {
        event.preventDefault();
        
        if (updateType === 'email') {
            console.log('Updating email:', email);
        } else if (updateType === 'password') {
            console.log('Updating password:', password);
        } else if (updateType === 'username') {
            console.log('Updating username:', username);
        }
    };

    return (
        <form onSubmit={handleUpdate} className="user-info-form">
            <h2>Update User Information</h2>
            
            <label htmlFor="update_type">Update:</label>
            <select
                id="update_type"
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value)}
            >
                <option value="">Select an option</option>
                <option value="email">Email</option>
                <option value="username">Username</option>
                <option value="password">Password</option>
            </select>

            {updateType === 'email' && (
                <>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </>
            )}

            {updateType === 'password' && (
                <>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </>
            )}

            {updateType === 'username' && (
                <>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </>
            )}

            <button type="submit">Update</button>
        </form>
    );
};

export default UserInfoForm;
