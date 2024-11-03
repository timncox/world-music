"use client";

import { useSession, signIn } from "next-auth/react";
import { Music } from "lucide-react";
import { AudioPlayer } from "./components/audio-player";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="space-y-8">
          <div className="text-center">
            <Music className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
            <h1 className="text-3xl font-bold mb-2">Track of the Day</h1>
            <h2 className="text-xl text-indigo-400 mb-4">
              Arushi Jain - My People Have Deep Roots
            </h2>
          </div>

          <div className="aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-indigo-400">
            <img
              src="https://timncox.github.io/aj.jpeg"
              alt="Album artwork"
              className="w-full h-full object-cover"
            />
          </div>

          <AudioPlayer
            isUnlocked={!!session}
            audioUrl="https://timncox.github.io/ajroots.m4a"
          />

          {!session && !isLoading && (
            <div className="text-center">
              <p className="text-gray-300 mb-4">Sign in with World ID to listen</p>
              <button
                onClick={() => signIn("worldcoin")}
                className="w-full py-4 px-6 rounded-lg flex items-center justify-center space-x-2 text-lg font-semibold bg-indigo-500 hover:bg-indigo-600 transition-all"
              >
                Sign in with World ID
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center text-indigo-400">
              Loading...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}