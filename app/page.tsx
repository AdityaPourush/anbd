import Message from "@/Components/Message";
import Photowishes from "@/Components/Photowishes";
import Wishes from "@/Components/Sections";
import Wishing from "@/Components/Wishing";

export default function Home() {
  return (
    <main className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <Wishing />
      <Wishes/>
      <Photowishes/>
      <Message/>
    </main>
  );
}