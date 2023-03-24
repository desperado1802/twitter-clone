import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import Modal from "react-modal";
import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import Picker from "@emoji-mart/react";
import { useRouter } from "next/router";

export default function CommentModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const [input, setInput] = useState("");
  const [pickerVisibility, setPickerVisibility] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const addEmoji = (e) => {
    const emoji = e.native;
    setInput(input + emoji);
  };

  const sendComment = async () => {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: input,
      name: session.user.name,
      username: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
      userID: session.user.uid,
    });

    setInput("");
    setOpen(false);
    router.push(`/posts/${postId}`);
  };

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot.data());
    });
  }, [postId, db]);

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpen(false)}
                className="hoverEffect w-9 h-9 flex items-center justify-center p-0"
              >
                <XIcon className="h-[22px] text-gray-700" />
              </div>
            </div>
            <div className="p-2 flex items-center space-x-1 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300"></span>
              <img
                className="h-11 w-11 rounded-full mr-4"
                src={post?.userImg}
                alt="profile-pic"
              />
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {post?.name}
              </h4>
              <span className="text-sm sm:text-[15px]">
                @{post?.username} -{" "}
              </span>
              <span className="text-sm sm:text-[15px] hover:underline">
                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </span>
            </div>
            <p className="text-gray-500 text-[15px]  sm:text-[16px] ml-16 mb-2">
              {post?.text}
            </p>

            <div className="flex p-3 space-x-3">
              <img
                src={session?.user.image}
                alt="profile picture"
                className="h-11 rounded-full cursor-pointer hover:brightness-95"
              />
              <div className="w-full divide-y divide-gray-200">
                <div className="">
                  <textarea
                    placeholder="Tweet your reply"
                    rows="2"
                    className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700 "
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2.5">
                  <div className="flex relative">
                    <div
                      className=""
                      onClick={() => filePickerRef.current.click()}
                    >
                      <PhotographIcon className="hoverEffect h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 " />
                      {/* <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      /> */}
                    </div>
                    <EmojiHappyIcon
                      onClick={() => setPickerVisibility(!pickerVisibility)}
                      className="hoverEffect h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 "
                    />
                    <div
                      className={`${
                        pickerVisibility ? "block" : "hidden"
                      } absolute top-[100%]`}
                    >
                      <Picker
                        set="twitter"
                        // data={data}
                        emojiSize={22}
                        emojiButtonSize={28}
                        onEmojiSelect={addEmoji}
                        onClickOutside={() => {
                          if (pickerVisibility) {
                            setPickerVisibility(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={sendComment}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
