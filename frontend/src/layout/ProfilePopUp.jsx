import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/InputArea";
import { Label } from "@/components/ui/Label";
import { ProfilePicture, ProfilePictureFallback, ProfilePictureImage } from "@/components/ui/ProfilePicture";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import useAuth from "@/hooks/useAuth";
import axiosApiCall from "@/lib/axiosApiCall";

export default function ProfilePopUp({ open, onClose }) {
  const { user, loading, fetchUser } = useAuth();
  const { toast } = useToast();
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const u = useMemo(() => {
    if (!user) return null;
    return user.user ?? user;
  }, [user]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) setProfilePicturePreview(null);
  }, [open]);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setProfilePicturePreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setIsUploading(true);

      const response = await axiosApiCall.put(
        "/api/v1/user/change-profile-picture",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Profile picture successfully updated!",
        });
        await fetchUser();
      } else {
        throw new Error(
          response.data?.message || "Profile picture update failed!"
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while uploading your profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const initials =
    `${u?.firstName?.[0] || ""}${u?.lastName?.[0] || ""}`.trim() || "U";

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999]">
      <div className="absolute inset-0 bg-transparent" onClick={onClose}/>

      <div
        ref={modalRef}
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[95%] max-w-lg rounded-xl
          border-2 border-black dark:border-white
          bg-card dark:bg-dark-card shadow-2xl
          text-foreground dark:text-dark-foreground"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-900 dark:border-gray-100">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 bg-red-600 hover:bg-red-700 text-white border-2 border-gray-900 dark:border-gray-100"
            aria-label="Close">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {loading || !u ? (
            <div className="py-10 text-center">Loading...</div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="p-[2.5px] rounded-full bg-red-600 shadow-lg">
                  <ProfilePicture className="h-28 w-28 rounded-full bg-card dark:bg-dark-card">
                    <ProfilePictureImage
                      src={profilePicturePreview || u?.profilePicture || ""}
                      alt="Profile Picture"/>
                    <ProfilePictureFallback>{initials}</ProfilePictureFallback>
                  </ProfilePicture>
                </div>

                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}/>

                <Button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="border-2 border-gray-900 dark:border-gray-100 flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white">
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4"/> Upload
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={`${u?.firstName || ""} ${u?.lastName || ""}`.trim()}
                    disabled
                    readOnly
                    className="
                      bg-gray-200 dark:bg-zinc-700
                      border border-black dark:border-white
                      disabled:opacity-100"/>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    value={u?.email || ""}
                    disabled
                    readOnly
                    className="
                      bg-gray-200 dark:bg-zinc-700
                      border border-black dark:border-white
                      disabled:opacity-100"/>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white">
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}