use paddle_inference_api_sys::{PD_TensorCopyFromCpuFloat, PD_TensorCopyFromCpuUint8, PD_TensorCopyFromCpuInt8, PD_TensorCopyFromCpuInt32, PD_TensorCopyFromCpuInt64};

use crate::PdTensor;

pub trait CopyPdInput {
    fn copy_pd_input(self, tensor: &PdTensor);
}

impl CopyPdInput for Vec<f32> {
    fn copy_pd_input(mut self, tensor: &PdTensor) {
        let ptr = self.as_mut_ptr();
        std::mem::forget(self);

        unsafe {
            PD_TensorCopyFromCpuFloat(tensor.get_raw_tensor_ptr(), ptr);
        };
    }
}

impl CopyPdInput for Vec<u8> {
    fn copy_pd_input(mut self, tensor: &PdTensor) {
        let ptr = self.as_mut_ptr();
        std::mem::forget(self);

        unsafe {
            PD_TensorCopyFromCpuUint8(tensor.get_raw_tensor_ptr(), ptr);
        };
    }
}

impl CopyPdInput for Vec<i8> {
    fn copy_pd_input(mut self, tensor: &PdTensor) {
        let ptr = self.as_mut_ptr();
        std::mem::forget(self);

        unsafe {
            PD_TensorCopyFromCpuInt8(tensor.get_raw_tensor_ptr(), ptr);
        };
    }
}

impl CopyPdInput for Vec<i32> {
    fn copy_pd_input(mut self, tensor: &PdTensor) {
        let ptr = self.as_mut_ptr();
        std::mem::forget(self);

        unsafe {
            PD_TensorCopyFromCpuInt32(tensor.get_raw_tensor_ptr(), ptr);
        };
    }
}

impl CopyPdInput for Vec<i64> {
    fn copy_pd_input(mut self, tensor: &PdTensor) {
        let ptr = self.as_mut_ptr();
        std::mem::forget(self);

        unsafe {
            PD_TensorCopyFromCpuInt64(tensor.get_raw_tensor_ptr(), ptr);
        };
    }
}
