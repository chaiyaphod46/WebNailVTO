// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet Style
const style = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 6 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 6 },
  4: { color: "red", size: 10 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "purple", size: 10 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "green", size: 10 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "orange", size: 10 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "yellow", size: 10 },
};

export const drawHand = (predictions, ctx) => {
  // ตรวจสอบว่ามี predictions หรือไม่
  if (predictions.length > 0) {
    // วนลูปผ่านแต่ละ prediction
    predictions.forEach((prediction) => {
      // ดึงข้อมูลตำแหน่งของ landmarks
      const landmarks = prediction.landmarks;

      // แสดงเฉพาะจุดปลายนิ้ว (4, 8, 12, 16, 20)
      const fingertipIndices = [4, 8, 12, 16, 20];
      fingertipIndices.forEach((index) => {
        const x = landmarks[index][0];
        const y = landmarks[index][1];
        const z = landmarks[index][2]; // ความลึก Z ที่สามารถใช้ได้ถ้าจำเป็น

        // วาดวงกลมที่จุดปลายนิ้ว
        ctx.beginPath();
        ctx.arc(x, y, style[index]["size"], 0, 3 * Math.PI);

        // ตั้งสีและขนาดของวงกลม
        ctx.fillStyle = style[index]["color"];
        ctx.fill();
      });
    });
  }
};