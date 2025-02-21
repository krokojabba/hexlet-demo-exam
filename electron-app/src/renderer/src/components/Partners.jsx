import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PartnerCard from './PartnerCard'
import logo from '../../../../resources/icon.png'

export default function Partners() {
  const navigate = useNavigate()
  const [partners, setPartners] = useState([])
  useEffect(() => {
    const requestData = async () => {
      const res = await window.api.getPartners()
      console.log(res)
      setPartners(res)
    }
    requestData()
  }, [])

  return (
    <div className="container">
      <img className="page-logo" src={logo} alt="" />
      <h1>Партнеры</h1>
      <div className="partner-list">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
      <button onClick={() => navigate('/partner/create')}>Добавить партнера</button>
    </div>
  )
}
