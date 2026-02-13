// Example order creation using form data
// Endpoint: POST https://800pharmacy.ae/api_panel/v2/orders/create

const createOrder = async () => {
  const formData = new FormData();
  
  // Required fields
  formData.append('first_name', 'Rayyan');
  formData.append('last_name', 'Ansari');
  formData.append('contact_number', '+971502056544');
  formData.append('building', 'Alqouz');
  formData.append('unit', '800');
  formData.append('payment_method', 'cash');
  formData.append('with_insurance', '0');
  formData.append('with_prescription', '0');
  
  // IMPORTANT: Products must use 'sku' and 'qty' (NOT 'product_id' and 'quantity')
  // Wrong:  [{"product_id": 1, "quantity": 1}]
  // Correct: [{"sku": "12345", "qty": 1}]
  const products = [
    { sku: '12345', qty: 1 }
  ];
  formData.append('products', JSON.stringify(products));

  const response = await fetch('https://800pharmacy.ae/api_panel/v2/orders/create', {
    method: 'POST',
    headers: {
      'X-Partner-Id': 'YOUR_PARTNER_ID',
      'X-Security-Code': 'YOUR_SECURITY_CODE',
    },
    body: formData
  });

  const result = await response.json();
  console.log(result);
};

// If using Axios
import axios from 'axios';

const createOrderWithAxios = async () => {
  const formData = new FormData();
  
  formData.append('first_name', 'Rayyan');
  formData.append('last_name', 'Ansari');
  formData.append('contact_number', '+971502056544');
  formData.append('building', 'Alqouz');
  formData.append('unit', '800');
  formData.append('payment_method', 'cash');
  formData.append('with_insurance', '0');
  formData.append('with_prescription', '0');
  
  // Use 'sku' and 'qty' fields!
  const products = [{ sku: '12345', qty: 1 }];
  formData.append('products', JSON.stringify(products));

  try {
    const response = await axios.post(
      'https://800pharmacy.ae/api_panel/v2/orders/create',
      formData,
      {
        headers: {
          'X-Partner-Id': 'YOUR_PARTNER_ID',
          'X-Security-Code': 'YOUR_SECURITY_CODE',
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};

// With prescription upload
const createOrderWithPrescription = async (prescriptionFile) => {
  const formData = new FormData();
  
  formData.append('first_name', 'Rayyan');
  formData.append('last_name', 'Ansari');
  formData.append('contact_number', '+971502056544');
  formData.append('building', 'Alqouz');
  formData.append('unit', '800');
  formData.append('payment_method', 'cash');
  formData.append('with_insurance', '0');
  formData.append('with_prescription', '1');
  
  const products = [{ sku: '12345', qty: 1 }];
  formData.append('products', JSON.stringify(products));
  
  // Add prescription file
  formData.append('file_0', prescriptionFile);

  const response = await fetch('https://800pharmacy.ae/api_panel/v2/orders/create', {
    method: 'POST',
    headers: {
      'X-Partner-Id': 'YOUR_PARTNER_ID',
      'X-Security-Code': 'YOUR_SECURITY_CODE',
    },
    body: formData
  });

  return response.json();
};
