import Home_Hero from "../components/Home_Hero";
import Home_Services from "../components/Home_Services";
import HomeModules from "../components/Home_Modules";
import BadgeGrid from "../components/BadgeGrid";
import Footer from "../components/footer";
import WhatsappFloat from "../components/WhatsappFloat";
import WhatsappPopup from "../components/WhatsappPop";
import BackToTop from "../components/BackToTop";


export default function Home() {
  return (
    <div className="space-y-24">

<Home_Hero/>
<Home_Services/>
<HomeModules/>
<BadgeGrid/>
<Footer/>
<WhatsappFloat/>  
<WhatsappPopup/>
<BackToTop/>
    </div>
  );
}
