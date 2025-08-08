import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'

function MyAppointments() {
  const { doctors } = useContext(AppContext)

  return (
    <div className="mt-24 px-4 md:px-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>
      <hr />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          doctors.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-tr from-white via-blue-50 to-white shadow-md rounded-2xl p-4 transform transition-transform duration-300 hover:scale-90 hover:shadow-2xl"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.speciality}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-800">Address:</p>
                <p>{item.address.line1}</p>
                <p>{item.address.line2}</p>
              </div>

              <div className="mt-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-800">Date and Time:</span>{' '}
                  5th August, 2025 | 7:30 PM
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm">
                  Pay Online
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
