use paddle_inference_api_sys::{PD_TensorCopyToCpuInt64, PD_TensorCopyToCpuFloat, PD_TensorCopyToCpuUint8, PD_TensorCopyToCpuInt8, PD_TensorCopyToCpuInt32};

use crate::PdTensor;

pub trait CopyPdOutput {
    fn copy_pd_output(&mut self, tensor: &PdTensor);
}

impl CopyPdOutput for Vec<f32> {
    fn copy_pd_output(&mut self, tensor: &PdTensor) {
        unsafe {
            PD_TensorCopyToCpuFloat(tensor.get_raw_tensor_ptr(), self.as_mut_ptr());
        }
    }
}

impl CopyPdOutput for Vec<u8> {
    fn copy_pd_output(&mut self, tensor: &PdTensor) {
        unsafe {
            PD_TensorCopyToCpuUint8(tensor.get_raw_tensor_ptr(), self.as_mut_ptr());
        }
    }
}

impl CopyPdOutput for Vec<i8> {
    fn copy_pd_output(&mut self, tensor: &PdTensor) {
        unsafe {
            PD_TensorCopyToCpuInt8(tensor.get_raw_tensor_ptr(), self.as_mut_ptr());
        }
    }
}

impl CopyPdOutput for Vec<i32> {
    fn copy_pd_output(&mut self, tensor: &PdTensor) {
        unsafe {
            PD_TensorCopyToCpuInt32(tensor.get_raw_tensor_ptr(), self.as_mut_ptr());
        }
    }
}

impl CopyPdOutput for Vec<i64> {
    fn copy_pd_output(&mut self, tensor: &PdTensor) {
        unsafe {
            PD_TensorCopyToCpuInt64(tensor.get_raw_tensor_ptr(), self.as_mut_ptr());
        }
    }
}
