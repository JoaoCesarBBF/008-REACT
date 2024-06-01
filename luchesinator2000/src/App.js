import axios from "axios";
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { CiPizza } from "react-icons/ci";
import { TbTemperatureSnow, TbCloudRain, TbTemperaturePlus } from "react-icons/tb";
import { RiWindyFill } from "react-icons/ri";
import { WiHumidity } from "react-icons/wi";

import { Clock, DayOrNightWrapper } from './components'
import { cepService } from './services/cep'
import api2 from './services/api2'

import './styles.css'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [input, setInput] = useState('')
  const [showClock, setShowClock] = useState(true)
  const [cep, setCep] = useState({})
  const [tempo, setTempo] = useState({})
  const [ip, setIP] = useState('');

  const getUserIp = async () => {
    const { data } = await axios.get("https://api.ipify.org/?format=json");
    setIP(data.ip);
  };

  useEffect(() => {
    getUserIp()
  }, [])
 

  const getBP = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCep((prevCep) => {
            return { ...prevCep, lat: latitude, lng: longitude }
          })
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          console.log(cep);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  async function handleSearch2() {
    const res = await axios.get("https://api.ipify.org/?format=json");
    setIP(res.data.ip);
    const { data } = await api2.get('', { params: { q: ip } });
    setTempo(data.current)
    alert('A temperatura pra fora da sua janela é ' + data.current.temp_c + 'ºC');
  }

  async function handleSearch() {
    if (input === '') {
      alert('Preencha algum CEP!')
      return
    }

    try {
      const addressDetails = await cepService.getAddressDetails(input)
      setCep(addressDetails)
      setInput('')

      const response2 = await api2.get('', { params: { q: `${addressDetails.lat},${addressDetails.lng}` } });
      setTempo(response2.data.current)
    } catch (e) {
      console.log(e);
      setInput('')
    }
  }

  return (
    <DayOrNightWrapper>
    <div className={`container ${(currentDate.getHours() >= 6 && currentDate.getHours() < 18) ? 'dia' : 'noite'}`}>
      <div className={(currentDate.getHours() >= 6 && currentDate.getHours() < 18) ? 'flavorDia' : 'flavorNoite'}>
        <h1 className="flavor">Hora Atual</h1>
        {showClock && <Clock className="hora" />}
        <button type="button" onClick={() => setShowClock(prevShow => !prevShow)}>Toggle Clock</button>
        <h3 className="flavor">Está de  {(currentDate.getHours() >= 6 && currentDate.getHours() < 18) ? 'dia' : 'noite'} se voce abrir <br />sua janela seu Gremlin</h3>
      </div>
      <div className='comflex'>
        <div className="containerInput">
          <input
            type="text"
            placeholder="Digite seu CEP..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button className="buttonSearch" onClick={handleSearch}>
            <FiSearch size={25} color='#FFF' />
          </button>


        </div>
        <button className="pizza" onClick={() => {
          getBP()
          handleSearch2()
        }}>
          <CiPizza size={25} color='#FFF' />
        </button>
      </div>

      {Object.keys(cep).length > 0 && (
        <main className='main'>
          <div className='icons'>
            {tempo.temp_c < 21 ? <TbTemperatureSnow title='FRIO BAGARAI' size={50} color='blue' /> : ''}
            {tempo.temp_c >= 28 ? <TbTemperaturePlus title='QUENTE BAGARAI' size={50} color='salmon' /> : ''}
            {tempo.wind_kph > 20 ? <RiWindyFill title='VENTANIA' size={50} color='#B9C7CC' /> : ''}
            {tempo.precip_mm > 0 ? <TbCloudRain title='CHUVERS' size={50} color='blue' /> : ''}
            {tempo.humidity > 60 ? <WiHumidity title='SAFE PRA VIVER' size={50} color='green' /> : ''}
          </div>

          <span>Cidade: {cep.city} - {cep.state}</span>
          <span>Bairro: {cep.district}</span>
          <span>Temperatura: {tempo.temp_c}</span>
        </main>
      )}

    </div>
    </DayOrNightWrapper>
  );
}

export default App;
