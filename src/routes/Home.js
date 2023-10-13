import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  onSnapshot,
  query,
  orderBy,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Post from "../components/Post";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = (userObj) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [attachment, setAttachment] = useState();

  const onChange = (e) => {
    //const val = e.target.value; //ECMA Script 2012
    const {
      target: { value },
    } = e; //ES6
    setPost(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const storage = getStorage();
    const storageRef = ref(storage, `${userObj.userObj}/${uuidv4()}`);

    uploadString(storageRef, attachment, "data_url").then(async (snapshot) => {
      let attachmentUrl = await getDownloadURL(storageRef);

      try {
        await addDoc(collection(db, "posts"), {
          content: post,
          date: serverTimestamp(),
          uid: userObj.userObj,
          attachmentUrl,
        });
        attachmentUrl = "";
      } catch (e) {
        console.log(e);
      }
    });
  };
  /*
  const getPosts = async () =>{
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const postObj = {
        ...doc.data(),
        id:doc.id
      }      
      setPosts((prev)=>[postObj,...prev]);
    });
  }
  */

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
      console.log(postArr);
    });
  }, []);
  const onFileChange = (e) => {
    console.log(e.target.files[0]);
    // const theFile = e.target.files[0];
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (e) => {
      setAttachment(e.target.result);
    };
    reader.readAsDataURL(theFile);
  };
  const onFileClear = () => {
    setAttachment(null);
    document.querySelector("#attachment").value = null;
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>
          <label htmlFor="content">내용: </label>
          <input
            type="text"
            id="content"
            name="post"
            value={post}
            placeholder="포스트 쓰기"
            onChange={onChange}></input>
        </p>
        <p>
          <label htmlFor="attachment">첨부이미지:</label>
          <input
            type="file"
            onChange={onFileChange}
            id="attachment"
            accept="images/*"
          />
          {attachment && (
            <div>
              <img src={attachment} alt="" width="50" height="50" />
              <button type="button" onClick={onFileClear}>
                이미지 취소
              </button>
            </div>
          )}
        </p>
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
