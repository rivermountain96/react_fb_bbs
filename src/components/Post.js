import React, { useState } from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Post = ({ postObj, userConfirm }) => {
  console.log(postObj);
  const deletePost = async () => {
    if (window.confirm("정말 삭제할까요?")) {
      await deleteDoc(doc(db, "posts", postObj.id));
    }
  };

  const [edit, setEdit] = useState(false);
  const [newPost, setNewPost] = useState(postObj.content);
  const toggleEditMode = () => setEdit((prev) => !prev);
  const onChange = (e) => {
    //setNewPost(e.target.value)
    const {
      target: { value },
    } = e;
    setNewPost(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const postRef = doc(db, "posts", postObj.id);
    await updateDoc(postRef, {
      content: newPost,
    });
    setEdit(false);
  };

  return (
    <li>
      {edit ? (
        <>
          <form onSubmit={onSubmit}>
            <input value={newPost} onChange={onChange} required />
            <button>Update Post</button>
          </form>
          <button onClick={toggleEditMode}>Cancle</button>
        </>
      ) : (
        <>
          <h4>{postObj.content}</h4>
          {userConfirm && (
            <>
              <button onClick={deletePost}>Delete</button>
              <button onClick={toggleEditMode}>Edit</button>
            </>
          )}
        </>
      )}
    </li>
  );
};

export default Post;
