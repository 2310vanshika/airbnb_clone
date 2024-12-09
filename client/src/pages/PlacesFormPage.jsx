import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import { useState , useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";


export default function PlacesFormPage(){
    const {id} = useParams();
    const [title,setTitle]= useState('');
    const [address,setAddress]= useState('');  
    const [description,setDescription]= useState('');
    const [perks,setPerks]= useState([]); 
    const [extraInfo,setExtraInfo]= useState('');
    const [checkIn,setCheckIn]= useState('');
    const [addedPhotos,setAddedPhotos]= useState([]);
    const [selectedPerks, setSelectedPerks] = useState([]);
    const [checkOut,setCheckOut]= useState('');
    const [maxGuests,setMaxGuests]= useState(1);
    const [price,setPrice] = useState(100);
    const [redirect,setRedirect]= useState(false);
    useEffect(()=>{
      if(!id){
        return;
      }
      axios.get(`http://localhost:4000/places/${id}`).then(response=>{
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos||[]);
        setDescription(data.description);
        setPerks(data.perks);
        setSelectedPerks(data.selectedPerks||[]);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
  }).catch(error=>{
    console.error(error);
  });
},[id]);

    const navigate = useNavigate();

    function inputHeader(text){
        return(
          <h2 className="text-2xl mt-4">{text}</h2>
        );
      }
      function inputDescription(text){
        return(
          <p className="text-gray-500 text-sm">{text}</p>
        );
      }
      function preInput(header,description){
        return(
          <>
            {inputHeader(header)}
            {inputDescription(description)}
          </>
        );
      }
      async function savePlace(e){
        e.preventDefault();
        const placeData = {
          id,title,address,addedPhotos,
            description,perks: selectedPerks,extraInfo,
            checkIn,checkOut,maxGuests, price,
        };
        if(id){
          await axios.put('http://localhost:4000/places',{
            id , ...placeData
          }) ;
          setRedirect(true);
        }else{
          await axios.post('http://localhost:4000/places',placeData);
          setRedirect(true);
          };
        }
      
      if(redirect){
        console.log("Redirecting to /account/places");
        //return <Navigate to={'/account/places'}/>
        navigate('/account/places');
      }
    return(
        <div>
            <AccountNav/>
                <form onSubmit={savePlace}>
                  {preInput('Title','Title for your place, should be short')}
                    <input type='text' value={title} onChange={e=>setTitle(e.target.value)} placeholder='title'/>
                  {preInput('Address','Address to this place')}
                    <input type='text' value={address} onChange={e=>setAddress(e.target.value)} placeholder='address'/>
                  {preInput('Photos','more=better')}
                  <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                    {preInput('Description','description of the place')}
                    <textarea value={description} onChange={e=>setDescription(e.target.value)} />
                    {preInput('Perks','select all the perks of your place')}
                    {/* <h2 className='text-2xl mt-4'>Perks</h2>
                    <p className='text-gray-500 text-sm'>Select all the perks of your place</p> */}
                    <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                      <Perks selected={selectedPerks} onChange={setSelectedPerks}/>
                    </div>
                    <div>
                    <h2 className='text-2xl mt-4'>Extra Info</h2>
                    <p className='text-gray-500 text-sm'>house rules , etc</p>
                    <textarea value={extraInfo} onChange={e=>setExtraInfo(e.target.value)}/>
                    <h2 className='text-2xl mt-4'>Chech in&out times</h2>
                    <p className='text-gray-500 text-sm'>add check in and out times , remember to have some time window for cleaning the room between guests</p>
                    <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-4'>
                      <div>
                      <h3 className="mt-2 -mb-1">Check in time</h3>
                      <input type='text' value={checkIn} onChange={e=>setCheckIn(e.target.value)} placeholder='14'/>
                      </div>
                    <div>
                      <h3 className="mt-2 -mb-1">Check out time</h3>
                      <input type='text'value={checkOut} onChange={e=>setCheckOut(e.target.value)} placeholder="11"/>
                    </div>
                    <div>
                      <h3 className="mt-2 -mb-1">Max number of guests</h3>
                      <input type='number' value={maxGuests} onChange={e=>setMaxGuests(e.target.value)}/>
                    </div>
                    <div>
                      <h3 className="mt-2 -mb-1">Price per night</h3>
                      <input type='number' value={price} onChange={e=>setPrice(e.target.value)}/>
                    </div>
                    </div>
                    <button className="primary my-4">Save</button>
                    </div>
                </form>
            </div>
    );

}