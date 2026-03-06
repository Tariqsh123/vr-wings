import Home_Hero from "../components/Home_Hero";
import Home_Services from "../components/Home_Services";
import Footer from "../components/footer";


export default function Home() {
  return (
    <div className="space-y-24">

<Home_Hero/>
<Home_Services/>
<Footer/>
    </div>
  );
}
