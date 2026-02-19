import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import axiosApiCall from "@/lib/axiosApiCall";
import { ProfilePicture } from "@/components/ui/ProfilePicture";
import { format } from "date-fns";

const StarRating = ({ value, max = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < value
              ? "dark:text-yellow-400 text-yellow-400" : "text-gray-600 dark:text-gray-200"
          }`}>★</span>
      ))}
    </div>
  );
};

const RatingsLayout = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axiosApiCall.get(
          "/api/v1/package/ratings/ratings"
        );
        setRatings(response?.data?.ratings || []);
      } catch {
        setError("Failed to fetch ratings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) return <p>Loading ratings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Ratings</h1>

      {ratings.length === 0 ? (
        <p className="text-gray-600">No ratings found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratings.map((rating) => (
            <Card
              key={rating._id}
              className="dark:border-gray-100 border-gray-900 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <ProfilePicture className="w-12 h-12">
                    <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-red-600">
                      <img
                        src={
                          rating.userId?.profilePicture || "/defaultprofpic.png"
                        }
                        alt={`${rating.userId?.firstName || ""} ${
                          rating.userId?.lastName || ""
                        }`}
                        className="w-full h-full object-cover"/>
                    </div>
                  </ProfilePicture>

                  <div>
                    <CardTitle className="dark:text-gray-100 text-gray-900 text-lg font-semibold">
                      {rating.userId?.firstName || "—"}{" "}
                      {rating.userId?.lastName || ""}
                    </CardTitle>
                    <p className="text-sm dark:text-gray-100 text-gray-900">
                      {rating.ratingDate
                        ? format(new Date(rating.ratingDate), "PPP")
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2">
                  <StarRating value={rating.rating}/>
                  <span className="text-sm dark:text-gray-100 text-gray-900">
                    ({rating.rating}/5)
                  </span>
                </div>

                <p className="dark:text-gray-100 text-gray-900 mt-2">
                  {rating.comment || "No comment provided."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingsLayout;