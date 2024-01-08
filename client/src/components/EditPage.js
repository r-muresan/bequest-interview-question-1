// EditPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn
  } from 'mdb-react-ui-kit';

const EditPage = () => {
  const [assetId, setAssetId] = useState('');
  const [backupList, setBackupList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch user details and backup list when the component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8080/view', {
        headers: {
          Authorization: token,
        },
      });

      const { assetId, backup, name, email } = response.data;
      setSelectedUser({ name, email });
      setAssetId(assetId);
      setBackupList(backup.reverse());
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const revertToBackup = async (backupId) => {
    try {
      // Find the backup with the specified ID
      const selectedBackup = backupList.find((backup) => backup.timestamp === backupId);
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:8080/edit', {
        assetId: selectedBackup.assetId,
      }, {
        headers: {
          Authorization: token,
        },
      });

      // Fetch updated user data after reverting
      fetchUserData();
    } catch (error) {
      console.error('Error reverting to backup', error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');

      await axios.put('http://localhost:8080/edit', {
        assetId: assetId,
      }, {
        headers: {
          Authorization: token,
        },
      });

      // Fetch updated user data after editing
      fetchUserData();
    } catch (error) {
      console.error('Error updating user data', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: '#2C3E50' }}>Edit Page</h2>
      <div>
        <div className="user-details text-center mb-4">
   
          <MDBCard>
      <MDBCardBody>
        <MDBCardTitle>User Details</MDBCardTitle>
        <MDBCardText>
        <p><b>Name:</b> {selectedUser?.name}</p>
          <p ><b>Email:</b> {selectedUser?.email}</p>
          <p ><b>Asset ID:</b> {assetId}</p></MDBCardText>
      
      </MDBCardBody>
    </MDBCard>
         
        </div>

       
      </div>
      <div>
        <form onSubmit={handleEditSubmit} className='text-center '>
          <h4 style={{ color: '#2ECC71' }}>Edit Form</h4>
          <div className="mb-3 ">
            <label htmlFor="assetId" className="form-label" style={{ color: '#3498DB' }}>Asset ID:</label>
            <input
              type="text"
              id="assetId"
              name="assetId"
              className="form-control"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ background: '#3498DB', border: 'none' }}>Save Changes</button>
        </form>
      </div>
      <div className='mt-5'>
        <h4 style={{ color: '#E74C3C' }} className='text-center'>Backup List Table</h4>
        <table className="table">
          <thead>
            <tr>
              <th style={{ color: '#3498DB' }}>Backup ID</th>
              <th style={{ color: '#3498DB' }}>Timestamp</th>
              <th style={{ color: '#3498DB' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {backupList.map((backup) => (
              <tr key={backup.timestamp}>
                <td style={{ color: '#E74C3C' }}>{backup.assetId}</td>
                <td style={{ color: '#E74C3C' }}>{new Date(backup.timestamp).toLocaleString()}</td>
                <td>
                  <button className='btn btn-warning' onClick={() => revertToBackup(backup.timestamp)}>Revert</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditPage;
