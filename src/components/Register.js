import { useRef, useState, useEffect} from "react";
import axios from "../api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{6,24}$/;
const REGISTER_URL = "/api/register";

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [name, setName] = useState("");
    const [nameFocus, setNameFocus] = useState(false);

    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setName(name);
    }, [name])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg("");
    }, [user, name, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (v1 === false) {
            setErrMsg("유효하지 않는 아이디 입니다.");
            return;
        }
        if (v2 === false) {
            setErrMsg("비밀번호가 맞지 않습니다.");
            return;
        }
        try {
            const body = JSON.stringify({
                username: user,
                password: pwd,
                name: name
            })
            const response = await axios.post(REGISTER_URL, body);
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser("");
            setPwd("");
            setMatchPwd("");
        } catch (err) {
            if (!err?.response) {
                setErrMsg("서버에 응답이 없습니다. 나중에 다시 시도해 주세요.");
            } else if (err.response?.status === 400) {
                setErrMsg("아이디가 이미 사용 중입니다.");
            } else if (err.response?.status >= 500) {
                setErrMsg("나중에 다시 시도해 주세요.")
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>회원가입 요청이 완료 되었습니다!</h1>
                    <p>
                        <a href="/login">로그인하기</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>회원가입</h1>
                    <form onSubmit={handleSubmit}>

                        {/****/}
                        <p id="namenote" className={nameFocus && name ? "instructions" : "offscreen"}>
                            <b>성명</b><br />
                        </p>
                        <label htmlFor="name">
                            {/*성명*/}
                        </label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            aria-describedby="namenote"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                            className={"input-box"}
                        />

                        {/****/}
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <b>아이디 입력</b><br />
                        </p>
                        <label htmlFor="username">
                            {/*아이디*/}
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            className={"input-box"}
                        />

                        {/****/}
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <b>비밀번호 입력</b><br />
                            {/*<span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>*/}
                        </p>
                        <label htmlFor="password">
                            {/*비밀번호*/}
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            className={"input-box"}
                        />

                        {/****/}
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <b>비밀번호 확인</b><br />
                        </p>
                        <label htmlFor="confirm_pwd">
                            {/*비밀번호 화인*/}
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            className={"input-box"}
                        />
                        <br/>
                        <br />
                        <button className={"button"}>회원가입</button>
                    </form>
                    <p>이미 가입 하셨나요?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="/login">로그인하기</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register