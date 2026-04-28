export default function Bouton({ value, onClick }) {
    return (
        <div>
            <button onClick={onClick}>{value}</button>
        </div>
    )
}