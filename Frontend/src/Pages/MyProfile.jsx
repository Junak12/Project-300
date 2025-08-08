import React, { useContext, useState } from 'react';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';
import { AppContext } from '../Context/AppContext';

function MyProfile() {

  const {userData, setUserData} = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);

  return userData &&  (
    <div className="mt-[100px] px-4">
      <div className="max-w-lg mx-auto text-sm flex flex-col gap-4 bg-white p-6 shadow rounded-lg">
        <img className="w-36 h-36 object-cover rounded-full mx-auto" src={userData.img} alt="Profile" />
        
        {isEdit ? (
          <input
            className="bg-gray-100 text-2xl font-medium text-center rounded p-2"
            type="text"
            value={userData.name}
            onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="font-semibold text-2xl text-center text-gray-800">{userData.name}</p>
        )}

        <hr className="border-gray-300" />

        {/* Contact Info */}
        <div>
          <p className="text-lg font-semibold text-gray-700 underline mb-2">Contact Information</p>
          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-gray-600">
            <p>Email:</p>
            <p>{userData.email}</p>

            <p>Phone:</p>
            {isEdit ? (
              <input
                type="text"
                className="bg-gray-100 p-1 rounded"
                value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p>{userData.phone}</p>
            )}

            <p>Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="bg-gray-100 p-1 rounded"
                  value={userData.address.line1}
                  onChange={e =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                />
                <input
                  type="text"
                  className="bg-gray-100 p-1 rounded"
                  value={userData.address.line2}
                  onChange={e =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                />
              </div>
            ) : (
              <p>{userData.address.line1}, {userData.address.line2}</p>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <p className="text-lg font-semibold text-gray-700 underline mb-2">Basic Information</p>
          <div className="grid grid-cols-[120px_1fr] gap-y-3 text-gray-600">
            <p>Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                className="bg-gray-100 p-1 rounded"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="capitalize">{userData.gender}</p>
            )}

            <p>Date of Birth:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                className="bg-gray-100 p-1 rounded"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsEdit(!isEdit)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isEdit ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
