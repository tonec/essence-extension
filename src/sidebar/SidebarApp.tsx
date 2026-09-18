import { Button } from "@/components/ui/button";
import reactLogo from "../images/icon.png";

export default function SidebarApp() {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="flex flex-col items-center justify-center">
        <img
          className="pb-1"
          src={reactLogo}
          alt="The React logo"
          width="120"
        />
        <h1 className="text-xl font-bold pb-2">Essence</h1>
        <Button variant="outline" onClick={handleClick}>
          Button
        </Button>
      </header>
    </div>
  );
}
