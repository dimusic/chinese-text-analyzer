extern crate bindgen;

use std::env;
use std::path::PathBuf;
use std::process::Command;
use std::fs;
use std::io::ErrorKind;

fn main() {
    // paddle_c download from https://paddleinference.paddlepaddle.org.cn/master/user_guides/download_lib.html
    // Linux - LD_LIBRARY_PATH
    // MacOS - DYLD_FALLBACK_LIBRARY_PATH
    // Windows - PATH
    //
    // All - LIB_PADDLE_C_INSTALL_DIR
    
    println!("cargo:rerun-if-changed=paddle_wrapper.h");

    let paddle_c_install_dir = option_env!("LIB_PADDLE_C_INSTALL_DIR").unwrap_or("");
        // .expect("LIB_PADDLE_C_INSTALL_DIR is not set");

    let paddle_c_install_dir = PathBuf::from(paddle_c_install_dir);
    
    println!("cargo:rustc-link-search=native={}", paddle_c_install_dir.join("paddle").join("lib").display());
    println!("cargo:rustc-link-lib=dylib=paddle_inference_c");
    
    let bindings = bindgen::Builder::default()
        .rustfmt_bindings(true)
        .header("./paddle_wrapper.h")
        .detect_include_paths(true)
        .generate()
        .expect("Unable to generate bindings");

    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("paddle_bindings.rs"))
        .expect("Couldn't write bindings!");
}

fn run(cmd: &mut Command) {
    println!("cargo:warning=running: {:?}", cmd);

    let status = match cmd.status() {
        Ok(status) => status,
        Err(ref e) if e.kind() == ErrorKind::NotFound => {
            fail(&format!(
                "failed to execute command: {}\nis not installed?",
                e
            ));
        }
        Err(e) => fail(&format!("failed to execute command: {}", e)),
    };
    if !status.success() {
        fail(&format!(
            "command did not execute successfully, got: {}",
            status
        ));
    }
}

#[allow(dead_code)]
fn build_paddle() -> PathBuf {
    let manifest_path = PathBuf::from(env::var_os("CARGO_MANIFEST_DIR").unwrap());
    let out_dir = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let install_dir = out_dir.join("build");

    if !install_dir.join("CMakeCache.txt").exists() {
        let _ = fs::create_dir(install_dir.clone());
    
        let mut cmake_configure_cmd = Command::new("cmake");
    
        cmake_configure_cmd.current_dir(install_dir.clone());
        cmake_configure_cmd.env_remove("TARGET");
        cmake_configure_cmd.args([
            "-DWITH_TESTING=OFF",
            "-DWITH_PYTHON=OFF",
            "-DWITH_AVX=OFF",
            "-DWITH_MKL=OFF",
            "-DWITH_GPU=OFF",
            "-DON_INFER=ON",
            // "-DPY_VERSION=3.10",
            "-DWITH_NCCL=OFF",
            "-DWITH_RCCL=OFF",
            "-DWITH_POCKETFFT=OFF",
            "-DCMAKE_BUILD_TYPE=Release",
            &format!("-DCMAKE_INSTALL_PREFIX={}", install_dir.display()),
            &format!("{}", manifest_path.join("Paddle").display())
        ]);
    
        run(&mut cmake_configure_cmd);
    }
    else {
        println!("cargo:warning=cmake configuration found. Skipping config step");
    }

    if !install_dir.join("bin").join("paddle").exists() {
        let mut cmake_build_cmd = Command::new("cmake");
        cmake_build_cmd.current_dir(install_dir.clone());
        cmake_build_cmd.env_remove("TARGET");
        cmake_build_cmd.args([
            "--build",
            ".",
            "--target",
            "paddle_inference_c",
            "--config",
            "Release",
            "--parallel",
            "4",
        ]);

        run(&mut cmake_build_cmd);

        let mut make_install_cmd = Command::new("make");
        make_install_cmd.current_dir(install_dir.clone());
        make_install_cmd.env_remove("TARGET");
        make_install_cmd.args([
            "install",
            "-j4"
        ]);
        run(&mut make_install_cmd);
    }
    else {
        println!("cargo:warning=paddle binary found. Skipping build step");
    }

    install_dir
}

fn fail(s: &str) -> ! {
    panic!("\n{}\n\nbuild script failed, must exit now", s)
}
