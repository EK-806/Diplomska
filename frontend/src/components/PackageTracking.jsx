import { LocateFixed } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/InputArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";

export default function TrackPackage() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTrack = () => {
    const id = trackingId.trim();

    if (!id) {
      toast({
        title: "Missing tracking ID",
        description: "Please enter a tracking ID to track your package.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/track/${encodeURIComponent(id)}`);
  };

  return (
    <div className="bg-card dark:bg-dark-card p-3 rounded-lg border-2 border-gray-900 dark:border-border bg-opacity-50 dark:bg-opacity-50 backdrop-blur-sm">
      <h4 className="mb-3 text-[22px] font-semibold text-gray-900 dark:text-white">Track your package:</h4>

      <div
        className="
          flex items-stretch overflow-hidden rounded-lg
          border border-gray-900 dark:border-gray-100
          bg-gray-200 dark:bg-zinc-700
          focus-within:ring-2 focus-within:ring-red-600
          focus-within:ring-offset-2
          focus-within:ring-offset-background
          dark:focus-within:ring-offset-dark-background">
        <Button
          type="button"
          tabIndex={-1}
          className="
            px-4 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500
            text-black border-r border-gray-900 dark:border-gray-100
            rounded-none cursor-default flex items-center justify-center">
          <LocateFixed className="text-[#CE0000]"/>
        </Button>

        <Input
          placeholder="Enter tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTrack();
          }}
          className="
            flex-1 border-0 rounded-none bg-transparent
            text-[15px] text-gray-900 dark:text-white
            placeholder:text-gray-900 dark:placeholder:text-gray-100
            font-medium focus-visible:ring-0 focus-visible:ring-offset-0"/>

        <Button
          variant="default"
          className="
            px-5 bg-yellow-400 text-red-600
            hover:bg-yellow-500 hover:text-red-700
            dark:bg-yellow-400 dark:text-red-600
            dark:hover:bg-yellow-500 dark:hover:text-red-700
            font-semibold text-[15px]
            border-l border-gray-900 dark:border-gray-100
            rounded-none rounded-r-lg"
          onClick={handleTrack}>
          Track
        </Button>
      </div>
    </div>
  );
}