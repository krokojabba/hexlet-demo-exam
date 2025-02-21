import { useNavigate } from 'react-router-dom'
export default function PartnerCard({ partner }) {
  const navigate = useNavigate()

  return (
    <div
      className="partner-card"
      onClick={() => navigate('/partner/update', { state: { partner } })}
    >
      <div className="partner-card-heading">
        <h2>{`${partner.type} | ${partner.name}`}</h2>
        <h2>{partner.discount} %</h2>
      </div>
      <div>
        <p>{partner.fio}</p>
        <p>{partner.phone_number}</p>
        <p>Рейтинг: {partner.rating}</p>
      </div>
    </div>
  )
}
