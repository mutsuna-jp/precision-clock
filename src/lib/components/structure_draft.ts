
// Coordinates for 0-9 on a 100x120 grid.
// Each digit must have exactly the same number of points to interpolate smoothly.
// We use a 12-point loop. 
// The points are roughly ordered clockwise starting from top-center.
// We rely on fill-rule="evenodd" to handle holes (like in 0, 6, 8, 9, 4).

export const digitPoints: number[][][] = [
    // 0
    [
      [50, 10], [80, 10], [100, 30], [100, 90], 
      [80, 110], [50, 110], [20, 110], [0, 90], 
      [0, 30], [20, 10], [30, 20], [70, 20]  
      // Inner loop details are simulated by the outer loop overlapping or using 'evenodd' logic?
      // Actually, a simple loop 0 usually has a hole. 
      // To create a hole with a single path in evenodd, we need to loop *inwards*.
      // Let's try a simpler approach: Complex stroke?
      // No, "Morphing" usually implies the shape itself.
      // Let's try 18 points.
    ],
    // ... This is going to be hard to guess coordinates that look good.
];

// PLAN B: Use a simpler Segment-based morph.
// Imagine a 7-segment display where the segments are thick blobs.
// When changing numbers, the blobs move and merge.
// This is easier and guarantees legibility.
// BUT user asked for "Liquid/Clay like morph" transforming to next digit.
// The best way is to interpolate the PATH DATA.

// Let's try a standard "Rounded Digit" set. 
// I will defining 0-9 using 14 control points.
// Function to generate smooth curve through points (Catmull-Rom or Bezier).
