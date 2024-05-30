import './styles.css'

function App() {
  const data = new Date();
  const showTime = data.getHours()
    + ':' + data.getMinutes()
    + ':' + data.getSeconds();
  return (
    <div className={data.getHours() < 10 ? 'container dia' : 'container noite'}>
      <h1>Hora Atual</h1>
      <h1> {data.getHours() > 9 ? 'NOITE' : 'DIA'}</h1>
      <h2> {showTime}</h2>


      <main className='main'>
        <h2>CEP:</h2>
        <span>1111</span>
        <span>2222</span>
        <span>3333</span>
      </main>


    </div>


  );
}

export default App;
