import {useNavigate, useLocation} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const { auth } = useAuth();

    const [videos, setVideos] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [usePageToken, setUsePageToken] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const [vidId, setVidId] = useState("");
    const [originName, setOriginName] = useState("");

    const [isLoading, setLoading] = useState(false);

    const logout = async () => {
        setAuth({});
        navigate("/login");
    }

    const search = async() => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();
        try {
            const response = await axios.get('/search', {
                signal: controller.signal,
                params: {query: searchQuery, pageToken: usePageToken},
                headers: {Authorization: "Bearer " + auth.accessToken},
            })

            isMounted && setVideos(response.data);
            console.log(response.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                navigate('/unauthorized', {state: {from: location}, replace: true});
            }
        } finally {
            setLoading(false);
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setVideos([]);
        setUsePageToken("");

        if(!auth.accessToken || auth.accessToken === "") {
            await navigate('/unauthorized', { state: { from: location }, replace: true });
        } else {
            await search();
        }
    }

    const handlePage = async (e) => {
        e.preventDefault();
        setVideos([]);

        if(!auth.accessToken || auth.accessToken === "") {
            await navigate('/unauthorized', { state: { from: location }, replace: true });
        } else {
            await search();
        }
    }

    const handleDownload = async (e) => {
        e.preventDefault();

        if(!auth.accessToken || auth.accessToken === "") {
            await navigate('/unauthorized', { state: { from: location }, replace: true });
        } else {
            await download();
        }
    }

    const download = async() => {
        let isMounted = true;
        setLoading(true);
        const controller = new AbortController();
        let s3Url = "";
        console.log(originName)
        try {
            const response = await axios.get('/download', {
                signal: controller.signal,
                params: {videoId: vidId, originalTitle: originName},
                headers: {Authorization: "Bearer " + auth.accessToken},
            })
            s3Url = response.data.data;

        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                navigate('/unauthorized', {state: {from: location}, replace: true});
            }
        } finally {
            setLoading(false);
            console.log(s3Url);
            window.open(s3Url, "_blank");
        }

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    return (
        <section>
            {isLoading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className={isLoading ? "disabled" : "flexGrow"}>
                <button onClick={logout}>로그아웃</button>
            </div>
            <h1>검색</h1>
            <form onSubmit={handleSubmit}>
                <div className={isLoading ? "disabled" : "flexGrow"}>
                    <input
                        type="text"
                        id="searchQuery"
                        autoComplete="off"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className={"input-box"}
                    />
                    <button className={"button"}>검색</button>
                </div>
            </form>
            <article className={isLoading ? "disabled" : ""}>
                <h2>검색 결과</h2>
                {videos.data ? (
                    <div>
                        {videos.data.items.map((item, index) => (
                            <li key={index}>
                                <div className={isLoading ? "disabled" : "video-container"}>
                                    <div>
                                        <img className={"image-container"} src={item.snippet.thumbnails.default.url} alt="Thumbnail" onClick={() => window.open(`https://youtube.com/watch?v=${item.id.videoId}`, '_blank')}/>
                                        <h3>{item.snippet.title}</h3>
                                    </div>
                                    <br />
                                    <form onSubmit={handleDownload}>
                                        <div>
                                            <button className={"download-button"} onClick={() => { setVidId(item.id.videoId); setOriginName(item.snippet.title); }}>다운받기</button>
                                        </div>
                                    </form>
                                </div>
                            </li>
                        ))}
                    </div>
                ) : (
                    <p>조회된 영상이 없습니다.</p>
                )}
            </article>
            <footer>
                <div>
                    {videos.data ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            {
                                videos.data.prevPageToken ? (
                                    <form onSubmit={handlePage}>
                                    <>
                                    <button onClick={() => setUsePageToken(videos.data.prevPageToken)}>전 페이지</button>
                                    </>
                                    </form>
                                ) : (
                                    <div></div>
                                )
                            }
                            {
                                videos.data.nextPageToken ? (
                                    <form onSubmit={handlePage}>
                                    <>
                                    <button className={"page-button"} onClick={() => setUsePageToken(videos.data.nextPageToken)}>다음 페이지</button>
                                    </>
                                    </form>
                                ) : (
                                    <div></div>
                                )
                            }
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            </footer>
        </section>
    );
}

export default Home