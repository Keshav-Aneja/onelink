const colors = [
  "#FF5733",
  "#FF8C00",
  "#FFD700",
  "#ADFF2F",
  "#32CD32",
  "#00FA9A",
  "#00CED1",
  "#1E90FF",
  "#4169E1",
  "#8A2BE2",
  "#FF00FF",
  "#FF1493",
  "#DC143C",
  "#FF4500",
  "#DAA520",
  "#7FFF00",
  "#40E0D0",
  "#9932CC",
  "#FF69B4",
  "#FF6347",
];

export function getRandomColor() {
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}
