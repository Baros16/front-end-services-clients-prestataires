const plantList = [
  {
    name: 'monstera',
    category: 'classique',
    id: '1ed',
    isBestSale: true
  },
  {
    name: 'ficus lyrata',
    category: 'classique', 
    id: '2ab',
    isBestSale: false
  },
  {
    name: 'pothos argenté',
    category: 'classique',
    id: '3sd',
    isBestSale: false
  },
  {
    name: 'yucca',
    category: 'exterieur',
    id: '4kk',
    isBestSale: true
  },
  {
    name: 'palmier',
    category: 'exterieur',
    id: '5pl',
    isBestSale: false
  }
]

const ShoppingList = () => {
  return (
    <ul>
      {plantList.map((plant, index) => (
        <li key={plant.id}>
            {plant.isBestSale && <span>🔥 </span>}
            {plant.name}
        </li>
      ))}
    </ul>
  )
}

export default ShoppingList