use std::ffi::{CString, CStr};

use paddle_inference_api_sys::{PD_Predictor, PD_PredictorCreate, PD_PredictorDestroy, PD_PredictorGetInputNames, PD_OneDimArrayCstrDestroy, PD_PredictorGetOutputNames, PD_PredictorGetInputHandle, PD_PredictorGetOutputHandle, PD_PredictorRun, PD_PredictorClearIntermediateTensor, PD_PredictorTryShrinkMemory};

use crate::{config::PdConfig, tensor::PdTensor};

fn c_str_arr_to_rust_vec(size: u64, data: *mut *mut i8) -> Vec<String> {
    let mut res: Vec<String> = vec![];

    for i in 0..size {
        let item_ptr = unsafe { data.offset(i.try_into().unwrap()) };
        let cstr = unsafe { CStr::from_ptr(*item_ptr) };
        let rust_str = cstr.to_str().unwrap().to_owned();
        
        res.push(rust_str);
    }

    res
}

#[derive(Debug)]
pub struct PdPredictor {
    raw_predictor_ptr: *mut PD_Predictor,
}

impl Drop for PdPredictor {
    fn drop(&mut self) {
        unsafe { PD_PredictorDestroy(self.raw_predictor_ptr) };
    }
}

impl PdPredictor {
    /// Create a new Predictor
    pub fn new(config: &PdConfig) -> Self {
        let raw_predictor_ptr = unsafe {
            PD_PredictorCreate(config.get_raw_config_ptr())
        };

        Self {
            raw_predictor_ptr
        }
    }

    pub fn get_raw_predictor_ptr(&self) -> *mut PD_Predictor {
        self.raw_predictor_ptr
    }

    /// Get input names
    pub fn get_input_names(&self) -> Vec<String> {
        let input_names_ptr = unsafe {
            PD_PredictorGetInputNames(self.raw_predictor_ptr)
        };
        let input_names = unsafe { *input_names_ptr };

        let names_count = input_names.size;
        let names_arr = input_names.data;

        let input_names_vec = c_str_arr_to_rust_vec(names_count, names_arr);

        unsafe {
            PD_OneDimArrayCstrDestroy(input_names_ptr);
        };

        input_names_vec
    }

    /// Get the Input Tensor
    pub fn get_input_handle(&self, name: &str) -> PdTensor {
        let name_cstring = CString::new(name).unwrap();

        let handle = unsafe {
            PD_PredictorGetInputHandle(self.raw_predictor_ptr, name_cstring.as_ptr())
        };

        PdTensor::new(handle)
    }

    /// Get the output names
    pub fn get_output_names(&self) -> Vec<String> {
        let output_names_ptr = unsafe {
            PD_PredictorGetOutputNames(self.raw_predictor_ptr)
        };
        let output_names = unsafe { *output_names_ptr };

        let names_count = output_names.size;
        let names_arr = output_names.data;

        let output_names_vec = c_str_arr_to_rust_vec(names_count, names_arr);

        unsafe {
            PD_OneDimArrayCstrDestroy(output_names_ptr);
        }

        output_names_vec
    }

    /// Get the Output Tensor
    pub fn get_output_handle(&self, name: &str) -> PdTensor {
        let name_cstring = CString::new(name).unwrap();

        let handle = unsafe {
            PD_PredictorGetOutputHandle(self.raw_predictor_ptr, name_cstring.as_ptr())
        };
        
        PdTensor::new(handle)
    }

    /// Run the prediction engine
    pub fn run(&self) -> bool {
        let res = unsafe { PD_PredictorRun(self.raw_predictor_ptr) };
        
        res == 1
    }

    /// Clear the intermediate tensors of the predictor
    /// 
    pub fn clear_intermediate_tensor(&self) {
        unsafe {
            PD_PredictorClearIntermediateTensor(self.raw_predictor_ptr);
        };
    }

    /// Release all tmp tensor to compress the size of the memory pool.
    /// The memory pool is considered to be composed of a list of chunks, if
    /// the chunk is not occupied, it can be released.
    /// 
    /// Returns Number of bytes released. It may be smaller than the actual
    /// released memory, because part of the memory is not managed by the
    /// MemoryPool.
    pub fn try_shrink_memory(&self) -> u64 {
        unsafe {
            PD_PredictorTryShrinkMemory(self.raw_predictor_ptr)
        }
    }
}
