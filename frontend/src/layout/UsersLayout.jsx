import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import axiosApiCall from "@/lib/axiosApiCall";

const UsersLayout = () => {
  const [users, setUsers] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const { toast } = useToast();

  const LIMIT = 5;

  const fetchUsers = async (page = 1) => {
    try {
      const response = await axiosApiCall.get("/api/v1/user/all-users", {
        params: { page, limit: LIMIT },
      });

      const list = response?.data?.data ?? [];
      const total = Number(
        response?.data?.total ?? response?.data?.pagination?.totalUsers ?? 0
      );

      setUsers(Array.isArray(list) ? list : []);
      setTotalUsers(Number.isFinite(total) ? total : 0);
    } catch (err) {
      setUsers([]);
      setTotalUsers(0);

      toast({
        title: "Error",
        description: "An error occurred while fetching users.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers(currentLayout);
  }, [currentLayout]);

  const updateUserRole = async (userId, role) => {
    try {
      const response = await axiosApiCall.patch("/api/v1/user/change-role", {
        _id: userId,
        role,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: `User role updated to ${role}.`,
        });
        fetchUsers(currentLayout);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalUsers / LIMIT));

  const ROLE_OPTIONS = [
    { role: "User", label: "User" },
    { role: "DeliveryDriver", label: "Delivery Driver" },
    { role: "Agent", label: "Agent" }
  ];

  return (
    <div className="mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">All Users</h2>

      <Table className="text-foreground dark:text-dark-foreground w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 dark:text-gray-100">User Name</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Email</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Packages Total</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Money Spent</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Change Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length > 0 ? (
            users.map((user) => {
              const packagesTotal = Number(user?.packagesTotal ?? 0);
              const moneySpent = Number(user?.moneySpent ?? 0);
              const currentRole = String(user?.role ?? "User");

              const availableButtons = ROLE_OPTIONS.filter(
                (opt) => opt.role !== currentRole
              );

              return (
                <TableRow key={user._id}>
                  <TableCell>
                    {user?.firstName || ""} {user?.lastName || ""}
                  </TableCell>
                  <TableCell>{user?.email || ""}</TableCell>
                  <TableCell>
                    {Number.isFinite(packagesTotal) ? packagesTotal : 0}
                  </TableCell>
                  <TableCell>
                    €{Number.isFinite(moneySpent) ? moneySpent.toFixed(2) : "0.00"}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {availableButtons.map((btn) => (
                        <Button
                          key={btn.role}
                          className="
                            w-[160px] h-10 justify-center
                            border-2 border-gray-900 dark:border-gray-100
                            bg-red-600 dark:bg-red-600
                            hover:bg-red-700 dark:hover:bg-red-700"
                          onClick={() => updateUserRole(user._id, btn.role)}>
                          {btn.label}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan="5" className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4 items-center gap-3">
        <Button
          className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700"
          onClick={() => setCurrentLayout((p) => Math.max(1, p - 1))}
          disabled={currentLayout === 1}>
          Previous
        </Button>

        <span className="mx-2">
          Page {currentLayout} of {totalPages}
        </span>

        <Button
          className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700"
          onClick={() => setCurrentLayout((p) => Math.min(totalPages, p + 1))}
          disabled={currentLayout === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default UsersLayout;