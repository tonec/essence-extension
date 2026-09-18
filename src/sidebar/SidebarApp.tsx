import { Button } from "@/components/ui/button";
import reactLogo from "../images/icon.png";

export default function SidebarApp() {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div className="sidebar_app">
      <header>
        <img
          className="sidebar_logo"
          src={reactLogo}
          alt="The React logo"
          width="120"
        />
        <h1 className="sidebar_title">Essence</h1>
        <Button variant="outline" onClick={handleClick}>
          Button
        </Button>
      </header>
    </div>
  );
}
