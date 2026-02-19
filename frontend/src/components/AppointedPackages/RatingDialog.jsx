import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/InputArea";
import { TextArea } from "@/components/ui/TextArea";
import { useToast } from "@/hooks/useToast";
import { useMemo, useState } from "react";
import axiosApiCall from "@/lib/axiosApiCall";
import { Button } from "@/components/ui/Button";
import { ProfilePicture, ProfilePictureFallback, ProfilePictureImage } from "@/components/ui/ProfilePicture";
import useAuth from "@/hooks/useAuth";
import { Label } from "@/components/ui/Label";

const StarSelector = ({ value, onChange, max = 5 }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-3 justify-center ">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const active = hover ? starValue <= hover : starValue <= value;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            className={`
              text-5xl transition-colors
              ${active ? "text-yellow-400" : "text-gray-500 dark:text-gray-300"}
            `}
            aria-label={`Rate ${starValue} star`}>
            ★
          </button>
        );
      })}
    </div>
  );
};

const RatingDialog = ({ packageData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [ratingsData, setRatingsData] = useState({ rating: 0, comment: "" });
  const { toast } = useToast();
  const { user } = useAuth();

  const authUser = useMemo(() => {
    if (!user) return null;
    return user.user ?? user;
  }, [user]);

  const firstName = authUser?.firstName ?? "";
  const lastName = authUser?.lastName ?? "";
  const profilePicture = authUser?.profilePicture ?? "";

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";

  const handleSubmitReview = async () => {
    try {
      if (!packageData?._id) {
        toast({
          title: "Error",
          description: "Missing package id.",
          variant: "destructive",
        });
        return;
      }

      if (ratingsData.rating < 1 || ratingsData.rating > 5) {
        toast({
          title: "Invalid rating",
          description: "Please select a star rating.",
          variant: "destructive",
        });
        return;
      }

      const postman = {
        rating: ratingsData.rating,
        comment: ratingsData.comment,
        packageId: packageData._id,
        deliveryDriverId:
          packageData?.deliveryDriverId?._id ?? packageData?.deliveryDriverId,
      };

      const response = await axiosApiCall.post(
        "/api/v1/package/ratings",
        postman
      );

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Rating Added",
          description: "Successfully submitted rating!",
        });

        setOpenDialog(false);
        setRatingsData({ rating: 0, comment: "" });
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (err) {
      console.error("submit rating error:", err);
      toast({
        title: "Error",
        description: "Failed to submit rating!",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          type="button">
          Leave a Rating
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Submit a Rating
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-gray-900 dark:text-gray-100">
          <div className="flex gap-4 items-center">
            <ProfilePicture className="w-20 h-20 rounded-full">
              <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-red-600">
                <ProfilePictureImage
                  src={profilePicture}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"/>
                <ProfilePictureFallback className="flex items-center justify-center">
                  {initials}
                </ProfilePictureFallback>
              </div>
            </ProfilePicture>

            <div className="flex-1">
              <Label>First Name</Label>
              <Input
                value={firstName}
                readOnly
                className="bg-gray-200 dark:bg-zinc-700 border border-gray-900 dark:border-gray-100 cursor-not-allowed"/>
            </div>

            <div className="flex-1">
              <Label>Last Name</Label>
              <Input
                value={lastName}
                readOnly
                className="bg-gray-200 dark:bg-zinc-700 border border-gray-900 dark:border-gray-100 cursor-not-allowed"/>
            </div>
          </div>

          <div>
            <Label>Delivery Driver ID</Label>
            <Input
              value={
                packageData?.deliveryDriverId?._id ??
                packageData?.deliveryDriverId ??
                ""
              }
              readOnly
              className="bg-gray-200 dark:bg-zinc-700 border border-gray-900 dark:border-gray-100 cursor-not-allowed"/>
          </div>

          <div>
            <Label className="mb-1 block text-center">Your Rating</Label>
            <StarSelector
              value={ratingsData.rating}
              onChange={(rating) =>
                setRatingsData((prev) => ({ ...prev, rating }))
              }/>
            {ratingsData.rating > 0 && (
              <p className="sr-only">{ratingsData.rating} / 5</p>
            )}
          </div>

          <div>
            <Label>Comment</Label>
            <TextArea
              className="bg-gray-200 dark:bg-zinc-700 border border-gray-900 dark:border-gray-100"
              value={ratingsData.comment}
              onChange={(e) =>
                setRatingsData((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }/>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            type="button"
            onClick={handleSubmitReview}
            disabled={!ratingsData.rating || !ratingsData.comment}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;