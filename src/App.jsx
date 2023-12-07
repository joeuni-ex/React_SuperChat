import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleAuth } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import ChatRoom from "./ChatRoom";
// react-icon
import { FcGoogle } from "react-icons/fc";
import { MdLogout } from "react-icons/md";

function App() {
  const [user, loading, error] = useAuthState(auth);
  console.log(user);
  //로딩중, 에러일 경우 출력함
  if (loading) {
    return (
      <div>
        <p>로딩중...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error:{error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>⚛️React Chat💬</h1>
        {/* 로그인이 되어있으면 로그아웃 보여줌 */}
        {user && <SignOut />}
      </header>
      {/* 로그인이 되어있으면 채팅룸을 보여주고 아니면 signIn보여줌 */}
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

// SignIn 컴포넌트 -signInWithPopup import필요
function SignIn() {
  //구글 인증 버튼 클릭 시 실행
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="main-text">
        <p className="start-main">시작하기</p>
      </div>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google <FcGoogle />
      </button>
      <div className="main-text">
        {/* <p>🌱 커뮤니티에서 예의를 지켜주세요 😁</p> */}
      </div>
    </>
  );
}

// SignOut 컴포넌트 -signout import 필요
function SignOut() {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="sign-out" onClick={logout}>
      <MdLogout style={{ fontWeight: "bold" }} />
    </button>
  );
}
export default App;
