import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Post from "../components/Post";

const Home = (userObj) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);

  const onChange = (e) => {
    // const value = e.target.value; //ECMA script 2012 이전 문법
    const {
      target: { value },
    } = e; //ES6
    setPost(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        content: post,
        date: serverTimestamp(),
        uid: userObj.userObj,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.log(e);
    }
  };
  /*
  const getPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const postObj = {
        ...doc.data(),
        id: doc.id,
      };
      setPosts((prev) => [postObj, ...prev]);
    });
  };
  */

  // const test = { title: "title1", content: "content1" };
  // const textcopy = { ...test, title: "title2" };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("date"));
    onSnapshot(q, (querySnapshot) => {
      /*
      const posts = [];
      querySnapshot.forEach((doc) => {
        cities.push(doc.data().name);
      });
      */
      const postArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postArr);
    });
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="post"
          value={post}
          placeholder="포스트 쓰기"
          onChange={onChange}></input>
        <input type="submit" value="입력"></input>
      </form>
      <ul>
        {posts.map((item) => (
          <Post
            key={item.id}
            postObj={item}
            userConfirm={item.uid === userObj.userObj}></Post>
        ))}
      </ul>
    </div>
  );
};

export default Home;
