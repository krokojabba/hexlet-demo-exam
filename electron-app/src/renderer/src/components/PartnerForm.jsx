import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const map = {
  '/partner/update': {
    formName: 'Обновить партнера',
    apiMethod: window.api.updatePartner
  },
  '/partner/create': {
    formName: 'Создать партнера',
    apiMethod: window.api.createPartner
  }
}

export default function PartnerForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const [partnerTypes, setPartnerTypes] = useState([])
  const [partner, setPartner] = useState(
    location.state?.partner ?? {
      name: '',
      address: '',
      email: '',
      fio: '',
      phone_number: '',
      rating: ''
    }
  )
  useEffect(() => {
    const requestData = async () => {
      const res = await window.api.getPartnerTypes()
      setPartnerTypes(res)
      setPartner({ ...partner, partner_type_id: res[0].id })
    }
    requestData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(partner)
    await map[location.pathname].apiMethod(partner)
  }

  const handleChange = (e) => {
    const propName = e.target.name
    const propValue = e.target.value
    setPartner({ ...partner, [propName]: propValue })
  }
  return (
    <div className="form">
      <h1>{map[location.pathname].formName}</h1>
      <button onClick={() => navigate('/', { replace: false })}>Назад</button>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="name">Наименование:</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={partner.name}
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="partner_type_id">Тип партнера:</label>
        <select
          value={partner.partner_type_id}
          onChange={(e) => handleChange(e)}
          id="partner_type_id"
          name="partner_type_id"
          required
        >
          {partnerTypes.map((partnerType) => (
            <option key={partnerType.id} value={partnerType.id}>
              {partnerType.type}
            </option>
          ))}
        </select>
        <label htmlFor="rating">Рейтинг:</label>
        <input
          id="rating"
          name="rating"
          type="number"
          step="1"
          min="0"
          max="100"
          required
          value={partner.rating}
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="address">Адрес:</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={partner.address}
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="fio">ФИО директора:</label>
        <input
          id="fio"
          name="fio"
          type="text"
          required
          value={partner.fio}
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="phone_number">Телефон:</label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          required
          value={partner.phone_number}
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="email">Email компании:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={partner.email}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  )
}
