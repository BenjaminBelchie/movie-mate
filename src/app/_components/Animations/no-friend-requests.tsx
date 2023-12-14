"use client";
import Lottie from "lottie-react";
import noRequests from "./no-friend-requests.json";

export default function NoFriendRequestsAnimation() {
  return <Lottie animationData={noRequests} loop={true} />;
}
