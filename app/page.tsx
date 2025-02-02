import { Controls } from "@/components/Controls";
import Scene from "@/components/Scene";

export default function Home() {


  return (
    <main className="h-screen w-full overflow-hidden bg-gradient-to-r from-violet-200 to-pink-200">
      <h1 className="text-3xl font-semibold p-4">Algorithm Visualizer</h1>
      <Scene/>
      <Controls/>
    </main>
  );
}
