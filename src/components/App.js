import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user.uid);
      }
      setInit(true);
    });
  }, []);

  console.log(userObj);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "회원정보 확인중..."
      )}
    </>
  );
}

export default App;
