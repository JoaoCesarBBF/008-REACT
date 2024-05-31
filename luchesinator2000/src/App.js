import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { CiPizza } from "react-icons/ci";
import { TbTemperatureSnow, TbCloudRain, TbTemperaturePlus} from "react-icons/tb";
import { RiWindyFill } from "react-icons/ri";
import { WiHumidity } from "react-icons/wi";
import './styles.css'
import api from './services/api'
import api2 from './services/api2'
import axios from "axios";

function App() {

  const [input, setInput] = useState('')
  const [cep, setCep] = useState({})
  const [tempo, setTempo] = useState({})
  const [ip, setIP] = useState('');
  
  const temperatura = 20
  const vento = 30
  const chuva = 30
  const humidade = 50

  function mouseOver(x) {
    document.getElementById("legend").innerHTML = x.title;
  }

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    setIP(res.data.ip);
  };
  
  useEffect(() =>{
    getData()
  },[])
  
  const getBP = () =>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCep((prevCep) =>{
            return{ ...prevCep, lat:latitude, lng:longitude }
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

  async function handleSearch2(){
    const res = await axios.get("https://api.ipify.org/?format=json");   
    setIP(res.data.ip);
    const { data } = await api2.get('',{params:{q:ip}});
    setTempo(data.current)
    alert('A temperatura pra fora da sua janela é ' + data.current.temp_c + 'ºC');
  }

  async function handleSearch(){
    if(input === ''){
      alert('Preencha algum CEP!')
      return
    }
    try{
      const { data } = await api.get(`${input}`);
      setCep(data)
      setInput('')
      const response2 = await api2.get('',{params:{q:`${data.lat},${data.lng}`}});
      setTempo(response2.data.current)
      console.log(tempo.temp_c);
    }catch (e){
      console.log(e);
      setInput('')
    }
  }


  const data = new Date();


  const showTime2 = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',        
}).format(data)

  const showTime = 
            (data.getHours() < 10 ? ('0'+data.getHours()):data.getHours()) // ACHEI DIFICIL COLOCAR 0 COM FUNÇAO NATIVA
    + ':' + (data.getMinutes()<10 ? ('0'+data.getMinutes()):data.getMinutes())
    + ':' + (data.getSeconds()<10 ? ('0'+data.getSeconds()):data.getSeconds()); 
  return (
    <div className={(data.getHours() >= 6 && data.getHours() < 18 ) ? 'container dia' : 'container noite'}>
      <div className={(data.getHours() >= 6 && data.getHours() < 18 ) ? 'flavorDia' : 'flavorNoite'}>
        <h1 className="flavor">Hora Atual</h1>
        <h1 className='hora'> {showTime2}</h1>
        <h3 className="flavor">Está de  {(data.getHours() >= 6 && data.getHours() < 18 ) ? 'dia' : 'noite'} se voce abrir <br/>sua janela seu Gremlin</h3>
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
            <FiSearch size={25} color='#FFF'/>
          </button>

        
        </div>
        <button className="pizza" onClick={() =>{
          getBP()
          handleSearch2()
        }}>
          <CiPizza size={25} color='#FFF'/>
        </button>
      </div>

      {Object.keys(cep).length > 0 && (
        <main className='main'>
          <div className='icons'>
            {tempo.temp_c < 21 ? <TbTemperatureSnow title='FRIO BAGARAI' size={50} color='blue'/> : ''}
            {tempo.temp_c >= 28 ? <TbTemperaturePlus title='QUENTE BAGARAI' size={50} color='salmon'/>: ''}   
            {tempo.wind_kph > 20 ? <RiWindyFill title='VENTANIA' size={50} color='#B9C7CC'/> : ''}
            {tempo.precip_mm > 0 ? <TbCloudRain title='CHUVERS' size={50} color='blue'/> : ''}
            {tempo.humidity > 60 ? <WiHumidity title='SAFE PRA VIVER' size={50} color='green'/> : ''}
            </div>
          
          <span>Cidade: {cep.city} - {cep.state}</span>
          <span>Bairro: {cep.district}</span>
          <span>Temperatura: {tempo.temp_c}</span>
        </main>
      )}

    </div>


  );
  

  


}

export default App;
