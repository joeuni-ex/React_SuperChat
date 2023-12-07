import {
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "./firebase";
// react-icon
import { TbSend } from "react-icons/tb";

const ChatRoom = () => {
  const dummy = useRef(); //html을 선택하기 위한 객체
  //자바스크립트를 쓸때는 쿼리셀렉터를 사용했는데, 리액트에는 항상 변하기 때문에 useRef를 사용한다 .
  const [formValue, setFormValue] = useState(""); //메세지 저장
  const messagesRef = collection(db, "messages"); //컬렉션 자동으로 생성됨
  //qurey -> 생성일자 기준으로 정렬 , 최대 25개까지
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  //실시간 메세지들을 가져온다.
  const [messages] = useCollectionData(q); //import 필요

  //submit 시 실행되는 함수
  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(auth.currentUser); // 유저 정보 출력해보기
    const { uid, photoURL } = auth.currentUser; //인증객체 auth에서 현재 유저 정보를 가져옴

    //addDoc import 필요 messages 컬렉션에 저장함
    await addDoc(messagesRef, {
      text: formValue, //메세지
      createdAt: serverTimestamp(), //생성일자 import 필요
      uid, // user.id
      photoURL, // 유저 프로필 사진
    });

    setFormValue(""); // 저장이 다 되면 공백으로 저장
  };

  //채팅 추가 시 제일 최근의 채팅으로 자동스크롤
  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <main>
        {/* 메세지들이 있으면 map반복문으로 출력한다.  */}
        {messages &&
          messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="메세지를 입력하세요~"
        />
        {/* 메세지에 값이 저장되어있지앟으면 disabled(클릭못함) */}
        <button type="submit" disabled={!formValue} className="chatBtn">
          <TbSend />
        </button>
      </form>
    </>
  );
};

//ChatMessage 컴포넌트 -> 반복문 시 해당 컴포넌트 사용
//message의 모든 내용을 props로 받는다.
function ChatMessage(props) {
  // props의 객체들을 분리한다.
  const { text, uid, photoURL } = props.message;

  //글쓴사람의 uid가 본인과 같으면 클래스는 sent  아니면 received (받은것) 왼쪽 오른쪽 구분
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      {/* 위에서 함수로 만든 class 넣음(본인/상대방) */}
      <div className={`message ${messageClass}`}>
        <img
          src={
            // 구글 계정에 프로필이 없는 사람은 샘플이미지 들어감
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p className="chat">{text}</p>
      </div>
    </>
  );
}

export default ChatRoom;
