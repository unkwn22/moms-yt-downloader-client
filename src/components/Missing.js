import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>이런!</h1>
            <p>요청한 페이지를 찾지 못했습니다.</p>
            <div className="flexGrow">
                <Link to="/login">돌아가기</Link>
            </div>
        </article>
    )
}

export default Missing