use wasm_bindgen::prelude::*;
use colorgrad::Gradient;
extern crate console_error_panic_hook;

const Q: f64 = 1.0;
const C: f64 = 2.0;

#[wasm_bindgen]
pub fn setup() {
  console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn render_field(
  buffer: &mut [u8],
  width: usize,
  height: usize,
  t: f64,
) {
  let scale = 4.0 / (width.min(height) as f64);

  let mut max_phi = 3.0;
  let grad = colorgrad::preset::rd_bu();

  // Write pixels
  let mut idx = 0;
  for j in 0..height {
    for i in 0..width {
      let x = (i as f64 - width as f64 / 2.0) * scale;
      let y = (j as f64 - height as f64 / 2.0) * scale;

      let v = scalar_potential(x, y, t) / max_phi;
      let v = 0.5 + 0.5*v.clamp(-1.0, 1.0);
      buffer[idx..idx+4].copy_from_slice(&grad.at(v as f32).to_rgba8()[..]);
      idx += 4;
    }
  }
}

#[wasm_bindgen]
pub struct Coord {
  pub x: f64,
  pub y: f64,
}

#[wasm_bindgen]
pub fn position(t: f64) -> Coord {
  let (x, y, vx, vy) = trajectory(t);
  Coord {x, y}
}


// ---------------- Physics ----------------


fn trajectory(t: f64) -> (f64, f64, f64, f64) {
  // Oscillating trajectory
  let a = 0.5;
  let w = 0.85 * C / a;
  let x = a * (w * t).sin();
  let vx = a * w * (w * t).cos();
  let y = 0.5*a * (w * t).cos();
  let vy = -0.5*a * w * (w * t).sin();
  (x, y, vx, vy)
}

fn retarded_time(x: f64, y: f64, t: f64) -> f64 {
  let mut lo = t - 10.0;
  let mut hi = t;

  const PREC: f64 = 1e-6;
  for _ in 0..30 {
    let tr = 0.5 * (lo + hi);
    let (px, py, _, _) = trajectory(tr);
    let r2 = (x - px).powi(2) + (y - py).powi(2);
    let ds2 = (C * (t - tr)).powi(2) - r2;
    // inside lightcone => too far in the past
    if ds2 > PREC {
      lo = tr;
    }
    // outside lightcone => too far in the future
    else if ds2 < -PREC {
      hi = tr;
    }
    // correct to within prec
    else {
      return tr;
    }
  }
  0.5 * (lo + hi)
}

fn scalar_potential(x: f64, y: f64, t: f64) -> f64 {
  let tr = retarded_time(x, y, t);
  let (px, py, vx, vy) = trajectory(tr);

  let rx = x - px;
  let ry = y - py;
  let r = (rx * rx + ry * ry).sqrt() + 1e-6;

  let vdotr = vx * rx + vy * ry;
  Q / (r - vdotr / C)
}
