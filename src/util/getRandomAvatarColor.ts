export default function getRandomAvatarColor():
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger" {
  const colors = ["primary", "secondary", "success", "warning", "danger"];

  const randomColor = colors[Math.floor(Math.random() * colors.length)] as
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";

  return randomColor;
}
