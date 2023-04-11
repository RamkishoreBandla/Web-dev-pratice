import React, { useState, useEffect } from 'react';
import axios from 'axios'
const Counter = () => {

    const [counter, setCounter] = useState(0);
    const [locations, setLocations] = useState([]);
    const [errorMsg,setErrMsg] = useState(false);

    // const api_link = "http://localhost:3002"
    const MAPS_API = 'e17d529b4e9f4752b20cd76bbce08bfd'

    useEffect(() => {
        getAllClicks();
    }, []);


    const increaseCtr = async (e) => {
       
        let cval= parseInt(counter)+1;
        setCounter(cval);
        let locationData = "";
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            locationData = await getPosition(position);
            console.log(cval, locationData);
            await storeInDB(cval, locationData);
          },async(error)=>{
            console.log(error.message);
            locationData="Unknown location";
            await storeInDB(cval,locationData);
          });
        } else {
          locationData = "Geolocation is not supported by this browser.";
          await storeInDB(cval, locationData);
        }
      };
    
     

    const getAllClicks = async () => {
        try {
            setErrMsg(false)
            let allData = await axios.get("/location/getData");
            setLocations(allData.data);
            if (allData.data.length > 0) {
                setCounter(allData.data[allData.data.length - 1].clickNum)
            }
            else {
                setCounter(0)
            }
        }
        catch (e) {
            console.log(e);
            setErrMsg(true)
        }
    }

   


    const storeInDB = async (counter, loc) => {
        try {
            setErrMsg(false)
            console.log(counter, loc);
            let data = await axios.post("/location/insertData", {
                counter, loc
            })
            setLocations(data.data);
        }
        catch (e) {
            console.log(e);
            setErrMsg(true);
            setCounter(counter-1);
        }

    }

    async function getPosition(position) {

        try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiUrl = "https://api.geoapify.com/v1/geocode/reverse?lat=" + latitude + "&lon=" + longitude + `&apiKey=${MAPS_API}`;
            let resp = await axios.get(apiUrl);
            let data = resp.data;
            console.log(data);
            const country = data.features[0].properties.country;
            const city = data.features[0].properties.city;
            const locationString = `${city}, ${country}`;
            // setLocation(locationString);
            return locationString;
        }
        catch (e) {
            // setLocation("Unable to get your location.");
            return "Unable to get your location.";
        }

    }

    return (
        <div className="container mt-5">
            <div className="row text-center">
                <div className="col">

                    <h2>Counter : {counter} </h2>

                    <button className='btn btn-primary' onClick={(e) => { increaseCtr(e) }}>Increment</button>

                </div>
            </div>
            {locations && locations.length > 0 ? <div className='row mt-3'>
                <div className='col'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th scope='col'>Click #</th>
                                <th scope='col'>location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations && locations.length > 0 && locations.map((loc, i) =>
                                <tr key={i}>
                                    <td>{loc.clickNum}</td>
                                    <td>{loc.location}</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div> : null}

                               {errorMsg===true?
                                <div className='row mt-4 text-center'>
                                <div className='col'>
                                    <h3 className='text text-danger'>Failed to load data</h3>
                                </div>
                            </div>
                               :null} 

        </div>
    );
}

export default Counter;
