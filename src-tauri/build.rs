use std::path::PathBuf;

fn main() {
  let paddle_c_install_dir = option_env!("LIB_PADDLE_C_INSTALL_DIR").unwrap_or("");
  let paddle_c_install_dir = PathBuf::from(paddle_c_install_dir);

  // println!("cargo:warning={:?}", paddle_c_install_dir);
  
  let manifest_dir = env::var("CARGO_MANIFEST_DIR");

  tauri_build::build()
}
