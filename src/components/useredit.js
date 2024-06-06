import React, { useState } from 'react';
import axios from 'axios';
import './useredit.css';
import { useAuthContext } from '../AuthContext';

function EditAccountPage() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updateField, setUpdateField] = useState('email');
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const { setIsAuthenticated } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateField === 'password' && password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }

    const data = {};
    if (updateField === 'email') {
      data.currentEmail = currentEmail;
      data.newEmail = newEmail;
    }
    if (updateField === 'password') data.password = password;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }
    
    console.log('Token:', token);  // Debugging line

    try {
      const response = await axios.put('http://127.0.0.1:5000/useredit', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Account updated successfully:', response.data);
      setError('');
      setSuccess('Account updated successfully!');

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Account update failed:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(`An error occurred: ${error.response.status} - ${error.response.data.message}`);
      } else {
        setError('An error occurred. Please try again.');
      }
      setSuccess('');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete your account?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated');
      return;
    }

    console.log('Token:', token);

    try {
      const response = await axios.delete('http://127.0.0.1:5000/delete_account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          email: deleteEmail,
          password: deletePassword
        }
      });
      console.log('Account deleted successfully:', response.data);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setError('');
      setSuccess('Account deleted successfully!');

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Account deletion failed:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(`An error occurred: ${error.response.status} - ${error.response.data.message}`);
      } else {
        setError('An error occurred. Please try again.');
      }
      setSuccess('');
    }
  };

  const showDeleteAccountForm = () => {
    setShowDeleteForm(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className="edit-account-page">
      <div className="edit-account-container">
        <div className="edit-account-form">
          <h2>Edit Account</h2>
          <div className="dropdown-container">
            <label htmlFor="updateField">Would you like to update...</label>
            <select id="updateField" value={updateField} onChange={(e) => setUpdateField(e.target.value)}>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>
          </div>
          <form onSubmit={handleSubmit}>
            {updateField === 'email' && (
              <>
                <input
                  type="email"
                  placeholder="Current Email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </>
            )}
            {updateField === 'password' && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}
            <button type="submit">Save Changes</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button className="delete-account-button" onClick={showDeleteAccountForm}>Delete Account</button>
          {showDeleteForm && (
            <form onSubmit={handleDeleteAccount}>
              <input
                type="email"
                placeholder="Email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />
              <button type="submit">Confirm Delete Account</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditAccountPage;
