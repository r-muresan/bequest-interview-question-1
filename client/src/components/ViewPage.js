// ViewPage.js
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ViewPage = () => {
  const history = useHistory();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/view', {
          headers: {
            Authorization: token,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        history.push('/login');
      }
    };

    fetchUserData();
  }, [history]);

  const handleEditClick = () => {
    history.push('/edit'); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">View Details</h2>

              {userData && (
                <div>
                  <p><strong>ID:</strong> {userData.id}</p>
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Assets:</strong> {userData.assetId}</p>
                </div>
              )}

              <div className="text-center mt-3">
                <button onClick={handleEditClick} className="btn btn-primary">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
