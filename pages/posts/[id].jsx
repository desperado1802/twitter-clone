import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import CommentModal from "@/components/CommentModal";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Post from "@/components/Post";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Comment from "@/components/Comment";
import { AnimatePresence, motion } from "framer-motion";

export default function PostPage({ newsResults, randomUsersResults }) {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, SetComments] = useState([]);

  //get post data

  useEffect(
    () => onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot)),
    [db, id]
  );

  //get comments of the post
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        SetComments(snapshot.docs);
      }
    );
  }, [db, id]);
  return (
    <>
      <Head>
        <title>Post Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen mx-auto 2xl:ml-32">
        {/* Sidebar */}

        <Sidebar />

        {/* Field */}

        <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
          <div className="flex items-center space-x-1 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="hoverEffect" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="h-5 " />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              Tweet
            </h2>
          </div>
          <Post id={id} post={post} />
          {comments.length > 0 && (
            <div className="">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Comment
                      key={comment.id}
                      commentId={comment.id}
                      originalPostId={id}
                      comment={comment.data()}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Widgets */}
        <Widgets
          newsResults={newsResults.articles}
          randomUsersResults={randomUsersResults.results}
        />

        {/* Modal */}
        <CommentModal />
      </main>
    </>
  );
}

// https://saurav.tech/NewsAPI/top-headlines/category/business/us.json

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((result) => result.json());

  // Who to follow section api
  const randomUsersResults = await fetch(
    "https://randomuser.me/api/?results=50&inc=name,login,picture"
  ).then((result) => result.json());

  return {
    props: {
      newsResults,
      randomUsersResults,
    },
  };
}
