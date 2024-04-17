import { useRef, useState, useEffect} from "react";
import useAuth from "../hooks/useAuth"
import { useNavigate, useLocation } from 'react-router-dom';

import axios from "../api/axios";
const LOGIN_URL = '/api/login';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({
                    username: user,
                    password: pwd
                })
            );
            const accessToken = response?.data?.message;
            const role = "user";
            setAuth({ user, pwd, role,  accessToken });
            setPwd('');
            setUser('');
            navigate(from, { replace: true });
        } catch (err) {
            if (err.response?.status === 404) {
                setErrMsg('계정 정보가 잘못 되었습니다.');
            } else if (err.response?.status === 401) {
                setErrMsg('허가 되지 않은 계정입니다');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">아이디:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />

                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <br/>
                    <button>Sign In</button>
                </form>
                <p>
                    <span className="line">
                        {/*put router link here*/}
                        <a href="/register">회원가입</a>
                    </span>
                </p>
            </section>
        </>
    )
}

export default Login;