const Cart = ()=>{
    const montera = 8
    const lierre = 10
    const bouquet = 15
    return(
        <div>
            <h2>Panier</h2>
            <ul>
                <li>Monstera : {montera}$</li>
                <li>Lierre : {lierre}$</li>
                <li>Bouquet : {bouquet}$</li>
            </ul>
            <p>Total : {montera + lierre + bouquet}$</p>
        </div>
    )
}

export default Cart