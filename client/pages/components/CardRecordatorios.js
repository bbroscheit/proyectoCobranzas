import React, {useState , useEffect } from 'react'
import style from '../modules/cardrecordatorios.module.css'
import { FaTelegramPlane } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

function CardRecordatorios() {
  const [notas , setNotas] = useState(0)

  useEffect(() => {
    fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/allNotesInMonth`)
    .then(res => res.json())
    .then(data => {
      setNotas(data.length)
    })
  }, [])

  console.log(notas)

  return (
    <div className={style.cardContainer}>
        <div className={style.titulos}>
            <FaTelegramPlane className={style.iconos}/>
            <div className={style.gestiones}>
                <div className={style.numerogestion}>
                  {
                    notas > 0 ? <h1>{notas}</h1> : <h1>0</h1>
                  }
                    <FaArrowUp className={style.icononumerogestionup}/>
                </div>
                <p>.</p>
            </div>
        </div>
        { 
notas > 0 ? <p className={style.piedepagina}> {notas} Notas este mes</p> : <p className={style.piedepagina}> No hay notas este mes</p>
        }
        
    </div>
  )
}

export default CardRecordatorios