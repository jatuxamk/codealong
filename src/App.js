import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; 

function App() {

  const [naytaModal, setNaytaModal] = useState(false);
  const [data, setData] = useState({
                                      kayttajat : [],
                                      tiedotHaettu : false,
                                      virhe : null
                                  });

  const lisaysDialogi = () => {

    setNaytaModal(true);

  }

  const muokkausDialogi = () => {

    setNaytaModal(true);

  }

  const poistoDialogi = () => {

    setNaytaModal(true);

  }  

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

      <nav className="navbar navbar-light bg-light mb-3">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Käyttäjärekisteri
          </span>
          <button 
            className="btn btn-light"
            onClick={lisaysDialogi}
          >Lisää uusi käyttäjä</button>
        </div>
      </nav>

      <div className="container">

        {(data.virhe)
          ? <div className="alert alert-danger">
              {data.virhe}
            </div> 
          : (data.tiedotHaettu)
            ? <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nimi</th>
                    <th>Käyttäjätunnus</th>
                    <th>Sähköposti</th>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {data.kayttajat.map((kayttaja) => {
                    return <tr key={kayttaja.id}>
                              <td>{kayttaja.sukunimi}, {kayttaja.etunimi}</td>
                              <td>{kayttaja.sahkoposti}</td>
                              <td>{kayttaja.kayttajatunnus}</td>
                              <td>
                                  <button 
                                    className="btn btn-link"
                                    onClick={muokkausDialogi}
                                  >
                                    <i class="bi bi-pencil-square"></i>
                                  </button>
                              </td>
                              <td>
                                  <button 
                                    className="btn btn-link"
                                    onClick={poistoDialogi}
                                  >
                                    <i class="bi bi-trash"></i>
                                  </button>
                              </td>
                           </tr>
                  })}                  
                </tbody>
              </table>
            : <div className="spinner-border" role="status">
                <span className="sr-only">Odota hetki...</span>
              </div>
          }
        

      </div>

      <Modal show={naytaModal}>
        <Modal.Body>
          <h1>JEE!</h1>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default App;
