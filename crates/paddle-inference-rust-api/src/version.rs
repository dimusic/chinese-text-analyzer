use std::ffi::CStr;

use paddle_inference_api_sys::PD_GetVersion;

/// Get version info.
pub fn get_version() -> String {
    let version_c = unsafe { CStr::from_ptr(PD_GetVersion()) };

    version_c.to_str().unwrap().to_owned()
}
