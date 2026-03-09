// Profile Page
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/context/profile-context";
import Layout from "@/components/Layout";

import toast from "react-hot-toast";
import { User } from "@/context/types"; // Import your base interface
interface ProfileUser extends User {
  createdAt: string;
  updatedAt?: string;
}
export default function ProfilePage() {
  const { token, user: authUser } = useAuth();
  const { setProfile } = useProfile();
  console.log("token in Profile page", token);
  console.log("user in profile page", authUser);
  // User data states
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [updating, setUpdating] = useState(false);

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL;
  // Fetch user profile data
  const fetchProfile = useCallback(async () => {
    console.log("Fetching user profile...");
    console.log("user in profile page", authUser);
    try {
      if (!token || !authUser?._id) {
        console.log("No token or user ID available");
        return;
      }

      const res = await fetch(
        `${backendUrl}/api/profile/user/${authUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Profile data received:", data);
      const profileUser: ProfileUser = {
        ...data.data.profile,
        name: data.data.profile.user.name, // Flatten name to top level
        email: data.data.profile.user.email,
      };

      console.log("profile user", profileUser);
      if (data?.data?.profile) {
        setProfile(profileUser);
        setProfileData(profileUser);
        setEditedName(data.data.profile.user.name);
        setEditedEmail(data.data.profile.user.email);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [token, authUser, setProfile, backendUrl]);
  useEffect(() => {
    if (token && authUser?._id) fetchProfile();
  }, [token, authUser?._id, fetchProfile]);

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim() || !editedEmail.trim()) {
      return alert("Name and email are required");
    }

    setUpdating(true);

    try {
      console.log("entered update try block");
      const res = await fetch(`http://localhost:5000/api/profile/basic`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      const updatedProfile = {
        ...profileData!,
        name: editedName,
        email: editedEmail,
        updatedAt: new Date().toISOString(),
      };
      setProfileData(updatedProfile);
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        duration: 4000,
      });

      // Update local state

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match");
    }

    if (newPassword.length < 6) {
      return alert("New password must be at least 6 characters long");
    }

    setChangingPassword(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/auth/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to change password");

      toast.success("Password changed successfully!", {
        position: "top-right",
        duration: 4000,
      });

      // Reset password form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(authUser?.name || "");
    setEditedEmail(authUser?.email || "");
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">Failed to load profile data</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">My Profile</h1>

        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-pink-700 px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-amber-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-pink-600"
                  placeholder="Your email"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-lg text-gray-900">{profileData.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{profileData.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {profileData.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(profileData.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Change Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">
              Keep your account secure by regularly updating your password.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
