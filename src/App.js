import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; 

function App() {

  const [toiminto, setToiminto] = useState("GET");
  const [naytaModal, setNaytaModal] = useState(false);
  const [modalOtsikko, setModalOtsikko] = useState(false);

  const [kayttaja, setKayttaja] = useState({
                                              id: 0,
                                              sukunimi : "",
                                              etunimi : "",
                                              sahkoposti : "",
                                              kayttajatunnus : "",
                                              salasana : ""
                                           });

  const [data, setData] = useState({
                                      kayttajat : [],
                                      tiedotHaettu : false,
                                      virhe : null
                                  });

  const lisaysDialogi = () => {

    setToiminto("POST");
    setModalOtsikko("Lisää uusi käyttäjä");
    setNaytaModal(true);

  }

  const muokkausDialogi = (muokattavaKayttaja) => {

    setKayttaja(muokattavaKayttaja);
    setToiminto("PUT");
    setModalOtsikko("Muokkaa käyttäjän tietoja");
    setNaytaModal(true);

  }

  const poistoDialogi = (poistettavaKayttaja) => {

    setKayttaja(poistettavaKayttaja);
    setToiminto("DELETE");
    setModalOtsikko("Poista käyttäjän tiedot");
    setNaytaModal(true);

  }  

  const suljeModal = () => {

    setNaytaModal(false);

  }

  const apikutsu = async () => {

    let url = "http://localhost:4000/api/kayttajat";
    let asetukset = {};
    
    if (toiminto === "POST") {

      asetukset = {
                    method : "POST",
                    headers : {
                                "Content-Type" : "application/json"
                              },
                    body : JSON.stringify(kayttaja)
                  }

    }

    if (toiminto === "PUT") {

      url = `http://localhost:4000/api/kayttajat/${kayttaja.id}`;

      asetukset = {
                    method : "PUT",
                    headers : {
                        "Content-Type" : "application/json"
                      },
                    body : JSON.stringify(kayttaja)
                  }

    }  

    if (toiminto === "DELETE") {

      url = `http://localhost:4000/api/kayttajat/${kayttaja.id}`;

      asetukset = {
                    method : "DELETE"
                  }

    }   

    try {

      const yhteys = await fetch(url, asetukset);
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

    setToiminto("GET");

  }

  useEffect(() => {

    apikutsu();

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
                    <th>Sähköposti</th>
                    <th>Käyttäjätunnus</th>
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
                                    onClick={() => { muokkausDialogi(kayttaja) }}
                                  >
                                    <i class="bi bi-pencil-square"></i>
                                  </button>
                              </td>
                              <td>
                                  <button 
                                    className="btn btn-link"
                                    onClick={() => { poistoDialogi(kayttaja) }}
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

      <Modal show={naytaModal} size="lg">
        <Modal.Header>
          {modalOtsikko}
        </Modal.Header>
        <Modal.Body>
          
          {(toiminto === "DELETE")
            ? <div className="alert alert-danger">
                Haluatko varmasti poistaa käyttäjän {kayttaja.sukunimi}, {kayttaja.etunimi} (ID: {kayttaja.id})?
              </div>
            : <form>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Etunimi</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      class="form-control"
                      value={ kayttaja.etunimi }
                      onChange={ (e) => { setKayttaja({
                                                      ...kayttaja, 
                                                      etunimi : e.target.value
                                                    }) 
                                       } 
                               }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Sukunimi</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      class="form-control"
                      value={ kayttaja.sukunimi }
                      onChange={ (e) => { setKayttaja({
                                                      ...kayttaja, 
                                                      sukunimi : e.target.value
                                                    }) 
                                       } 
                               }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Sähköposti</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      class="form-control"
                      value={ kayttaja.sahkoposti }
                      onChange={ (e) => { setKayttaja({
                                                      ...kayttaja, 
                                                      sahkoposti : e.target.value
                                                    }) 
                                       } 
                               }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Käyttäjätunnus</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      class="form-control"
                      value={ kayttaja.kayttajatunnus }
                      onChange={ (e) => { setKayttaja({
                                                      ...kayttaja, 
                                                      kayttajatunnus : e.target.value
                                                    }) 
                                       } 
                               }
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">Salasana</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      class="form-control"
                      value={ null }
                      onChange={ (e) => { setKayttaja({
                                                      ...kayttaja, 
                                                      salasana : e.target.value
                                                    }) 
                                       } 
                               }
                    />
                  </div>
                </div>

              </form>
          }

        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-outline-primary"
            onClick={() => {
                      apikutsu();
                      suljeModal();
                    }}
          >
            Ok
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={suljeModal}
          >
            Peruuta
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;
