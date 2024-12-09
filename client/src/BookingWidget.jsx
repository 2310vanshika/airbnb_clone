import { useState } from "react";
export default function BookingWidget({place}){
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [numberOfGuests,setNumberOfGuests] = useState('');
    return(
        <div className="bg-white shadow p-4 rounded-2xl">
        <div className='text-2xl text-center'>
             Price: ${place.price} / per night
        </div>
        <div className='border rounded-2xl mt-4'>
            <div className='flex'>
                <div className='py-3 px-4'>
                    <label>Check in:</label>
                    <input type='date' value={checkIn} onChange={e=>setCheckIn(e.target.value)}/>
                </div>
            <div className='py-3 px-4 border-t'>
                <label>Check out:</label>
                <input type='date' value={checkOut} onChange={e=>setCheckOut(e.target.value)}/>
            </div>
        </div>
        <div className='py-3 px-4 border-t'>
                <label>Number of guests:</label>
                <input type='number' value={numberOfGuests} onChange={e=>setNumberOfGuests(e.target.value)}/>
        </div>
    </div>
    <button className="primary mt-4">
        Book this place
        {checkIn&&checkOut && (
            <span>differenceInCalendarDays(new Date(checkIn), new Date(checkOut))}</span>
        )}

    </button>
</div>
    )
}