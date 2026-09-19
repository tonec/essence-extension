import { Button } from "@/components/ui/button";
import reactLogo from "../images/icon.png";
import { FETCH_X_DATA } from "@/config";

export default function SidebarApp() {
  const handleClick = async () => {
    try {
      const response = await browser.runtime.sendMessage({
        target: "background",
        action: FETCH_X_DATA,
      });
      console.log("Reponse ", response);
    } catch (error) {
      console.error("Error communicating:", error);
    }
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
          Trigger sync
        </Button>
      </header>
    </div>
  );
}
