import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctor  from '../Components/RelatedDoctor'


function Appointments() {

  const {docId} = useParams();
  const {doctors, currencySymbol } = useContext(AppContext);
  const [doc_Info, setDoc_info] = useState(null);
  const [docSlot, setdocSlot] = useState([]);
  const [slotIndex, setslotIndex] = useState(0);
  const [slotTime, setslotTime] = useState('');

  const weeks = ['SAT', 'SUN', 'MON', 'TUE','WED', 'THU', 'FRI']

  const GetavailableSlot = async ()=> {
    setdocSlot([]);
    
    //getting current date
    let today = new Date();
    for (let i = 0; i < 7; ++i) {
      let currdate = new Date (today);
      currdate.setDate(today.getDate() + i);

      //setting endtime of the date with index
      let endtime = new Date();
      endtime.setDate(endtime.getDate() + i);
      endtime.setHours(21, 0, 0, 0);

      //setting hours
      if (today.getDate() === currdate.getDate()) {
        currdate.setHours(currdate.getHours() > 10 ? currdate.getHours + 1 : 10);
        currdate.setMinutes(currdate.getMinutes() > 30 ? 30 : 0);
      }
      else {
        currdate.setHours(10);
        currdate.setMinutes(0);
      }

      let timeslot = [];

      while(currdate < endtime) {
        let formattedTime = currdate.toLocaleTimeString([],{hour:'2-digit', minute : '2-digit'})
        timeslot.push({
          datetime : new Date(currdate),
          time : formattedTime,
        })

        //increment current time by 60 min
        currdate.setMinutes(currdate.getMinutes() + 30);
      }
      setdocSlot(prev =>([...prev,timeslot]));
    }

  }

  const FetchDOcInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDoc_info(docInfo);
    console.log(docInfo);
    
  }
  useEffect(() => {
    FetchDOcInfo()
  },[doctors,docId])

  useEffect(()=> {
    console.log(docSlot);
    
  },[docSlot])

  useEffect(()=> {
    GetavailableSlot()
  }, [doc_Info])

  return doc_Info && (
    <div className='mt-[100px]'>
      <div>
        {/* Doctor Details */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className=' bg-red-700 w-full sm:max-w-72 rounded-lg' src={doc_Info.image} alt="" />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/*docInfo : name,exp, deg */}
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{doc_Info.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{doc_Info.degree} - {doc_Info.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{doc_Info.experience}</button>
            </div>
            <div>
              {/* doctor About */}
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'> {doc_Info.about} </p>
            </div>
            <p className='text-amber-800 font-medium mt-4'>
              Appointment Fee :  <span className='text-blue-400'>{currencySymbol}{doc_Info.fees}</span>
            </p>
          </div>

        </div>
        {/* Booking slot */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll lg:overflow-x-hidden mt-4'>
            {
              docSlot.length && docSlot.map((item, index)=> (
                <div className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-red-700 text-white' : 'border border-gray-200'}`} key={index}
                onClick={()=> setslotIndex(index)}
                >
                  <p>{item[0] && weeks[item[0].datetime.getDay()]}</p>
                  <p> {item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className='flex items-center gap-3 w-full mt-4 overflow-x-scroll'>
            {
              docSlot.length && docSlot[slotIndex].map((item, index) => (
                <p className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-red-700 text-white': 'border border-gray-300'}`} key={index}
                onClick={()=>setslotTime(item.time)}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            }
          </div>
          <button className='bg-blue-500 text-white rounded-full px-14 py-2 my-6 font-medium'>Book an Appointment</button>
        </div>
      </div>
      <RelatedDoctor docId = {docId} speciality = {doc_Info.speciality}  />
    </div>
  )
}

export default Appointments