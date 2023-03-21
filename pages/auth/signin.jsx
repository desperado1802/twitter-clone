import React from "react";
import { getProviders, signIn } from "next-auth/react";

export default function signin({ providers }) {
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        className="hidden md:inline-flex object-cover md:w-44 h-80 rotate-6"
        src="https://www.tweetings.net/images/iphone-app-470.png"
        alt="twitter image"
      />
      <div className="">
        {Object.values(providers).map((provider) => (
          <div key={provider.id} className="flex flex-col items-center">
            <img
              className="w-36 object-cover "
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/1200px-Twitter-logo.svg.png"
              alt="twitter logo"
            />
            <p className="text-center text-sm italic my-10 ">
              This app is created for educational purposes
            </p>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="bg-red-500 rounded-lg p-3 text-white hover:bg-red-600"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
