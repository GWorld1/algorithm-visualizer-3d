"use client";
import { Controls } from "@/components/AnimationControls";
import ArrayController from "@/components/ArrayController";
import Scene from "@/components/Scene";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
export default function Home() {

  const { dataStructure } = useAlgorithmStore();

  return (
    <main className="h-screen w-full overflow-hidden bg-gradient-to-r from-violet-200 to-pink-200">
      <h1 className="text-3xl font-semibold p-4 text-white">3D Algorithm Visualizer</h1>
      <Scene/>
      <Controls/>
        {dataStructure === 'array' && <ArrayController/>}
      
      <footer className="absolute bottom-0 right-0 p-4">
        <p className="text-sm text-gray-500">
          Created by Gnowa Rickneil | 
          <a href="https://github.com/GWorld1">
            <img src="/github-icon.svg" alt="Github" className="w-4 h-4 inline-block ml-1" />
          </a>
        </p>
      </footer>
    </main>
  );
}
