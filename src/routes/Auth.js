import React, { useState } from "react";
import { authService } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true); //기본값 : 신규유저
  const [error, setError] = useState("");
  const auth = getAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    if (newAccount) {
      //Create Account 회원가입
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setError(errorMessage);
        });
    } else {
      //로그인
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };
  const onChange = (e) => {
    // let name = e.target.value;
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(token, user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>
          <input
            name="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={onChange}
          />
        </p>
        <button type="submit">{newAccount ? "계정생성" : "로그인"} </button>
        <button type="button" onClick={onSocialClick}>
          {newAccount ? "구글로 계정 생성" : "구글로 로그인"}
        </button>
      </form>
      <hr />
      <button type="button" onClick={toggleAccount}>
        {newAccount ? "로그인" : "계정생성"}
      </button>
      {error}
    </div>
  );
};

export default Auth;
