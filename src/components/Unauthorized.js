import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>Unauthorized</h1>
            <br />
            <p>접근이 불가합니다.</p>
            <div className="flexGrow">
                <button onClick={goBack}>뒤로가기</button>
            </div>
        </section>
    )
}

export default Unauthorized