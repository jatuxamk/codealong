import { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState({
                                      kayttajat : [],
                                      tiedotHaettu : false,
                                      virhe : null
                                  });

  const haeTiedot = async () => {

    try {

      const yhteys = await fetch("http://localhost:4000/api/kayttajat");
      const tiedot = await yhteys.json();

      setData({
              ...data,
              kayttajat : tiedot,
              tiedotHaettu : true
              });

    } catch (e) {

      setData({
              ...data,
              tiedotHaettu : false,
              virhe : "Yhteyttä palvelimeen ei voitu muodostaa. Yritä hetken kuluttua uudestaan."
              });

    }

  }

  useEffect(() => {

    haeTiedot();

  }, [] );

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Käyttäjärekisteri
          </span>
          <button className="btn btn-light">Lisää uusi käyttäjä</button>
        </div>
      </nav>

      <div className="container">

        {(data.virhe)
          ? <div className="alert alert-danger">
              {data.virhe}
            </div> 
          : (data.tiedotHaettu)
            ? JSON.stringify(data.kayttajat)
            : <div className="spinner-border" role="status">
                <span className="sr-only">Odota hetki...</span>
              </div>
          }
        

      </div>
    </div>
  );
}

export default App;
