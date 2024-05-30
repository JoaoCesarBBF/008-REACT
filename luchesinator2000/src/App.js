import { useState } from 'react';
import { FiSearch} from 'react-icons/fi';
import { CiPizza } from "react-icons/ci";
import './styles.css'
import api from './services/api'
import api2 from './services/api2'
import axios from "axios";

function App() {

  const [input, setInput] = useState('')
  const [cep, setCep] = useState({})
  const [tempo, setTempo] = useState({})
  const [ip, setIP] = useState('');
  
  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");

    setIP(res.data.ip);
  };

  getData()

  async function handleSearch2(){
    const res = await axios.get("https://api.ipify.org/?format=json");
   
    setIP(res.data.ip);
    const response2 = await api2.get(`current.json?key=681e5c3595ee42c084a165140243005&q=${ip}&aqi=no`);
    setTempo(response2.data)
    alert('A temperatura pra fora da sua janela é ' + tempo.current.temp_c + 'ºC');
  }

  async function handleSearch(){
    if(input === ''){
      alert('Preencha algum CEP!')
      return
    }
    try{
      console.log('antes do await');
      const response = await api.get(`${input}`);
      console.log("depois do await");
      setCep(response.data)
      console.log(cep)
      setInput('')
      try {
        console.log(cep.lat);
        const response2 = await api2.get(`current.json?key=681e5c3595ee42c084a165140243005&q=${cep.lat},${cep.lng}&aqi=no`);
        setTempo(response2.data)
        console.log(tempo.current.temp_c);
      } catch {
        alert('ERRINHO2')
      }
    }catch{
      alert('ERRINHO')
      setInput('')
    }




  }


  const data = new Date();
  const showTime = 
            (data.getHours() < 10 ? ('0'+data.getHours()):data.getHours())
    + ':' + (data.getMinutes()<10 ? ('0'+data.getMinutes()):data.getMinutes())
    + ':' + (data.getSeconds()<10 ? ('0'+data.getSeconds()):data.getSeconds());
  return (
    <div className={(data.getHours() >= 6 && data.getHours() < 18 ) ? 'container dia' : 'container noite'}>
      <h1>Hora Atual</h1>
      <h1>Está de  {(data.getHours() >= 6 && data.getHours() < 18 ) ? 'dia' : 'noite'} se voce abrir sua janela seu Gremlin</h1>
      <h2> {showTime}</h2>

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

        <button className="buttonSearch" onClick={handleSearch2}>
          <CiPizza size={25} color='#FFF'/>
        </button>
      </div >



      {Object.keys(cep).length > 0 && (
        <main className='main'>
          <h2>CEP:</h2>
          <span>Lat {cep.lat} / Lng {cep.lng}</span>
          <span>Cidade:{cep.city} - {cep.state}</span>
          <span>Bairro:  {cep.district}</span>
          {/* <span>Temperatura: {tempo.current.temp_c}</span> */}
        </main>
      )}

    </div>


  );
  
}

export default App;
