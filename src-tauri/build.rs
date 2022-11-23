// use std::{path::PathBuf, env, process::Command};

fn main() {
    tauri_build::build()
}

// fn main() {
//   let paddle_c_install_dir = option_env!("LIB_PADDLE_C_INSTALL_DIR").unwrap_or("");
//   let paddle_c_install_dir = PathBuf::from(paddle_c_install_dir);

//   // println!("cargo:warning={:?}", paddle_c_install_dir);

//   let manifest_dir = env::var("CARGO_MANIFEST_DIR");

//   println!("cargo:warning={:?}", paddle_c_install_dir);

//   // println!("cargo rustc -- -C link-args=\"-Wl,-rpath,@executable_path/../lib\"");
//   // println!("cargo rustc -- -C link-args=\"-Wl,-rpath,/Users/dmalkov/Documents/biba-ltd/rust/paddle-wrapper/paddle_c_2.3/paddle/lib\"");

//   tauri_build::build();

//   #[cfg(target_os = "macos")]
//   link_paddle_rpath();

//   // install_name_tool -add_rpath "@executable_path/../Frameworks" path/to/binary
// }

// #[cfg(target_os = "macos")]
// fn link_paddle_rpath() {
//     use std::path::Path;

//   let out_dir = env::var("OUT_DIR").unwrap();

//   // let primary_package = env::var("CARGO_PRIMARY_PACKAGE").unwrap();
//   // let bin_exe = env::var("CARGO_BIN_EXE_chinese-text-analyzer").unwrap();
//   // println!("cargo:warning=primary_package {}", primary_package);
//   // println!("cargo:warning=bin_exe {}", bin_exe);
//   let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
//   let target_dir = Path::new(&manifest_dir)
//     .parent()
//     .unwrap()
//     .join("target")
//     .join("debug");
//   println!("cargo:warning=taget_dir {}", target_dir.display());

//   let app_path = PathBuf::from(target_dir)
//     // .join("bundle")
//     // .join("macos")
//     .join("chinese-text-analyzer");

//   println!("cargo:warning=app path: {:?}", app_path.display());

//   Command::new("install_name_tool")
//     .args([
//       "-add_rpath",
//       "@executable_path/../lib",
//       &app_path.display().to_string()
//     ])
//     .output()
//     .expect("failed to update rpath");
// }
