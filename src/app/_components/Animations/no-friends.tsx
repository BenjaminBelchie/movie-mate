"use client";
import Lottie from "lottie-react";
import noFriends from "./no-friends.json";

export default function NoFriendsAnimation() {
  return <Lottie animationData={noFriends} loop={true} />;
}
