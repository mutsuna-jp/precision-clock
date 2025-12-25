
// 読みやすさと液体感を両立するために、粒子数を増やして高密度にする
const POINTS_PER_DIGIT = 36; // 18 -> 36 に倍増

// 座標生成ヘルパー
function generatePoints(digit: number): number[][] {
  const points: number[][] = [];
  
  // 基本グリッド: 100x130
  // マージン考慮: 実質描画エリア 10-90, 10-120
  
  // 線分上の点を生成するヘルパー
  const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1 || 1);
      points.push([
        x1 + (x2 - x1) * t,
        y1 + (y2 - y1) * t
      ]);
    }
  };

  // 円弧上の点を生成するヘルパー (中心cx, cy, 半径rx, ry, 開始角, 終了角)
  const addArc = (cx: number, cy: number, rx: number, ry: number, startAngle: number, endAngle: number, count: number) => {
    for (let i = 0; i < count; i++) {
        // t is 0..1
        const t = i / (count - 1 || 1);
        const angle = startAngle + (endAngle - startAngle) * t;
        // SVG coordinate system: y increases downwards, angle usually clockwise from x-axis?
        // Math.cos/sin use standard cartesian. 
        // We want clockwise. 0 is Right, 90 (PI/2) is Bottom.
        const rad = angle * (Math.PI / 180);
        points.push([
            cx + rx * Math.cos(rad),
            cy + ry * Math.sin(rad)
        ]);
    }
  };
  
  // ベジェ曲線 (2次)
  const addQuad = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, count: number) => {
      for(let i=0; i<count; i++){
          const t = i / (count - 1 || 1);
          // Quadratic Bezier: (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
          const invT = 1 - t;
          points.push([
              invT*invT*x1 + 2*invT*t*cx + t*t*x2,
              invT*invT*y1 + 2*invT*t*cy + t*t*y2
          ]);
      }
  }

  // 数字ごとの定義
  switch (digit) {
    case 0:
      // 0: 大きな楕円 (時計回り)
      // 0度(右)からスタートして一周
      // 36点すべて使う
      addArc(50, 65, 35, 50, -90, 270, POINTS_PER_DIGIT); 
      break;

    case 1:
      // 1: 真ん中の縦線
      // 少し太さを出すために往復させるか、単純に点を重ねる
      // 液体感のためには少し揺らぎがあったほうがいいが、直線上に配置
      addLine(50, 15, 50, 115, POINTS_PER_DIGIT);
      break;

    case 2:
      // 2: 上のアーチ -> 斜め線 -> 下の横棒
      // 配分: アーチ(14) + 斜め(11) + 下(11) = 36
      // SVG座標系(y下正)で上を通るには 270度を経由する必要がある
      // 180(左) -> 270(上) -> 360(右)
      addArc(50, 45, 35, 30, 180, 360, 12); 
      // 右上(85, 45) あたりから 左下(15, 115) へ
      addLine(85, 45, 15, 115, 12);
      addLine(15, 115, 90, 115, 12);
      break;

    case 3:
      // 3: 上のアーチ(中心へ) -> 下のアーチ(中心から)
      // 上部: (50, 40)中心。左ちょい下(220度)から上を通って真下(450度=90度)へ
      // 下部: (50, 90)中心。真上(270度=-90度)から下を通って左(520度=160度)へ
      points.length = 0;
      addArc(50, 42, 30, 28, 220, 450, 16); 
      // つなぎ目 (50, 70) 付近から
      addArc(50, 88, 35, 32, 270, 520, 20);
      break;

    case 5:
      // 5: 上横棒 -> 左縦 -> 下アーチ
      // 上横(8) + 左縦(6) + 下アーチ(22)
      // 上横: 右から左へ (85,15 -> 25,15)
      addLine(90, 15, 25, 15, 8);
      // 左縦: (25,15 -> 20,65)
      addLine(25, 15, 20, 65, 6);
      // 下アーチ: (52, 92)中心。左上(200度)からぐるっと左下(500度)へ
      // 200(左上) -> 270(上) -> 360(右) -> 450(下) -> 500(左下)
      addArc(55, 92, 35, 30, 210, 510, 22); 
      break;

    case 6:
      // 6: 上のカーブ -> 下のループ
      // Cのようなカーブ(12) + 下の円(24)
      addArc(60, 85, 35, 35, -45, 360, 24); // 下のループ
      // 上のひげ: ループの右上あたりから左上へ
      addQuad(85, 60, 10, 50, 45, 10, 12); // 逆順?
      // 順番を揃えるのが大事だが、液体なのである程度混ざっても面白い
      points.length=0;
      // 上から下へ描く
      addQuad(50, 10, 10, 40, 15, 80, 12);
      addArc(50, 85, 35, 35, 180, 360+180, 24);
      break;

    case 7:
      // 7: 上横 -> 斜め下
      addLine(10, 15, 90, 15, 12);
      addLine(90, 15, 40, 120, 24);
      break;

    case 8:
      // 8: 上の円(18) + 下の円(18)
      addArc(50, 40, 30, 25, -90, 270, 18);
      addArc(50, 90, 35, 30, -90, 270, 18);
      // 上下の接合部をきれいにするには、8の字書き順が良いが、円2つで安定
      break;

    case 9:
      // 9: 上のループ -> 下のひげ
      addArc(50, 40, 35, 30, 90, 360+90, 22); // 上ループ
      // 右横から下へ
      addLine(85, 40, 85, 70, 4);
      addQuad(85, 70, 80, 120, 30, 110, 10);
      break;
      
    // デフォルト: 0
    default:
      addArc(50, 65, 35, 50, -90, 270, POINTS_PER_DIGIT); 
      break;
  }

  // ポイント数が足りない/多い場合の安全策 (fill/trim)
  // 多い場合はカット、少ない場合は最後の点を複製
  if (points.length > POINTS_PER_DIGIT) {
    points.length = POINTS_PER_DIGIT;
  } else {
    while (points.length < POINTS_PER_DIGIT) {
      const last = points[points.length - 1];
      points.push([...last]); // Clone
    }
  }

  return points;
}

// 事前生成してエクスポート
export const DIGIT_PARTICLES = [0,1,2,3,4,5,6,7,8,9].map(generatePoints);
